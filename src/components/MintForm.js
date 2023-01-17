import { Typography } from "@mui/material"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import { Formik } from "formik"
import { useState } from "react"

import * as cfg from "../constants"
import { getTimestampInSeconds, validateAddr } from "../utils/utils"
import InstructionsBox from "./InstructionsBox"

import LogHistoryForElement from "./LogHistoryForElement"
import PanelTitle from "./PanelTitle"

const MintFormInitVals = {
  tokenIdStr: "",
}

const validate = (values) => {
  console.log("validate")
  const errors = {}
  return errors
  if (!values.tokenIdStr) {
    errors.tokenIdStr = "Required"
  } else errors.tokenIdStr = validateAddr(values.tokenIdStr)

  //now need to remove properties of errors for which there were no errors,
  //otherwise formik won't submit the form (can't leave them even if they are undefined)
  Object.keys(errors).forEach((k) => !errors[k] && delete errors[k])
  return errors
}

export const MintForm = ({ onSubmit, account, logs, unlockTime, uiMode }) => {
  const [showErrs, setShowErrs] = useState(false)
  const curT = getTimestampInSeconds()

  let unlockCountdownStr = ""
  if (unlockTime === cfg.PLACEHOLDER_UNLOCK_TIME) {
  } //no unlock time fetched
  else if (unlockTime.gte("1000000000000"))
    unlockCountdownStr = "No NFT allowance"
  else {
    const secTillUnlock = unlockTime.toNumber() - curT
    if (secTillUnlock < -15) unlockCountdownStr = "Unlocked to mint"
    else if (secTillUnlock <= 0) unlockCountdownStr = "Unlocking"
    else unlockCountdownStr = `Wait ${secTillUnlock} sec`
  }
  const isDisabled = !(
    Boolean(account) && unlockCountdownStr.startsWith("Unlock")
  )

  return (
    <>
      <Formik
        initialValues={MintFormInitVals}
        validate={validate}
        onSubmit={(values, actions) => {
          console.log("submitting")
          onSubmit(values)
          actions.setSubmitting(false)
        }}
      >
        {(formik) => (
          <form
            onSubmit={(e) => {
              setShowErrs(true)
              formik.handleSubmit(e)
            }}
            style={{ margin: "32px" }}
          >
            <Stack gap="0px">
            <PanelTitle text="Minting Panel" />
              {/* <Typography textAlign="center" fontWeight="bold">
                Resettable demo mode: to deploy new NFT and WCC enter a new
                whitelist below (example: 0xabc, 0x123). Unlock interval is 1 min.
              </Typography>
              <Typography textAlign="center" marginBottom="16px">
                Example: 1. Enter just your address; 2. Wait for tx to succeed;
                3. Enter "1" to mint NFKeeTees #1
              </Typography> */}
              <Stack direction="row" sx={{ maxWidth: "100%" }}>
                <TextField
                  id="tokenIdStr"
                  name="tokenIdStr"
                  label="NFT number"
                  sx={{ width: "46ch", maxWidth: "100%" }}
                  value={formik.values.tokenIdStr}
                  onChange={formik.handleChange}
                  error={showErrs && Boolean(formik.errors.tokenIdStr)}
                  helperText={showErrs ? formik.errors.tokenIdStr ?? " " : " "}
                />
                <InstructionsBox
                  level={uiMode.showInstructions}
                  infoText='Enter the NFT number you want to mint.\nSelect from the "not yet minted" ones below.'
                />
              </Stack>

              <Stack
                direction="row"
                justifyContent="left"
                alignItems="center"
                gap="16px"
              >
                <Button variant="contained" type="submit" disabled={isDisabled}>
                  Mint
                </Button>

                <Typography>{`${unlockCountdownStr}`} </Typography>
                {/* <Typography>{`Unlock time: ${unlockTime} Cur time ${cur} ${unlockCountdownStr}`} </Typography> */}
              </Stack>
              {cfg.isDevUImode && (
                <LogHistoryForElement logEntries={logs} elementType="mint" />
              )}
            </Stack>
          </form>
        )}
      </Formik>
    </>
  )
}
