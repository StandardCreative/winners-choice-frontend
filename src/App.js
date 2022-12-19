import { useSnackbar } from "notistack";
import { useState } from "react";

import "./App.css";

import * as ops from "./operations/operations";

import { ContractCallForm } from "./components/ContractCallForm";
import Header from "./components/Header";
import { MintForm } from "./components/MintForm";
import NFTGallery from "./components/NFTGallery";

function App() {
  const [accounts, setAccounts] = useState([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const showMint = true;
  const mintCb = (vals) => ops.sendTx("safeMint", vals, enqueueSnackbar);

  return (
    <div className="App">
      <Header accounts={accounts} setAccounts={setAccounts} />
      {false && <ContractCallForm onSubmit={() => {}} account={accounts[0]} />}
      {showMint && <MintForm onSubmit={mintCb} account={accounts[0]} />}
      <NFTGallery/>
    </div>
  );
}

export default App;
