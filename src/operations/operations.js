import { ethers } from "ethers"
import * as cfg from "../constants"
import contractData from "../contractArtifact"
import { shortenHash } from "../utils/utils"
import WCFactoryContractData from "../WCFactory"

const getContractInstance = (wccAddr) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  // const networkId = window.ethereum.networkVersion
  // const network = cfg.supportedNetworks.find(
  //   (network) => network.id === networkId
  // )
  // if (!network) throw new Error("unsupported network")

  return new ethers.Contract(wccAddr, contractData.abi, provider.getSigner())
}
const getWCFContractInstance = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const networkId = window.ethereum.networkVersion
  const network = cfg.supportedNetworks.find(
    (network) => network.id === networkId
  )
  if (!network) throw new Error("unsupported network")

  return new ethers.Contract(
    network.WCFactoryAddress,
    WCFactoryContractData.abi,
    provider.getSigner()
  )
}

// export const makeMintTxPromise = (vals) => {
//   const contract = getContractInstance();
//   return contract.mint(vals.to);
// };

// export const sendMintTx = (vals, enqueueSnackbar) => {
//   const contract = getContractInstance();
//   const txPromise = contract.mint(vals.to);
//   sendTx(txPromise, enqueueSnackbar);
// };

const parseRpcCallError = (error) => {
  const res = { ...cfg.RpcCallErrorInitVals }

  let txCodeObj = cfg.txCodes.find((x) => x.code === error.code)
  if (txCodeObj) {
    res.status = "RECOGNIZED_RPC_ERROR"
    res.code = txCodeObj.code
    res.userMsg = txCodeObj.userMsg
    res.level = txCodeObj.level
  } else {
    res.status = "OTHER_ERROR"
    res.code = error.code === undefined ? "" : `${error.code}`
    res.userMsg = "Error encountered"
    res.level = "error"
  }
  //populate the rest of the fields
  res.method = error.method ?? ""
  res.fullMsg = error.message ?? `${error}`

  //some errors can be recognized not by the code but by a part of the message
  if (res.fullMsg.indexOf("xpected nonce to be") + 1) {
    const ind = res.fullMsg.indexOf("xpected nonce to be")
    const indPt = res.fullMsg.indexOf(".", ind)
    const sentence = res.fullMsg.slice(ind, indPt)
    res.userMsg = "Set nonce: e" + sentence
  }
  //contract-specific errors
  else if (res.fullMsg.indexOf("not yet unlocked") + 1) {
    res.userMsg = "You are not yet unlocked, please wait"
  } else if (res.fullMsg.indexOf("ERC721: invalid token ID") + 1) {
    res.userMsg = "no owner" //shouldn't happen now that we have getOwner
  } else if (res.fullMsg.indexOf("already minted") + 1) {
    res.userMsg = "This NFKeeTee was already meownted, try another!"
  } else if (res.fullMsg.indexOf("can only mint 1") + 1) {
    res.userMsg = "You already meownted your NFKeeTee"
  } else if (res.fullMsg.indexOf("not whitelisted") + 1) {
    res.userMsg = "You can't have an NFKeeTee, you're not on the whitelist"
  } else console.log("got error:", res)
  return res
}

export const getOwners = async (wccAddr, setNftOwners) => {
  const owners = []
  for (let i = 0; i < cfg.nNfts; i++) {
    //TODO parallelize - without too many requests at once
    let owner = ""
    const tokenIdStr = i.toString()

    try {
      owner = await sendReadTx("getOwner", { tokenIdStr }, wccAddr)
      if (owner === cfg.UNMINTED_PLACEHOLDER_ADDR) owner = "Not yet minted"
    } catch (errObj) {
      if (
        errObj.fullMsg !== undefined &&
        errObj.fullMsg.indexOf("ERC721: invalid token ID") !== -1 //won't happen now
      ) {
        //this is a "good" error, expected when tokenId doesn't exist
        owner = "Not yet minted"
      }
    }
    owners.push(owner)
  }
  setNftOwners(owners)
  console.log("got owners:", owners)
}

