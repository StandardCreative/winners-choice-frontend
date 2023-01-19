import { Typography } from "@mui/material"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import { Formik } from "formik"
import { useState } from "react"

import * as cfg from "../constants"
import { validateAddr } from "../utils/utils"
import { ImagePreviews } from "./ImagePreviews"
import InstructionsBox from "./InstructionsBox"
import LogHistoryForElement from "./LogHistoryForElement"
import PanelTitle from "./PanelTitle"

//bafybeigc3trxtkgi2wiyaxcekv6fwknfcov3zt2fxqguc2nc5jxpxin47u - NFKeeTees 1-12 json
const ERC721CreationFormInitVals = {
  baseURI:
    "ipfs://bafybeigc3trxtkgi2wiyaxcekv6fwknfcov3zt2fxqguc2nc5jxpxin47u/",
  suffixURI: ".json",
  nFolios: "3",
}

const validate = (values) => {
  console.log("validate")
  const errors = {}
  return errors
  if (!values.nFolios) {
    errors.nFolios = "Required"
  } else errors.nFolios = validateAddr(values.nFolios)

  //now need to remove properties of errors for which there were no errors,
  //otherwise formik won't submit the form (can't leave them even if they are undefined)
  Object.keys(errors).forEach((k) => !errors[k] && delete errors[k])
  return errors
}

export const ERC721CreationForm = ({ onSubmit, account, logs, uiMode }) => {
  const [showErrs, setShowErrs] = useState(false)
  const isDisabled = !Boolean(account)
  return (
    <>
      <Formik
        initialValues={ERC721CreationFormInitVals}
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
              <PanelTitle text="ERC721 Creation Panel" />
              <Typography
                textAlign="center"
                // color="text.secondary"
                marginBottom="16px"
              >
                Here you can create and deploy a new NFT contract that will work
                with WC.
              </Typography>
              <Stack
                direction="row"
                flexWrap="wrap"
                sx={{ gridColumnGap: "16px" }}
              >
                <Stack direction="row" sx={{ maxWidth: "100%" }}>
                  <TextField
                    id="nFolios"
                    name="nFolios"
                    label="Number of folios"
                    sx={{ width: "30ch", maxWidth: "100%" }}
                    value={formik.values.nFolios}
                    placeholder="<= 12 for pre-made art"
                    onChange={formik.handleChange}
                    error={showErrs && Boolean(formik.errors.nFolios)}
                    helperText={showErrs ? formik.errors.nFolios ?? " " : " "}
                  />
                  <InstructionsBox
                    level={uiMode.showInstructions}
                    infoText="Enter the number of folios for your collection. \nDefault:\nIf you want to use pre-made sample art, put any number 1-12."
                  />
                </Stack>
                <Stack direction="row" sx={{ maxWidth: "100%" }}>
                  <TextField
                    id="baseURI"
                    name="baseURI"
                    label="Base URI"
                    placeholder="Leave blank to use pre-made art"
                    sx={{ width: "44ch", maxWidth: "100%" }}
                    value={formik.values.baseURI}
                    onChange={formik.handleChange}
                    error={showErrs && Boolean(formik.errors.baseURI)}
                    helperText={showErrs ? formik.errors.baseURI ?? " " : " "}
                  />
                  <InstructionsBox
                    level={uiMode.showInstructions}
                    infoText="Enter the common prefix for all metadata URIs in your collection. \nDefault:\nJust leave as is if you want to use pre-made sample art."
                  />
                </Stack>
                <Stack direction="row" sx={{ maxWidth: "100%" }}>
                  <TextField
                    id="suffixURI"
                    name="suffixURI"
                    label="Suffix for URIs"
                    placeholder=".json"
                    sx={{ width: "12ch", maxWidth: "100%" }}
                    value={formik.values.suffixURI}
                    onChange={formik.handleChange}
                    error={showErrs && Boolean(formik.errors.suffixURI)}
                    helperText={showErrs ? formik.errors.suffixURI ?? " " : " "}
                  />
                  <InstructionsBox
                    level={uiMode.showInstructions}
                    infoText="Enter the common suffix for all metadata URIs in your collection. \nDefault:\nJust leave as is if you want to use pre-made sample art."
                  />
                </Stack>
              </Stack>

              {/* <Stack direction="row" justifyContent="left">
                <Button variant="outlined" disabled={isDisabled}>
                  Create new NFT contract
                </Button>
              </Stack> */}
              <ImagePreviews
                nFolios={formik.values.nFolios}
                isPremadeArtURI={
                  formik.values.baseURI ===
                    ERC721CreationFormInitVals.baseURI &&
                  formik.values.suffixURI ===
                    ERC721CreationFormInitVals.suffixURI
                }
              />

              <Stack direction="row" justifyContent="left">
                <Button variant="contained" type="submit" disabled={isDisabled}>
                  Create new collection
                </Button>
                <InstructionsBox
                  level={uiMode.showInstructions}
                  infoText="Click to create a new NFT contract.\nAfterwards, its address will be pre-filled in the panel below."
                />
              </Stack>
              {cfg.isDevUImode && (
                <LogHistoryForElement
                  logEntries={logs}
                  elementType="makeNewERC721"
                />
              )}
            </Stack>
          </form>
        )}
      </Formik>
    </>
  )
}
