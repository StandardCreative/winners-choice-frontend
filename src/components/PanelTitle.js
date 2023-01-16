import { Typography } from "@mui/material"

const PanelTitle = ({ text }) => {
  return (
    <Typography variant="h4" color="primary" textAlign="center" gutterBottom>
      {text}
    </Typography>
  )
}

export default PanelTitle
