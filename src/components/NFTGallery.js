import { Stack, Typography } from "@mui/material"
import React from "react"
import * as cfg from "../constants"
import NFTCard from "./NFTCard"

const NFTGallery = ({ nftOwners, metadatas, nFolios}) => {
  console.log("nftgallery, len metadatas ", metadatas.length)
  const nToFetch = nFolios - metadatas.length
  let infotxt = `Total pieces in the collection: ${nFolios}`
  if (nToFetch) infotxt += `, still fetching: ${nToFetch}`
  return (
    <>
      <Typography variant="h5" color="primary" textAlign="center">
        {nFolios ? "Art" : ""}
      </Typography>
      {(nFolios != 0) && <Typography variant="h6" color="text.secondary" textAlign="center">
        {infotxt}
      </Typography>}
      {/* <Typography variant="body" color="text.secondary" textAlign="center">
        {infotxt}
      </Typography> */}
      <Stack
        direction="row"
        flexWrap="wrap"
        justifyContent="center"
        sx={{ gridColumnGap: "16px" }}
      >
        {metadatas.map((jsonData, ind) => {
          return (
            <NFTCard
              key={ind}
              tokenId={ind}
              owner={nftOwners[ind] ?? cfg.PLACEHOLDER_OWNER}
              jsonData={jsonData}
            ></NFTCard>
          )
        })}
      </Stack>
    </>
  )
}

export default NFTGallery
