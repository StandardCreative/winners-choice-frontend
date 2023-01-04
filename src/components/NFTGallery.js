import { Stack, Typography } from "@mui/material";
import React from "react";
import * as cfg from "../constants";
import NFTCard from "./NFTCard";

const NFTGallery = ({ nftOwners, metadatas }) => {
  return (
    <>
      <Typography variant="h4" color="primary" textAlign="center">NFKeeTees Gallery</Typography>
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
              owner={nftOwners[ind]}
              jsonData={jsonData}
            ></NFTCard>
          );
        })}
      </Stack>
    </>
  );
};

export default NFTGallery;
