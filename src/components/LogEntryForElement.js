import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { Stack } from "@mui/material"
import Accordion from "@mui/material/Accordion"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import Link from "@mui/material/Link"
import { styled } from "@mui/material/styles"
import Typography from "@mui/material/Typography"

import * as cfg from "../constants"
import { shortenHash } from "../utils/utils"

const CustomLink = styled(Link)(({ theme }) => ({
  underline: "hover",
  //target: "_blank",
  //rel: "noopener", //this and target don't work here, must specify when invoked
}))

const LogEntryForElement = ({ entry, entryNum }) => {
  let description
  const params = []
  switch (entry.action) {
    case "mint":
      description = `Minted token #${entry.vals.tokenIdStr}`
      params.push(["Token Id", `${entry.vals.tokenIdStr}`])
      break

    case "makeNewWCC":
      description = `New WCC at ${entry.deployedAddr}`
      params.push(["ERC721", entry.vals.nftAddr])
      params.push(["Unlock interval (sec)", entry.vals.unlockInterval])
      params.push(["Whitelist", entry.vals.users])
      break
    case "makeNewERC721":
      description = `New NFT at ${entry.deployedAddr}`
      params.push(["Number of folios", entry.vals.nFolios])
      params.push(["URI base", entry.vals.baseURI])
      params.push(["URI suffix", entry.vals.suffixURI])
      break
  }
  //TODO check we are on Goerli
  const etherscanHref = `${cfg.etherscanTxPrefix}${entry.txHash}`
  const etherscanLinkTxt = `${shortenHash(entry.txHash)}`
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`logentry-${entryNum}`}
        id={`logentry-${entryNum}`}
      >
        <CustomLink href={etherscanHref} target="_blank" rel="noopener">
          {etherscanLinkTxt}
        </CustomLink>

        <Typography marginLeft="16px">{description}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack gap="16px">
          {params.map(([descr, val], ind) => {
            if (!Array.isArray(val))
              return <Typography key={ind}>{`${descr}: ${val}`}</Typography>
            return (
              <div key={ind}>
                <Typography>{`${descr}:`}</Typography>
                {val.map((addr, i) =>
                <Typography key={i}>&nbsp;&nbsp;&nbsp;&nbsp;{addr}</Typography>)
          }
              </div>
            )
          })}
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}

export default LogEntryForElement