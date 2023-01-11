import { Typography } from "@mui/material"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import { Formik } from "formik"
import { useState } from "react"

import * as cfg from "../constants"
import { validateAddr } from "../utils/utils"
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
                Usage example: &nbsp;&nbsp;Put number between 1 and 12 for
                "Number of folios" &nbsp;&nbsp;•&nbsp;&nbsp; Leave other fields
                blank
              </Typography>
              <Stack
                direction="row"
                flexWrap="wrap"
                sx={{ gridColumnGap: "8px" }}
              >
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
                <TextField
                  id="baseURI"
                  name="baseURI"
                  label="Base URI"
                  placeholder="Leave blank to use pre-made art"
                  sx={{ width: "30ch", maxWidth: "100%" }}
                  value={formik.values.baseURI}
                  onChange={formik.handleChange}
                  error={showErrs && Boolean(formik.errors.baseURI)}
                  helperText={showErrs ? formik.errors.baseURI ?? " " : " "}
                />
                <TextField
                  id="suffixURI"
                  name="suffixURI"
                  label="Suffix for URIs"
                  placeholder=".json"
                  sx={{ width: "15ch", maxWidth: "100%" }}
                  value={formik.values.suffixURI}
                  onChange={formik.handleChange}
                  error={showErrs && Boolean(formik.errors.suffixURI)}
                  helperText={showErrs ? formik.errors.suffixURI ?? " " : " "}
                />
              </Stack>

              {/* <Stack direction="row" justifyContent="left">
                <Button variant="outlined" disabled={isDisabled}>
                  Create new NFT contract
                </Button>
              </Stack> */}
              <Stack direction="row" justifyContent="left">
                <Button variant="contained" type="submit" disabled={isDisabled}>
                  Create new collection
                </Button>
              </Stack>
              {cfg.isDevUImode && <LogHistoryForElement logEntries={logs} elementType="makeNewERC721"/>}
            </Stack>
          </form>
        )}
      </Formik>
    </>
  )
}
