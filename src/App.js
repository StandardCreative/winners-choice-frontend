import { useSnackbar } from "notistack"
import { useRef, useState } from "react"

import "./App.css"

import * as cfg from "./constants"
import * as ops from "./operations/operations"

import { ERC721CreationForm } from "./components/ERC721CreationForm"
import Header from "./components/Header"
import LogHistory from "./components/LogHistory"
import { MintForm } from "./components/MintForm"
import NFTGallery from "./components/NFTGallery"
import { WCFactoryForm } from "./components/WCFactoryForm"
const mockLogEntry = {
  txHash: "0x97395b8e77c3c367f459bc4cbdc5b45ce752f9bdea4a08a62e5efb4de628d97c",
  deployedAddr: "0xb71b27b14ca7cee82ca214c1332765a727497762",
  action: "makeNewWCC",
  vals: {
    users: [
      "0xb71b27b14ca7cee82ca214c1332765a727497762",
      "0xb71b27b14ca7cee82ca214c1332765a727497762",
      "0xb71b27b14ca7cee82ca214c1332765a727497762",
      "0xb71b27b14ca7cee82ca214c1332765a727497762",
    ],
    nftAddr: "0xb71b27b14ca7cee82ca214c1332765a727497762",
    unlockInterval: 60,
  },
}
function App() {
  const [accounts, setAccounts] = useState([])
  const [nftOwners, setNftOwners] = useState(cfg.initOwners)
  const [metadatas, setMetadatas] = useState([])
  const [uiMode, setUiMode] = useState("Admin") //"admin", "mint", "logs"
  const [newlyDeployedERC721Addr, setNewlyDeployedERC721Addr] = useState("")
  const logsRef = useRef([]) // can initialize with mockLogEntry for testing 
  const wccAddressRef = useRef("")
  const stateRefs = {
    wcc: wccAddressRef,
    logs: logsRef,
    nftAddr: newlyDeployedERC721Addr,
    setNftAddr: setNewlyDeployedERC721Addr,
  }
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const mintCb = (vals) => {
    ops
      .sendTx("mint", { ...vals }, stateRefs, enqueueSnackbar)
      .then(() => ops.getOwners(wccAddressRef.current, setNftOwners))
  }
  const erc721CreationCb = (vals) => {
    ops
      .sendTx("makeNewERC721", { ...vals }, stateRefs, enqueueSnackbar)
      .then((nftAddr) => {})
  }
  const wcFactoryCb = (vals) => {
    vals.users = vals.whitelist.split(",").map((st) => st.trim())
    if (!vals.unlockInterval) vals.unlockInterval = "1"

    if (vals.nftAddr) {
      // alert(
      //   "Currently the option of entering your own NFT address is disabled, because the specs for what exact interface WCC should expect from the NFT contract are not yet settled on.\n\nInstead, for now please leave the NFT address blank. Then an NFT contract with a compatible interface will automatically be deployed and used in a fresh WC scenario."
      // )
      // return
      enqueueSnackbar(
        "If your NFT contract doesn't have a compatible interface, WC will not work.",
        { variant: "info" }
      )
      ops
        .sendTx("makeNewWCC", { ...vals }, stateRefs, enqueueSnackbar)
        .then(() =>
          ops.getMetadataAndOwners(
            wccAddressRef.current,
            setNftOwners,
            setMetadatas
          )
        )
    } else {
      const erc721vals = { nFolios: 12, baseURI: "", suffixURI: "" }
      ops
        .sendTx("makeNewERC721", erc721vals, stateRefs, enqueueSnackbar)
        .then((nftAddr) => {
          if (nftAddr) {
            return ops.sendTx(
              "makeNewWCC",
              { ...vals, nftAddr },
              stateRefs,
              enqueueSnackbar
            )
          }
        })
        .then(() =>
          ops.getMetadataAndOwners(
            wccAddressRef.current,
            setNftOwners,
            setMetadatas
          )
        )
    }
  }

  return (
    <div className="App">
      <Header
        accounts={accounts}
        wccAddressRef={wccAddressRef}
        setAccounts={setAccounts}
        setNftOwners={setNftOwners}
        setMetadatas={setMetadatas}
        setUiMode={setUiMode}
      />
      {uiMode === "Admin" && (
        <ERC721CreationForm
          onSubmit={erc721CreationCb}
          account={accounts[0]}
          setNftOwners={setNftOwners}
        />
      )}
      {uiMode === "Admin" && (
        <WCFactoryForm
          onSubmit={wcFactoryCb}
          account={accounts[0]}
          setNftOwners={setNftOwners}
          nftAddr={stateRefs.nftAddr}
        />
      )}
      {uiMode === "Mint" && (
        <MintForm
          onSubmit={mintCb}
          account={accounts[0]}
          setNftOwners={setNftOwners}
        />
      )}
      {uiMode === "Mint" && (
        <NFTGallery nftOwners={nftOwners} metadatas={metadatas} />
      )}
      {uiMode === "History" && (
        <LogHistory logEntries={stateRefs.logs.current} />
      )}
    </div>
  )
}

export default App