export const sendReadTx = async (funcName, vals, wccAddr) => {
  console.log("wccAddr", wccAddr)
  if (funcName === "getOwner")
    console.log("will try to get owner of tokenId ", vals.tokenIdStr)
  else console.log("sendReadtx: ", funcName)

  try {
    let resPromise
    switch (funcName) {
      case "getOwner":
        resPromise = getContractInstance(wccAddr).getOwner(+vals.tokenIdStr)
        break
      case "getWCCaddress":
        resPromise = getWCFContractInstance().curWCCaddress()
        break
      default:
        throw new Error("Unsupported operation")
    }

    const res = await resPromise
    console.log("res", res)
    return res
  } catch (error) {
    const errObj = parseRpcCallError(error)
    throw errObj
  }
}

export const sendTx = async (
  funcName,
  vals,
  wccAddressRef,
  enqueueSnackbar
) => {
  console.log("sendtx: ", funcName)
  try {
    let txPromise
    let wcf
    switch (funcName) {
      case "mint":
        console.log("will try to mint tokenId ", vals.tokenIdStr)
        txPromise = getContractInstance(wccAddressRef.current).mint(
          +vals.tokenIdStr
        )
        break

      case "makeNewERC721":
        wcf = getWCFContractInstance()
        console.log("will try to deploy new NFT \n", vals.users)
        txPromise = wcf.makeNewERC721()
        break

      case "makeNewWCC":
        wcf = getWCFContractInstance()
        const interval = Math.round(vals.unlockInterval * 60)
        console.log("will try to deploy new WCC with:\nwhitelist", vals.users, "\nnft address:\n", vals.nftAddr, "\ninterval", interval, "sec")
        txPromise = wcf.makeNewWCC(vals.users, vals.nftAddr, interval)
        break

      default:
        throw new Error("Unsupported operation")
    }

    console.log("awaiting wallet confirmation")
    const tx = await txPromise
    const hashShort = shortenHash(tx.hash)
    enqueueSnackbar(`Tx ${hashShort} processing`, {
      autoHideDuration: cfg.DUR_SNACKBAR_TX,
    })
    console.log("tx hash:", tx.hash)
    //dispatchState({ type: Action.SET_TX_BEINGSENT, payload: tx.hash });
    const receipt = await tx.wait()
    console.log("tx receipt", receipt)

    if (receipt.status === 0) {
      // We can't know the exact error that made the transaction fail when it
      // was mined, so we throw this generic one.
      enqueueSnackbar(`Tx ${hashShort} failed`, {
        autoHideDuration: cfg.DUR_SNACKBAR,
        variant: "error",
      })
      throw new Error("Transaction failed, receipt has status = 0")
    }

    // If we got here, the transaction was successful
    enqueueSnackbar(`Tx ${hashShort} complete`, {
      autoHideDuration: cfg.DUR_SNACKBAR,
      variant: "success",
    })
    console.log("Tx successful")

    if (funcName === "makeNewWCC") {
      const eventData = receipt.events[0].args
      console.log(eventData, "full events", receipt.events)
      wccAddressRef.current = eventData.curWCCaddress
      alert(`Deployed new WCC contract at ${eventData.curWCCaddress}.
      
The associated NFT contract (with same media) is ${eventData.curNFTaddress}

The UI will be reset to interact with these new contracts.`)
    } else if (funcName === "makeNewERC721") {
      const eventData = receipt.events[1].args
      console.log(eventData, "full events", receipt.events)

      alert(
        `Deployed new NFT contract (with same media) at ${eventData.createdNFTaddress}.`
      )
      return eventData.createdNFTaddress
    }
  } catch (error) {
    const errObj = parseRpcCallError(error)

    enqueueSnackbar(errObj.userMsg, { variant: errObj.level })
    //dispatchState({ type: Action.SET_TX_ERR, payload: errObj.fullMsg });
  } finally {
    console.log("tx attempt done")

    //dispatchState({ type: Action.SET_TX_BEINGSENT, payload: undefined });
    //update all user info
    //await updateBalanceAndBetInfo(sstate);
  }
}
