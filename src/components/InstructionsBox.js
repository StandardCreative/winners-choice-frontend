import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"
import { Box, Stack, Typography } from "@mui/material"

const parseText = (infoText) => {
  const typographyChunks = []
  console.log(infoText);
  for (let inputChunk of infoText.split("\\n")) {
    console.log("after split ", inputChunk);
    const chunk = {text: inputChunk}
    typographyChunks.push(chunk)
  }
  return typographyChunks
}
export default function InstructionsBox({ infoText, level, disableIcon, noGutterBottom }) {
  if (!level) return <></>
  const clr="secondary"
  const boxMarginSt = noGutterBottom ? "0 0 0 0" : "0 0 16px 0"
  return (
    <div style={{maxWidth:"500px"}}>
      
      <Stack direction="row" alignSelf="center" gap="8px">
      {/* <Stack direction="row" bgcolor="#F5F5FF" alignSelf="center"> */}
        {!disableIcon && <InfoOutlinedIcon color={clr}/>}
        <Box margin={boxMarginSt}>
          {parseText(infoText).map((chunk, ind) =>
        (<Typography key={ind} variant="body1" color={clr}>{chunk.text}</Typography>)
          )}
        </Box>
      </Stack>
    </div>
  )
}
