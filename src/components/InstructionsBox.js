import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"
import { Stack, Typography } from "@mui/material"

export default function InstructionsBox({ infoText, level }) {
  if (!level) return <></>
  return (
    <div>
      <Stack direction="row">
        <InfoOutlinedIcon color="primary" />
        <Typography variant="caption" color="text.secondary">{infoText}</Typography>
      </Stack>
    </div>
  )
}
