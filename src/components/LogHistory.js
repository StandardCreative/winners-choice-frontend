import { Box, Stack, Typography } from "@mui/material"

import LogEntry from "./LogEntry"

const LogHistory = ({logEntries}) => {
    //console.log({logEntries});
  return (
    <Box sx={{margin: "16px 32px 0 32px"}}>
      <Typography variant="h5" color="primary" textAlign="center" marginBottom="32px">Transaction History</Typography>
      {logEntries.length === 0 ? (
        <Typography>Log entries will appear here</Typography>
      ) : (
        <Stack gap="8px">
          {logEntries.map((entry, ind) => (
            <LogEntry key={ind} entry={entry} entryNum={ind}/>
          ))}
        </Stack>
      )}
    </Box>
  )
}

export default LogHistory
