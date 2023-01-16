import { Box, FormControlLabel } from "@mui/material"
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
      <Box sx={{ margin: "8px 32px 0 32px" }}>
        <InstructionsBox
          level={uiMode.showInstructions}
          infoText="Suggested usage: 1. In Admin, use top panel to create a collection; 2. In bottom panel, create a new WC scenario; 3. In Mint, view and mint NFTs; 4. Repeat."
        />
      </Box>
    </>
  )
}
