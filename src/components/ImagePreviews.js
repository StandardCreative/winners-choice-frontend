import { Typography } from "@mui/material"
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
        <div
          style={{
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
            gap: "4px",
            paddingBottom: "16px",
            // borderRadius: "4px"
          }}
        >
          {numbers.map((num) => (
            <img
              key={num}
              src={`${nfkeetees1to12NftStorageBaseURI}${num}.jpeg`}
              srcSet={`${nfkeetees1to12NftStorageBaseURI}${num}.jpeg`}
              style={{objectFit:"cover", width:"64px", height:"64px"}}
              alt={`NFKeeTees #${num}`}
              loading="lazy"
            />
          ))}
        </div>
      )}
    </>
  )
}
