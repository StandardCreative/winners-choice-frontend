import { Stack, Typography } from "@mui/material";
import React from "react";
import * as cfg from "../constants";
import NFTCard from "./NFTCard";

const NFTGallery = ({ nftOwners }) => {
  return (
    <>
      <Typography variant="h4" color="primary" textAlign="center">NFKeeTees Gallery</Typography>
      <Stack
        direction="row"
        flexWrap="wrap"
        justifyContent="center"
        sx={{ gridColumnGap: "16px" }}
      >
        {cfg.tokenIds.map((tokenId) => {
          return (
            <NFTCard
              key={tokenId}
              tokenId={tokenId}
              owner={nftOwners[+tokenId - 1]}
            ></NFTCard>
          );
        })}
      </Stack>
    </>
  );
};

export default NFTGallery;
