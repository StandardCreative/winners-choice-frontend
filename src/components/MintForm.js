import { Typography } from "@mui/material"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import { Formik } from "formik"
import { useState } from "react"
import { validateAddr } from "../utils/utils"

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

export const MintForm = ({ onSubmit, account }) => {
  const [showErrs, setShowErrs] = useState(false)
  const isDisabled = !Boolean(account)
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
              <Typography textAlign="center" marginBottom="16px" fontWeight="bold">
                Test mode: to reset the whitelist enter it in the form (example: 0xabc, 0x123, ...)
              </Typography>
              <Stack
                direction="row"
                flexWrap="wrap"
                sx={{ gridColumnGap: "8px" }}
              >
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
              </Stack>

              <Stack direction="row" justifyContent="left">
                <Button variant="contained" type="submit" disabled={isDisabled}>
                  Mint
                </Button>
              </Stack>
            </Stack>
          </form>
        )}
      </Formik>
    </>
  )
}
