import { useSnackbar } from "notistack"
import { useEffect, useRef, useState } from "react"

import "./App.css"

import * as ops from "./operations/operations"

import { Typography } from "@mui/material"
import { ERC721CreationForm } from "./components/ERC721CreationForm"
import Header from "./components/Header"
import LogHistory from "./components/LogHistory"
import { MintForm } from "./components/MintForm"
import NFTGallery from "./components/NFTGallery"
import { ShowInstructionsCheckBox } from "./components/ShowInstructionsCheckBox"
import { WCDeployerForm } from "./components/WCDeployerForm"
import {
  PLACEHOLDER_UNLOCK_TIME,
  showShowInstructionsCheckbox,
} from "./constants"
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
  const [timerCount, setTimerCount] = useState(0)
  const [accounts, setAccounts] = useState([])
  const [nFolios, setNFolios] = useState(0)
  const [unlockTime, setUnlockTime] = useState(PLACEHOLDER_UNLOCK_TIME)
  const [nftOwners, setNftOwners] = useState([])
  const [metadatas, setMetadatas] = useState([])
  const [uiMode, setUiMode] = useState({
    page: "Admin",
    showInstructions: true,
  }) //"admin", "mint", "logs"
  const [newlyDeployedERC721Addr, setNewlyDeployedERC721Addr] = useState("")
  const [logs, setLogs] = useState([]) // can initialize with mockLogEntry for testing
  const wccAddressRef = useRef("")
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const dataBundle = {
    //to pass to eg sendTx
    wcc: wccAddressRef,
    logs,
    setLogs,
    nftAddr: newlyDeployedERC721Addr,
    setNftAddr: setNewlyDeployedERC721Addr, //TODO incl enqueue...
  }

  //we will have a global counter, even though it's not necessary for just the unlock
  //time countdown, because in the future we might want to periodically refetch some info
  //console.log("App rerender", timerCount)
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerCount((x) => x + 1)
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  const mintCb = (vals) => {
    ops
      .sendTx("mint", { ...vals }, dataBundle, enqueueSnackbar)
      .then(() =>
        ops.getUnlockTimeAndOwners(
          wccAddressRef.current,
          setNftOwners,
          setUnlockTime,
          accounts[0]
        )
      )
  }
  const erc721CreationCb = (vals) => {
    ops
      .sendTx("makeNewERC721", { ...vals }, dataBundle, enqueueSnackbar)
      .then((nftAddr) => {})
  }
  const wcDeployerCb = (vals) => {
    vals.users = vals.whitelist.split(",").map((st) => st.trim())
    if (!vals.unlockInterval) vals.unlockInterval = "2"

    if (vals.nftAddr) {
      // alert(
      //   "Currently the option of entering your own NFT address is disabled, because the specs for what exact interface WCC should expect from the NFT contract are not yet settled on.\n\nInstead, for now please leave the NFT address blank. Then an NFT contract with a compatible interface will automatically be deployed and used in a new WC scenario."
      // )
      // return
      enqueueSnackbar(
        "If your NFT contract doesn't have a compatible interface, WC will not work.",
        { variant: "info" }
      )
      ops
        .sendTx("makeNewWCC", { ...vals }, dataBundle, enqueueSnackbar)
        .then(() =>
          ops.getMetadataAndOwners(
            wccAddressRef.current,
            setNftOwners,
            setMetadatas,
            setNFolios,
            setUnlockTime,
            accounts[0]
          )
        )
    } else {
      const erc721vals = { nFolios: 12, baseURI: "", suffixURI: "" }
      ops
        .sendTx("makeNewERC721", erc721vals, dataBundle, enqueueSnackbar)
        .then((nftAddr) => {
          if (nftAddr) {
            return ops.sendTx(
              "makeNewWCC",
              { ...vals, nftAddr },
              dataBundle,
              enqueueSnackbar
            )
          }
        })
        .then(() =>
          ops.getMetadataAndOwners(
            wccAddressRef.current,
            setNftOwners,
            setMetadatas,
            setNFolios,
            setUnlockTime,
            accounts[0]
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
        setNFolios={setNFolios}
        setUnlockTime={setUnlockTime}
      />
      {uiMode.showInstructions && (
        <div style={{ margin: "12px 32px 0px 32px" }}>
          <Typography textAlign="center" fontWeight="bold">
            In Winner's Choice (WC), specific wallet addresses (called winners)
            are unlocked, in priority order, to mint an NFT of their choice.
            {/* In Winner's Choice (WC), whitelisted addresses (aka winners) are unlocked one by one in
          the order of priority to mint an NFT of their choice. */}
          </Typography>
          <Typography textAlign="center" fontWeight="bold">
            The first address on the 'winners list' is unlocked immediately, the
            second one after a delay D, the third one after 2D, etc.
          </Typography>
        </div>
      )}
      {showShowInstructionsCheckbox && (
        <ShowInstructionsCheckBox
          uiMode={uiMode}
          setUiMode={setUiMode}
          account={accounts[0]}
          logs={logs}
        />
      )}
      {uiMode.page === "Admin" && (
        <ERC721CreationForm
          onSubmit={erc721CreationCb}
          account={accounts[0]}
          setNftOwners={setNftOwners}
          logs={logs}
          uiMode={uiMode}
        />
      )}
      {uiMode.page === "Admin" && (
        <WCDeployerForm
          onSubmit={wcDeployerCb}
          account={accounts[0]}
          // setNftOwners={setNftOwners}
          nftAddr={dataBundle.nftAddr}
          logs={logs}
          uiMode={uiMode}
        />
      )}
      {uiMode.page === "Mint" && (
        <MintForm
          onSubmit={mintCb}
          account={accounts[0]}
          unlockTime={unlockTime}
          // setNftOwners={setNftOwners}
          logs={logs}
          uiMode={uiMode}
        />
      )}
      {uiMode.page === "Mint" && (
        <NFTGallery
          nftOwners={nftOwners}
          metadatas={metadatas}
          nFolios={nFolios}
        />
      )}
      {uiMode.page === "History" && <LogHistory logEntries={logs} />}
    </div>
  )
}

export default App
