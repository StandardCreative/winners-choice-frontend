import { useSnackbar } from "notistack"
import { useState } from "react"

import "./App.css"

import * as cfg from "./constants"
import * as ops from "./operations/operations"

import Header from "./components/Header"
import { MintForm } from "./components/MintForm"
import NFTGallery from "./components/NFTGallery"

function App() {
  const [accounts, setAccounts] = useState([])
  const [nftOwners, setNftOwners] = useState(cfg.initOwners)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const showMint = true
  //const mintCb = (vals) => ops.sendReadTx("ownerOf", vals);
  const mintCb = (vals) => {
    if (vals.tokenIdStr.length > 40) {
      //interpret as new whitelist
      vals.users = vals.tokenIdStr.split(",").map((st) => st.trim())
      ops
        .sendTx("resetWhitelist", vals, enqueueSnackbar)
        .then(() => ops.getOwners(setNftOwners))
    } else {
    ops
      .sendTx("safeMint", vals, enqueueSnackbar)
      .then(() => ops.getOwners(setNftOwners))
    }
  }

  return (
    <div className="App">
      <Header
        accounts={accounts}
        setAccounts={setAccounts}
        setNftOwners={setNftOwners}
      />
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
