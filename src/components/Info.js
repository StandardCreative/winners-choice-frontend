import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"
import ClickAwayListener from "@mui/material/ClickAwayListener"
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"
import { useState } from "react"
import { infoToolTipLevel } from "../constants"

export default function Info({ infoText, level }) {
  const [open, setOpen] = useState(false)

  const handleTooltipClose = () => {
    setOpen(false)
  }

  const handleTooltipOpen = () => {
    setOpen(true)
  }

  if (level > infoToolTipLevel) return <></>
  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <div>
        <Tooltip
          PopperProps={{
            disablePortal: true,
          }}
          onClose={handleTooltipClose}
          open={open}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          title={infoText}
        >
          <IconButton
            color="primary"
            onClick={handleTooltipOpen}
            aria-label="show info tooltip"
          >
            <InfoOutlinedIcon />
          </IconButton>
          {/* <Button onClick={handleTooltipOpen} sx={{}}>Info</Button> */}
        </Tooltip>
      </div>
    </ClickAwayListener>
  )
}
