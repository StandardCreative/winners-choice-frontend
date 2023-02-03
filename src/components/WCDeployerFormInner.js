import { Typography } from "@mui/material"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import { useFormikContext } from "formik"
import { useEffect, useState } from "react"

import * as cfg from "../constants"
import InstructionsBox from "./InstructionsBox"
import LogHistoryForElement from "./LogHistoryForElement"
import PanelTitle from "./PanelTitle"

const WCDeployerFormInner = ({ account, nftAddr, logs, uiMode }) => {
  // returns all values and methods from your Formik tag
  const formik = useFormikContext()
  const [showErrs, setShowErrs] = useState(false)
  const isDisabled = !Boolean(account)

  useEffect(() => {
    const cur = formik.values.nftAddr
    if (nftAddr && !cur) {
      console.log("setfieldval", nftAddr)
      formik.setFieldValue("nftAddr", nftAddr, false)
    }
  }, [nftAddr])

  useEffect(() => {
    //const cur = formik.values.whitelist
    const whitelist = account ? account + ", " + account : "" //same in initvalues (in parent comp)
    formik.setFieldValue("whitelist", whitelist, false)
  }, [account]) //adding formik to this dependency array, as React recommends, leads
  //to infinite renders (I guess setFieldValue causes the formik variable to change value)

  return (
    <form
      onSubmit={(e) => {
        setShowErrs(true)
        formik.handleSubmit(e)
      }}
      style={{ margin: "32px" }}
    >
      <Stack gap="0px">
        <PanelTitle text="WC Creation Panel" />
        <Typography
          textAlign="center"
          // color="text.secondary"
          marginBottom="16px"
        >
          Here you can deploy a new WC contract.
        </Typography>
        <Stack direction="row" sx={{ maxWidth: "100%" }}>
          <TextField
            id="whitelist"
            name="whitelist"
            label={
              account
                ? "Winners (comma-separated addresses)"
                : "Winners (connect to auto-fill)"
            }
            sx={{ width: "100%", maxWidth: "100%" }}
            value={formik.values.whitelist}
            placeholder={
              account
                ? "Comma-separated addresses"
                : "Connect wallet to auto-fill sample list"
            }
            onChange={formik.handleChange}
            error={showErrs && Boolean(formik.errors.whitelist)}
            helperText={showErrs ? formik.errors.whitelist ?? " " : " "}
          />
          <InstructionsBox
            level={uiMode.showInstructions}
            infoText="Enter comma-separated list of winner addresses. \nDefault:\nCan leave as is - we'll then use your own address twice."
          />
        </Stack>

        <Stack direction="row" flexWrap="wrap" sx={{ gridColumnGap: "16px" }}>
          <Stack direction="row" sx={{ maxWidth: "100%" }}>
            <TextField
              id="nftAddr"
              name="nftAddr"
              label={
                nftAddr
                  ? "NFT contract address"
                  : "NFT address (create above to auto-fill)"
              }
              placeholder="Leave blank to auto-generate new NFT contract"
              sx={{ width: "46ch", maxWidth: "100%" }}
              value={formik.values.nftAddr}
              onChange={formik.handleChange}
              error={showErrs && Boolean(formik.errors.nftAddr)}
              helperText={showErrs ? formik.errors.nftAddr ?? " " : " "}
            />
            <InstructionsBox
              level={uiMode.showInstructions}
              infoText="Enter the NFT contract address. \nDefault:\n1. Create a new collection in the panel above\n2. You will see its address pre-filled for you here."
            />
          </Stack>
          <Stack direction="row" sx={{ maxWidth: "100%" }}>
            <TextField
              id="unlockInterval"
              name="unlockInterval"
              label="Unlock interval (minutes)"
              placeholder="For 1 hour, enter 60"
              sx={{ width: "30ch", maxWidth: "100%" }}
              value={formik.values.unlockInterval}
              onChange={formik.handleChange}
              error={showErrs && Boolean(formik.errors.unlockInterval)}
              helperText={showErrs ? formik.errors.unlockInterval ?? " " : " "}
            />
            <InstructionsBox
              level={uiMode.showInstructions}
              infoText="Enter your desired unlock interval (in minutes)."
            />
          </Stack>
        </Stack>

        {/* <Stack direction="row" justifyContent="left">
                <Button variant="outlined" disabled={isDisabled}>
                  Create new NFT contract
                </Button>
              </Stack> */}
        <Stack direction="row" justifyContent="left">
          <Button variant="contained" type="submit" disabled={isDisabled}>
            Create new WC scenario
          </Button>
          <InstructionsBox
            level={uiMode.showInstructions}
            infoText="Click to create a new WC scenario.\nThen go to the Mint page to view and mint NFTs."
          />
        </Stack>
        {cfg.isDevUImode && (
          <LogHistoryForElement logEntries={logs} elementType="makeNewWCC" />
        )}
      </Stack>
    </form>
  )
}

export default WCDeployerFormInner
