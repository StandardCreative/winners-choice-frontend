//WCDEPLOYER CONTRACT ADDRESS ON GOERLI
const deployedGoerliWCDeployerAddr =
  "0x822d546Eb482b1767C6A4F319624600BE4C10e9E"

//SETTINGS
export const showERC721CreationPanel = true
export const showWCCreationPanel = true
export const showMsgsInBrowserAlerts = false
export const isDevUImode = true //show tx history locally
export const showShowInstructionsCheckbox = true
export const infoToolTipLevel = 0

//LESS IMPORTANT SETTINGS
export const DUR_SNACKBAR_TX = 180000 //in ms here, in my ts app it was in seconds for some reason
export const DUR_SNACKBAR = 15000
export const DUR_SNACKBAR_SUCCESS = 4000

//BE CAREFUL EDITING ANY ITEMS BELOW
export const ipfsWebPrefix = "https://ipfs.io/ipfs/"
export const etherscanTxPrefix = "https://goerli.etherscan.io/tx/"

export const supportedNetworks = [
  {
    name: "Goerli",
    id: "5",
    // contractAddress: "0x3aF9F0408456b4296A74ad42bAc3879750aC1842", //irrelevant for resettable demo
    WCDeployerAddress: deployedGoerliWCDeployerAddr, // prev "0x19d9B97D680a9c734535B370a6618392E8B3D2aC", //prev "0x84E28e01358e666684B895D7aAdDFC5299249d09", //prev 0xb71b27b14ca7cee82ca214c1332765a727497762", //prev "0x876E416bab2E0E430245C98f9d0edDc569423717",
    //v1 "0x83292B67BaBF3E141c58526F0a26FB33F4A42Cb0",
  },
  {
    name: "Local (with chain id 1337)",
    id: "1337",
    //contractAddress: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", // irrelevant
    WCDeployerAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  },
]

//   export enum RpcCallErrorStatus {
//     UNDEFINED,
//     NO_ERROR,
//     RECOGNIZED_RPC_ERROR,
//     OTHER_ERROR,
//   }

export const RpcCallErrorInitVals = {
  status: "",
  code: "",
  method: "",
  fullMsg: "",
  userMsg: "",
  level: "",
}

export const txCodes = [
  { code: "ACTION_REJECTED", userMsg: "Tx rejected by user", level: "info" },
  {
    code: "CALL_EXCEPTION",
    userMsg: "Contract reverted execution",
    level: "error",
  },
  {
    code: "INSUFFICIENT_FUNDS",
    userMsg: "Insufficient balance for tx",
    level: "error",
  },
  {
    code: "NETWORK_ERROR",
    userMsg: "Network is not responding to requests",
    level: "error",
  },
  {
    code: "INVALID_ARGUMENT", //when I put an empty string for contract address
    //or enter invalid entry for an input field
    userMsg: "Trying to send invalid data",
    level: "error",
  },
]
export const nfkeetees1to12NftStorageBaseURI =
  "https://bafybeibl7guejya2dldrsqpsug7osxix32qyr2t7ggxrzt6ihbkirwhkrq.ipfs.nftstorage.link/"
// export const tokenIds = "0 1 2 3 4 5 6 7 8 9 10 11".split(" ")
// export const mediaPrefix =
//   "https://bafybeid2eloamo5bbswztq5wp4t7xf42qhn2lfwth4ejdjiy74yvm5fgvy.ipfs.nftstorage.link/"
// //"https://bafybeibl7guejya2dldrsqpsug7osxix32qyr2t7ggxrzt6ihbkirwhkrq.ipfs.nftstorage.link/"
// export const mediaSuffix = ".jpeg"
//export const nNfts = 12
export const UNMINTED_PLACEHOLDER_ADDR =
  "0x0000000000000000000000000000000000000000"

export const WCC_ADDR_IF_WCF_HASNT_DEPLOYED_WCC_YET =
  "0x0000000000000000000000000000000000000000"

export const PLACEHOLDER_UNLOCK_TIME = 0

export const PLACEHOLDER_OWNER = "" //"Fetching owner..."
//export const initOwners = tokenIds.map(() => PLACEHOLDER_OWNER)

export const placeholderMetadata = {
  name: "What's my name?",
  description:
    "Could not fetch metadata for this item. If it's located on IPFS, this is unfortunately a common issue: often a specific file can't be fetched even after many retries",
  image:
    "https://images.unsplash.com/photo-1484069560501-87d72b0c3669?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
}
