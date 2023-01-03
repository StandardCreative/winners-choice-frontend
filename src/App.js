import { useSnackbar } from "notistack"
import { useRef, useState } from "react"

import "./App.css"

import * as cfg from "./constants"
import * as ops from "./operations/operations"

import Header from "./components/Header"
import { MintForm } from "./components/MintForm"
import NFTGallery from "./components/NFTGallery"
import { WCFactoryForm } from "./components/WCFactoryForm"

function App() {
  const [accounts, setAccounts] = useState([])
  const wccAddressRef = useRef("")
  const [nftOwners, setNftOwners] = useState(cfg.initOwners)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const showMint = true
  //const mintCb = (vals) => ops.sendReadTx("ownerOf", vals);
  const mintCb = (vals) => {
    ops
      .sendTx("mint", vals, wccAddressRef, enqueueSnackbar)
      .then(() => ops.getOwners(wccAddressRef.current, setNftOwners))
  }
  const wcFactoryCb = (vals) => {
    vals.users = vals.whitelist.split(",").map((st) => st.trim())
    if (!vals.unlockInterval) vals.unlockInterval = "1"

    if (vals.nftAddr) {
      //if nft address was left blank, generate our own NFT and create WC scenario with it
      alert(
        "Currently the option of entering your own NFT address is disabled, because the specs for what exact interface WCC should expect from the NFT contract are not yet settled on.\n\nInstead, for now please leave the NFT address blank. Then an NFT contract with a compatible interface will automatically be deployed and used in a fresh WC scenario."
      )
      return
      ops
        .sendTx("resetWhitelist", vals, wccAddressRef, enqueueSnackbar)
        .then(() => ops.getOwners(wccAddressRef.current, setNftOwners))
    } else {
      ops
        .sendTx("makeNewERC721", vals, wccAddressRef, enqueueSnackbar)
        .then((nftAddr) => {
          if (nftAddr) {
            return ops.sendTx(
              "makeNewWCC",
              { ...vals, nftAddr },
              wccAddressRef,
              enqueueSnackbar
            )
          }
        })
        .then(() => ops.getOwners(wccAddressRef.current, setNftOwners))
    }
  }

  return (
    <div className="App">
      <Header
        accounts={accounts}
        wccAddressRef={wccAddressRef}
        setAccounts={setAccounts}
        setNftOwners={setNftOwners}
      />
      {cfg.showWCCreationWidget && (
        <WCFactoryForm
          onSubmit={wcFactoryCb}
          account={accounts[0]}
          setNftOwners={setNftOwners}
        />
      )}
      {showMint && (
        <MintForm
          onSubmit={mintCb}
          account={accounts[0]}
          setNftOwners={setNftOwners}
        />
      )}
      <NFTGallery nftOwners={nftOwners} />
    </div>
  )
}

export default App
