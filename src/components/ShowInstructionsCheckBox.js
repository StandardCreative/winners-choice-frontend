import { Box, FormControlLabel, Stack } from "@mui/material"
import Checkbox from "@mui/material/Checkbox"
import * as React from "react"
import InstructionsBox from "./InstructionsBox"

export function ShowInstructionsCheckBox({ uiMode, setUiMode }) {
  const handleChange = (event) => {
    setUiMode((uiMode) => ({
      ...uiMode,
      showInstructions: event.target.checked,
    }))
  }

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
          infoText="Suggested workflow:\n1. In Admin, use top panel to create a collection\n2. Use bottom panel to deploy a new WC contract\n3. In Mint, view and mint NFTs\n4. Repeat from step 1\n-------------------------------------------------------------------------------------------------\nFor first-time use:\nWe pre-filled fields with sensible defaults, feel free to use them."
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
