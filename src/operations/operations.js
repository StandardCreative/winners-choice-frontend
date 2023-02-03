import { ethers } from "ethers"
import * as cfg from "../constants"
import { shortenHash } from "../utils/utils"
import contractData from "../WCController"
import WCDeployerContractData from "../WCDeployer"

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
    network.WCDeployerAddress,
    WCDeployerContractData.abi,
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
    res.userMsg = "This folio has already been minted, try another!"
  } else if (res.fullMsg.indexOf("no allowance") + 1) {
    res.userMsg = "You have no minting allowance"
  } else if (res.fullMsg.indexOf("no such folio") + 1) {
    res.userMsg = "There is no folio with this number"
  }
  // } else if (res.fullMsg.indexOf("not whitelisted") + 1) {
  //   res.userMsg = "You can't have an NFKeeTee, you're not on the whitelist"
  // }
  else console.log("got error:", res)
  return res
}
export const getMetadataAndOwners = async (
  wccAddr,
  setNftOwners,
  setMetadatas,
  setNFolios,
  setUnlockTime,
  userAddr
) => {
  console.log({ setUnlockTime, userAddr })
  await getUnlockTime(wccAddr, setUnlockTime, userAddr)
  await getMetadata(wccAddr, setMetadatas, setNFolios)
  await getOwners(wccAddr, setNftOwners)
}
export const getUnlockTimeAndOwners = async (
  wccAddr,
  setNftOwners,
  setUnlockTime,
  userAddr
) => {
  await getUnlockTime(wccAddr, setUnlockTime, userAddr)
  await getOwners(wccAddr, setNftOwners)
}

export const getUnlockTime = async (wccAddr, setUnlockTime, userAddr) => {
  console.log({ setUnlockTime, userAddr })
  if (wccAddr === cfg.WCC_ADDR_IF_WCF_HASNT_DEPLOYED_WCC_YET) {
    setUnlockTime(cfg.PLACEHOLDER_UNLOCK_TIME)
    return
  }
  try {
    console.log("fetching unlock time")
    const unlockTime = await sendReadTx(
      "getUnlockTimestamp",
      { userAddr },
      wccAddr
    )
    setUnlockTime(unlockTime)
  } catch (e) {
    console.log(e)
  }
}

export const getMetadata = async (wccAddr, setMetadatas, setNFolios) => {
  const jsonDataArray = []
  if (wccAddr === cfg.WCC_ADDR_IF_WCF_HASNT_DEPLOYED_WCC_YET) {
    setMetadatas(jsonDataArray)
    setNFolios(0)
    return
  }
  try {
    console.log("fetching n of folios")
    const nFolios = await sendReadTx("nFolios", {}, wccAddr)
    setNFolios(nFolios)

    const tokenURIs = await sendReadTx("getAllTokenURIs", {}, wccAddr)
    //get the json metadata for each token (which contains image URIs)
    for (let i = 0; i < nFolios; i++) {
      let uri = tokenURIs[i]
      if (tokenURIs[i].startsWith("ipfs://"))
        uri = `${cfg.ipfsWebPrefix}${tokenURIs[i].substr(7)}`
      console.log("fetching from", uri)

      // unfortunately fetching from ipfs sometimes fails, even after many retries
      // for now we will then substitute placeholder metadata
      let jsonData
      try {
        jsonData = await fetch(uri).then((resp) => resp.json())
      } catch (e) {
        jsonData = cfg.placeholderMetadata
      }
      if (jsonData.image?.startsWith("ipfs://"))
        jsonData.image = `${cfg.ipfsWebPrefix}${jsonData.image.substr(7)}`

      jsonDataArray.push(jsonData)
      console.log("setting metadatas", jsonDataArray.length)
      setMetadatas([...jsonDataArray])
      //setMetadatas(jsonDataArray => [...jsonDataArray])
    }
    console.log("json metadata acquired")
  } catch (e) {
    console.log(e)
  }
}
// export const getOwners = async (wccAddr, setNftOwners) => {
//   const owners = []
//   for (let i = 0; i < cfg.nNfts; i++) {
//     //TODO parallelize - without too many requests at once
//     let owner = ""
//     const tokenIdStr = i.toString()

//     try {
//       owner = await sendReadTx("getOwner", { tokenIdStr }, wccAddr)
//       if (owner === cfg.UNMINTED_PLACEHOLDER_ADDR) owner = "Not yet minted"
//     } catch (errObj) {
//       if (
//         errObj.fullMsg !== undefined &&
//         errObj.fullMsg.indexOf("ERC721: invalid token ID") !== -1 //won't happen now
//       ) {
//         //this is a "good" error, expected when tokenId doesn't exist
//         owner = "Not yet minted"
//       }
//     }
//     owners.push(owner)
//   }
//   setNftOwners(owners)
//   console.log("got owners:", owners)
// }

