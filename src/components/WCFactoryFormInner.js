import { Typography } from "@mui/material"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import { useFormikContext } from "formik"
import { useEffect, useState } from "react"

const WCFactoryFormInner = ({ account, nftAddr }) => {
  // returns all values and methods from your Formik tag
  const formik = useFormikContext()
  const [showErrs, setShowErrs] = useState(false)
  const isDisabled=!Boolean(account)

  useEffect(() => {
    const cur = formik.values.nftAddr
    if (nftAddr && !cur) {
      console.log("setfieldval", nftAddr)
      formik.setFieldValue("nftAddr", nftAddr)
    }
  }, [nftAddr, formik])

  return (
    <form
      onSubmit={(e) => {
        setShowErrs(true)
        formik.handleSubmit(e)
      }}
      style={{ margin: "32px" }}
    >
      <Stack gap="0px">
        <Typography variant="h5" color="primary" textAlign="center">
          WC Creation Panel
        </Typography>
        <Typography
          textAlign="center"
          color="text.secondary"
          marginBottom="16px"
        >
          Usage example: &nbsp;&nbsp;Fill in whitelist (0x123, 0x456)
          &nbsp;&nbsp;•&nbsp;&nbsp; Put 1 for interval &nbsp;&nbsp;•&nbsp;&nbsp;
          Leave NFT address blank
        </Typography>
        <Stack direction="row" flexWrap="wrap" sx={{ gridColumnGap: "8px" }}>
          <TextField
            id="whitelist"
            name="whitelist"
            label="Whitelist (comma-separated addresses)"
            sx={{ width: "100%", maxWidth: "100%" }}
            value={formik.values.whitelist}
            placeholder={
              "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266, " +
              (account ? account : "0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
            }
            onChange={formik.handleChange}
            error={showErrs && Boolean(formik.errors.whitelist)}
            helperText={showErrs ? formik.errors.whitelist ?? " " : " "}
          />
        </Stack>
        <Stack direction="row" flexWrap="wrap" sx={{ gridColumnGap: "8px" }}>
          <TextField
            id="nftAddr"
            name="nftAddr"
            label="NFT contract address"
            placeholder="Leave blank to auto-generate new NFT contract"
            sx={{ width: "46ch", maxWidth: "100%" }}
            value={formik.values.nftAddr}
            onChange={formik.handleChange}
            error={showErrs && Boolean(formik.errors.nftAddr)}
            helperText={showErrs ? formik.errors.nftAddr ?? " " : " "}
          />
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
        </Stack>
      </Stack>
    </form>
  )
}

export default WCFactoryFormInner
