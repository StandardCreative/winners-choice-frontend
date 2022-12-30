import { ethers } from "ethers"
import * as cfg from "../constants"
import contractData from "../contractArtifact"
import { shortenHash } from "../utils/utils"

const getContractInstance = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const networkId = window.ethereum.networkVersion
  const network = cfg.supportedNetworks.find(
    (network) => network.id === networkId
  )
  if (!network) throw new Error("unsupported network")

  return new ethers.Contract(
    network.contractAddress,
    contractData.abi,
    provider.getSigner()
  )
}

// export const makeMintTxPromise = (vals) => {
//   const contract = getContractInstance();
//   return contract.safeMint(vals.to);
// };

// export const sendMintTx = (vals, enqueueSnackbar) => {
//   const contract = getContractInstance();
//   const txPromise = contract.safeMint(vals.to);
//   sendTx(txPromise, enqueueSnackbar);
// };

export const parseRpcCallError = (error) => {
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
    res.userMsg = "no owner"
  } else if (res.fullMsg.indexOf("already minted") + 1) {
    res.userMsg = "This NFKeeTee was already meow-nted, try another!"
  } else if (res.fullMsg.indexOf("mint allowance exceeded") + 1) {
    res.userMsg = "You can't have an NFKeeTee (already minted or not a folio winner)"
  } else console.log("got error:", res)
  return res
}

export const getOwners = async (setNftOwners) => {
  // console.log("getOwners mock");
  // return
  const owners = []
  for (let i = 0; i < cfg.nNfts; i++) {
    //TODO parallelize - without too many requests at once
    let owner = ""
    try {
      if (true)
      owner = await sendReadTx("ownerOf", {
        tokenIdStr: (i + 1).toString(),
      })
    } catch (errObj) {
      if (
        errObj.fullMsg !== undefined &&
        errObj.fullMsg.indexOf("ERC721: invalid token ID") !== -1
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

export const sendReadTx = async (funcName, vals) => {
  if (funcName === "ownerOf")
    console.log("will try to get owner of tokenId ", vals.tokenIdStr)
  else console.log("sendReadtx: ", funcName)

  try {
    const contract = getContractInstance()
    let resPromise
    switch (funcName) {
      case "ownerOf":
        resPromise = contract.ownerOf(+vals.tokenIdStr)
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

export const sendTx = async (funcName, vals, enqueueSnackbar) => {
  console.log("sendtx: ", funcName)
  try {
    const contract = getContractInstance()
    let txPromise
    switch (funcName) {
      case "safeMint":
        console.log("will try to mint tokenId ", vals.tokenIdStr)
        txPromise = contract.safeMint(+vals.tokenIdStr)
        break

      case "resetWhitelist":
        console.log("will try to reset whitelist to: \n", vals.users)
        txPromise = contract.resetWhitelist(vals.users)
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
    console.log(tx.hash)
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
