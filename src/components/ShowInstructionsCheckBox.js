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
          infoText="Suggested usage:"
        />
        <Stack>
        <InstructionsBox
          level={uiMode.showInstructions}
          disableIcon
          infoText="1. In Admin, use top panel to create a collection"
          />
          <InstructionsBox
          level={uiMode.showInstructions}
          disableIcon
          infoText="2. Use bottom panel to create a new WC scenario"
          />
           <InstructionsBox
          level={uiMode.showInstructions}
          disableIcon
          infoText="3. In Mint, view and mint NFTs"
          />
           <InstructionsBox
          level={uiMode.showInstructions}
          disableIcon
          infoText="4. Rinse and repeat"
          />
        </Stack>
      </Stack>
    </>
  )
}
