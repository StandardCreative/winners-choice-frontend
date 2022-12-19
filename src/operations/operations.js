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

  console.log("got error:", res);
  return res;
};

// export const sendTxSync = (funcName, vals, enqueueSnackbar) => {
//   sendTx(funcName, vals, enqueueSnackbar)
// }
export const sendTx = async (funcName, vals, enqueueSnackbar) => {
  console.log("sendtx: ", funcName);
  try {
    const contract = getContractInstance();
    let txPromise;
    switch (funcName) {
      case "safeMint":
        console.log("will try to mint tokenId ", vals);
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
