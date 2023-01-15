import { Typography } from "@mui/material"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import { Formik } from "formik"
import { useState } from "react"

import * as cfg from "../constants"
import { validateAddr } from "../utils/utils"
import Info from "./Info"
import LogHistoryForElement from "./LogHistoryForElement"

const ERC721CreationFormInitVals = {
  baseURI:
    "ipfs://bafybeig5uvacrxeg4cijeog55jmabopuwlvs3ryuj34brrvjzx6xpiu45u/",
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

export const ERC721CreationForm = ({ onSubmit, account, logs }) => {
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
              <Typography variant="h5" color="primary" textAlign="center">
                ERC721 Creation Panel
              </Typography>
              <Typography
                textAlign="center"
                color="text.secondary"
                marginBottom="16px"
              >
                Here you can create a fresh NFT contract that will work with WC.
                Simplest usage: just click the button to use pre-filled
                settings.
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
                  <Info
                    level={2}
                    infoText="Enter the number of folios for your collection. Simplest usage: enter between 1 and 12 and don't change the other fields - then pre-made sample art will be used."
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
                  <Info
                    level={2}
                    infoText="Enter the common prefix for all metadata URIs in your collection. Simplest usage: just leave as is if you want to use pre-made sample art."
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
                  <Info
                    level={2}
                    infoText="Enter the common suffix for all metadata URIs in your collection. Simplest usage: just leave as is if you want to use pre-made sample art."
                  />
                </Stack>
              </Stack>

              {/* <Stack direction="row" justifyContent="left">
                <Button variant="outlined" disabled={isDisabled}>
                  Create new NFT contract
                </Button>
              </Stack> */}
              <Stack direction="row" justifyContent="left" >
                <Button variant="contained" type="submit" disabled={isDisabled}>
                  Create new collection
                </Button>
                <Info
                  infoText="Click to create a new NFT contract. Afterwards, its address will automatically appear in the WC creation panel to be used in a fresh WC scenario."
                  level={1}
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
