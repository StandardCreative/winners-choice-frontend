import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"
import { Stack, Typography } from "@mui/material"

export default function InstructionsBox({ infoText, level, disableIcon }) {
  if (!level) return <></>
  const clr="secondary"
  return (
    <div>
      
      <Stack direction="row" alignSelf="center">
      {/* <Stack direction="row" bgcolor="#F5F5FF" alignSelf="center"> */}
        {!disableIcon && <InfoOutlinedIcon color={clr}/>}
        <Typography variant="body1" color={clr}>{infoText}</Typography>
      </Stack>
    </div>
  )
}
