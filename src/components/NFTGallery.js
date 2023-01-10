import { Stack, Typography } from "@mui/material";
import React from "react";
import * as cfg from "../constants";
import NFTCard from "./NFTCard";

const NFTGallery = ({ nftOwners, metadatas }) => {
  return (
    <>
      <Typography variant="h5" color="primary" textAlign="center">Art</Typography>
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
          );
        })}
      </Stack>
    </>
  );
};

export default NFTGallery;
