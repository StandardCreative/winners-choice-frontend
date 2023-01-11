import { Box, Stack } from "@mui/material"

import LogEntryForElement from "./LogEntryForElement"

const LogHistoryForElement = ({ logEntries, elementType }) => {
  logEntries.forEach((entry) => {
    console.log(entry.action, entry.action === elementType)
  })

  return (
    <Box sx={{margin:"0 0 0 0"}}>
      {logEntries.length === 0 ? (
        <></>
      ) : (
        <Stack gap="0px">
          {logEntries.map(
            (entry, ind) =>
              entry.action === elementType && (
                <LogEntryForElement key={ind} entry={entry} entryNum={ind} />
              )
          )}
        </Stack>
      )}
    </Box>
  )
}

export default LogHistoryForElement
