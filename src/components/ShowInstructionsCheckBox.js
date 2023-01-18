import { FormControlLabel, Stack } from "@mui/material"
import Checkbox from "@mui/material/Checkbox"
import * as React from "react"
import InstructionsBox from "./InstructionsBox"

export function ShowInstructionsCheckBox({ uiMode, setUiMode, account, logs }) {
  const handleChange = (event) => {
    setUiMode((uiMode) => ({
      ...uiMode,
      showInstructions: event.target.checked,
    }))
  }

  const lastTxType = logs.length ? logs[logs.length - 1].action : undefined
  let stepsDone = 0
  if (lastTxType === "makeNewERC721") stepsDone = 1
  else if (lastTxType === "makeNewWCC") stepsDone = 2
  else if (lastTxType === "mint") stepsDone = 3

  let step0 = ""
  if (!account) step0 = "\\n0. Use the Connect button (top right)"
  else if (window.ethereum.networkVersion !== "5")
    step0 = "\\n0. Switch your Metamask to the Goerli testnet"

  let step1, step2, step3
  if (stepsDone < 1)
    step1 =
      uiMode.page === "Admin"
        ? "1. Use the first panel below to instantly deploy a new NFT contract"
        : "1. Go to Admin and use the top panel to deploy a new NFT contract"
  else step1 = "1. (DONE) Deploy a new NFT contract"

  if (stepsDone < 2)
    step2 =
      uiMode.page === "Admin" || stepsDone < 1
        ? "2. Use the bottom panel to deploy a new WC contract"
        : "2. In Admin's bottom panel, deploy a new WC contract"
  else step2 = "2. (DONE) Deploy a new WC contract"

  if (stepsDone < 3) step3 = "3. On the Mint page, view and mint NFTs"
  else step3 = "3. (DONE) View and mint NFTs"

  const firstTimeText = `First-time user? You can test WC in seconds:\\n\u00A0\u00A0- Follow steps below, use values we pre-filled for you\\n\u00A0\u00A0- You don\'t need your own NFT art to test WC\\n\u00A0\u00A0- We have sample art, already pre-uploaded to IPFS\\n\u00A0\u00A0- Each step below is just a couple of clicks\\n\u00A0\u00A0\\n`

  const suggestedWorkflowText = `Suggested workflow:${step0}\\n${step1}\\n${step2}\\n${step3}\\n4. Repeat from step 1`

  const origOverviewText =
    "Suggested workflow:\\n1. In Admin, use the top panel to create a test collection in seconds\\n2. Use the bottom panel to deploy a new WC contract\\n3. In Mint, view and mint NFTs\\n4. Repeat from step 1\\n----------------------------------------------------------\\nFor first-time use:\\nWe pre-filled fields with sensible defaults, feel free to use them."

  let overviewText =
    stepsDone < 1
      ? firstTimeText + suggestedWorkflowText
      : suggestedWorkflowText

  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            checked={uiMode.showInstructions}
            onChange={handleChange}
            inputProps={{ "aria-label": "show or hide instructions" }}
          />
        }
        label="Show instructions"
        labelPlacement="end"
        sx={{ margin: "8px 32px 0 32px" }}
      />
      <Stack sx={{ margin: "8px 32px 0 32px" }} alignItems="center">
        <InstructionsBox
          level={uiMode.showInstructions}
          noGutterBottom
          infoText={overviewText}
        />
        {/* <Stack>
        <InstructionsBox
          level={uiMode.showInstructions}
          disableIcon
          infoText="1. In Admin, use top panel to create a collection"
          />
          <InstructionsBox
          level={uiMode.showInstructions}
          disableIcon
          infoText="2. Use bottom panel to deploy a new WC contract (with that collection)."
          />
           <InstructionsBox
          level={uiMode.showInstructions}
          disableIcon
          infoText="3. In Mint, view and mint NFTs"
          />
           <InstructionsBox
          level={uiMode.showInstructions}
          disableIcon
          infoText="4. Repeat from step 1."
          />
           <InstructionsBox
          level={uiMode.showInstructions}
          disableIcon
          infoText='For first-time use: fields in Admin are pre-filled with sensible defaults, feel free to leave them as is.'
          />
        </Stack> */}
      </Stack>
    </>
  )
}
