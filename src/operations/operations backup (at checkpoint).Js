import { ethers } from "ethers";
import * as cfg from "../constants";
import contractData from "../contractArtifact";
import { shortenHash } from "../utils/utils";

const getContractInstance = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const networkId = window.ethereum.networkVersion;
  const network = cfg.supportedNetworks.find(
    (network) => network.id === networkId
  );
  if (!network) throw new Error("unsupported network");

  return new ethers.Contract(
    network.contractAddress,
    contractData.abi,
    provider.getSigner()
  );
};

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
  const res = { ...cfg.RpcCallErrorInitVals };
  let shouldLogErr = true;

  let txCodeObj = cfg.txCodes.find((x) => x.code === error.code);
  if (txCodeObj) {
    res.status = "RECOGNIZED_RPC_ERROR";
    res.code = txCodeObj.code;
    res.userMsg = txCodeObj.userMsg;
    res.level = txCodeObj.level;
  } else {
    res.status = "OTHER_ERROR";
    res.code = error.code === undefined ? "" : `${error.code}`;
    res.userMsg = "Error encountered";
    res.level = "error";
  }
  //populate the rest of the fields
  res.method = error.method ?? "";
  res.fullMsg = error.message ?? `${error}`;

  //contract-specific errors
  if (res.fullMsg.indexOf("not yet unlocked") + 1) {
    res.userMsg = "You are not yet unlocked, please wait";
    shouldLogErr = false;
  } else if (res.fullMsg.indexOf("ERC721: invalid token ID") + 1) {
    res.userMsg = "no owner"
    shouldLogErr = false;
  } else if (res.fullMsg.indexOf("already minted") + 1) {
    res.userMsg = "This NFKeeTee was already meow-nted, try another!"
    shouldLogErr = false;
  } 

  if (shouldLogErr) console.log("got error:", res);
  return res;
};

export const getOwners = async (setNftOwners) => {
  const owners = [];
  for (let i = 0; i < cfg.nNfts; i++) {
    //TODO parallelize
    const owner = await sendReadTx("ownerOf", {
      tokenIdStr: (i + 1).toString(),
    });
    if (owner.indexOf("ERC721: invalid token ID") !== -1) {
      //console.log("no owner for ", i + 1, owner);
      owners.push("Not yet minted");
    } else owners.push(owner);
  }
  setNftOwners(owners);
  console.log("got owners:", owners);
};

export const sendReadTx = async (funcName, vals) => {
  console.log("sendReadtx: ", funcName);
  try {
    const contract = getContractInstance();
    let resPromise;
    switch (funcName) {
      case "ownerOf":
        console.log("will try to get owner of tokenId ", vals.tokenIdStr);
        resPromise = contract.ownerOf(+vals.tokenIdStr);
        break;
      default:
        throw new Error("Unsupported operation");
    }

    const res = await resPromise;
    console.log("res", res);
    return res;
  } catch (error) {
    const errObj = parseRpcCallError(error);
    if (!["no owner"].includes(errObj.userMsg))
      console.log(errObj);
    return errObj.fullMsg; //TODO for now we use error message to determine if there's no owner
  }
};

export const sendTx = async (funcName, vals, enqueueSnackbar) => {
  console.log("sendtx: ", funcName);
  try {
    const contract = getContractInstance();
    let txPromise;
    switch (funcName) {
      case "safeMint":
        console.log("will try to mint tokenId ", vals.tokenIdStr);
        txPromise = contract.safeMint(+vals.tokenIdStr);
        break;

      default:
        throw new Error("Unsupported operation");
    }

    const tx = await txPromise;
    const hashShort = shortenHash(tx.hash);
    enqueueSnackbar(`Tx ${hashShort} processing`, {
      autoHideDuration: cfg.DUR_SNACKBAR_TX,
    });
    console.log(tx.hash);
    //dispatchState({ type: Action.SET_TX_BEINGSENT, payload: tx.hash });
    const receipt = await tx.wait();
    console.log("tx receipt", receipt);

    if (receipt.status === 0) {
      // We can't know the exact error that made the transaction fail when it
      // was mined, so we throw this generic one.
      enqueueSnackbar(`Tx ${hashShort} failed`, {
        autoHideDuration: cfg.DUR_SNACKBAR,
        variant: "error",
      });
      throw new Error("Transaction failed, receipt has status = 0");
    }

    // If we got here, the transaction was successful
    enqueueSnackbar(`Tx ${hashShort} complete`, {
      autoHideDuration: cfg.DUR_SNACKBAR,
      variant: "success",
    });
    console.log("Tx successful");
  } catch (error) {
    const errObj = parseRpcCallError(error);

    enqueueSnackbar(errObj.userMsg, { variant: errObj.level });
    //dispatchState({ type: Action.SET_TX_ERR, payload: errObj.fullMsg });
  } finally {
    console.log("tx attempt done");

    //dispatchState({ type: Action.SET_TX_BEINGSENT, payload: undefined });
    //update all user info
    //await updateBalanceAndBetInfo(sstate);
  }
};