export const getOwners = async (wccAddr, setNftOwners) => {
  if (wccAddr === cfg.WCC_ADDR_IF_WCF_HASNT_DEPLOYED_WCC_YET) {
    setNftOwners([])
    return
  }
  try {
    const ownersReadOnly = await sendReadTx("getAllOwners", {}, wccAddr)
    const owners = [...ownersReadOnly]

    for (let i = 0; i < owners.length; i++)
      if (owners[i] === cfg.UNMINTED_PLACEHOLDER_ADDR)
        owners[i] = "Not yet minted"

    setNftOwners(owners)
    console.log("got owners:", owners)
  } catch (errObj) {
    console.log("failed to get owners, err:\n", errObj)
  }
}

export const sendReadTx = async (funcName, vals, wccAddr) => {
  //console.log("wccAddr", wccAddr)
  if (funcName === "getOwner")
    console.log("will try to get owner of tokenId ", vals.tokenIdStr)
  else console.log("sendReadtx: ", funcName)

  try {
    let resPromise
    switch (funcName) {
      case "getOwner":
        resPromise = getContractInstance(wccAddr).getOwner(+vals.tokenIdStr)
        break
      case "getAllOwners":
        resPromise = getContractInstance(wccAddr).getAllOwners()
        break
      case "getWCCaddress":
        resPromise = getWCFContractInstance().wccAddress()
        break
      case "nFolios":
        resPromise = getContractInstance(wccAddr).nFolios()
        break
      case "getUnlockTimestamp":
        resPromise = getContractInstance(wccAddr).getUnlockTimestamp(
          vals.userAddr
        )
        break
      case "getAllTokenURIs":
        resPromise = getContractInstance(wccAddr).getAllTokenURIs()
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

export const sendTx = async (funcName, vals, dataBundle, enqueueSnackbar) => {
  let res
  console.log("sendtx: ", funcName)
  try {
    let txPromise
    let wcf
    switch (funcName) {
      case "mint":
        console.log("will try to mint tokenId ", vals.tokenIdStr)
        txPromise = getContractInstance(dataBundle.wcc.current).mint(
          +vals.tokenIdStr
        )
        break

      case "makeNewERC721":
        wcf = getWCFContractInstance()
        console.log("will try to deploy new ERC721 with params: \n", { vals })
        txPromise = wcf.makeNewERC721(
          vals.nFolios,
          vals.baseURI,
          vals.suffixURI
        )
        break

      case "makeNewWCC":
        wcf = getWCFContractInstance()
        vals.unlockInterval = Math.round(+vals.unlockInterval * 60)
        console.log(
          "will try to deploy new WCC with:\nwinners list",
          vals.users,
          "\nnft address:\n",
          vals.nftAddr,
          "\ninterval",
          vals.unlockInterval,
          "sec"
        )
        txPromise = wcf.makeNewWCC(
          vals.users,
          vals.nftAddr,
          vals.unlockInterval
        )
        break

      default:
        throw new Error("Unsupported operation")
    }
    //common actions for all tx
    console.log("awaiting wallet confirmation")
    const tx = await txPromise
    const hashShort = shortenHash(tx.hash)
    enqueueSnackbar(`Tx ${hashShort} processing`, {
      autoHideDuration: cfg.DUR_SNACKBAR_TX,
    })
    console.log("tx hash:", tx.hash)

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
      autoHideDuration: cfg.DUR_SNACKBAR_SUCCESS,
      variant: "success",
    })
    console.log("Tx successful")

    //update state/refs (including logs) based on tx receipt info, alert user
    const logEntry = { action: funcName, txHash: tx.hash, vals: vals }
    let eventData
    switch (funcName) {
      case "mint":
        break

      case "makeNewWCC":
        eventData = receipt.events[0].args
        console.log({ eventData })
        dataBundle.wcc.current = eventData.wccAddress
        if (cfg.showMsgsInBrowserAlerts)
          alert(`Deployed new WCC contract at ${eventData.wccAddress}.
      
The associated NFT contract is ${eventData.nftAddress}

The UI will be reset to interact with these new contracts.`)

        dataBundle.setNftAddr(eventData.createdNFTaddress)
        logEntry.deployedAddr = eventData.wccAddress
        break

      case "makeNewERC721":
        eventData = receipt.events[1].args
        console.log({ eventData })

        if (cfg.showMsgsInBrowserAlerts)
          alert(`Deployed new NFT contract at ${eventData.createdNFTaddress}.`)

        dataBundle.setNftAddr(eventData.createdNFTaddress)
        logEntry.deployedAddr = eventData.createdNFTaddress
        res = eventData.createdNFTaddress
        break
    }
    dataBundle.setLogs((logs) => [...logs, logEntry])
  } catch (error) {
    const errObj = parseRpcCallError(error)

    enqueueSnackbar(errObj.userMsg, { variant: errObj.level })
  } finally {
    console.log("tx attempt done")
    return res
    //can update some user info here
  }
}
