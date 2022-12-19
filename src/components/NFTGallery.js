import { Stack, Typography } from "@mui/material";
import React from "react";
import * as cfg from "../constants";
import NFTCard from "./NFTCard";
const NFTGallery = () => {
  return (
    <>
      <Typography variant="h6">NFKeeTees Gallery</Typography>
      <Stack>
        {cfg.tokenIds.map((tokenId) => {
          return <NFTCard key={tokenId} tokenId={tokenId}></NFTCard>;
        })}
      </Stack>
    </>
  );
};

export default NFTGallery;
