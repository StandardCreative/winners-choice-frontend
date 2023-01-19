import { Typography } from "@mui/material"
import ImageList from "@mui/material/ImageList"
import ImageListItem from "@mui/material/ImageListItem"
import * as React from "react"
import { nfkeetees1to12NftStorageBaseURI } from "../constants"

export function ImagePreviews({ nFolios, isPremadeArtURI }) {
  let nImgs
  let nFoliosNum = +nFolios
  if (nFolios === "") nImgs = 12
  else if (Number.isNaN(nFoliosNum) || nFoliosNum < 1) nImgs = 0
  else if (nFoliosNum <= 12) nImgs = nFoliosNum
  else {
    // > 12
    nFoliosNum = 13
    nImgs = 12
  }
  let numbers = Array.from({ length: nImgs }, (_, i) => i + 1)
  console.log({ numbers })

  let previewText
  if (!isPremadeArtURI)
    previewText =
      "Only available for pre-made art (default base and suffix URI)"
  else if (!nImgs)
    previewText = "Select a valid number of folios to show preview"
  else if (nFoliosNum === 13)
    previewText = "Warning: pre-made art only has 12 images"
  return (
    <>
      <Typography variant="h6">NFT collection preview </Typography>
      {!!previewText && <Typography variant="body1">{previewText}</Typography>}
      {isPremadeArtURI && !!nImgs && (
        <ImageList sx={{ width: "90%", height: 100 }} cols={12} rowHeight={100}>
          {numbers.map((num) => (
            <ImageListItem key={num}>
              <img
                src={`${nfkeetees1to12NftStorageBaseURI}${num}.jpeg`}
                srcSet={`${nfkeetees1to12NftStorageBaseURI}${num}.jpeg`}
                alt={`NFKeeTees #${num}`}
                loading="lazy"
              />
            </ImageListItem>
          ))}
        </ImageList>
      )}
    </>
  )
}
