import { Grid, Link, styled, Typography } from "@material-ui/core"
import React from "react"
import { IPFS_GATEWAY_URI } from "services/ipfs"
import { NFTMediaType } from "../../../models/Token"

const StyledLink = styled(Link)({
  display: "block",
  height: "100%"
})

const NFTImg = styled("img")({
  maxHeight: "100%",
  maxWidth: "100%",
  width: "auto",
  display: "block"
})

const NFTVideo = styled("video")({
  maxHeight: "100%",
  maxWidth: "100%",
  width: "auto",
  margin: "auto",
  display: "block"
})

const NFTAudio = styled("audio")({
  maxHeight: "100%",
  maxWidth: "100%",
  width: "256px",
  margin: "auto",
  display: "block"
})

interface Props {
  qmHash: string
  name: string
  mediaType: NFTMediaType
}

const NFTContainerGrid = styled(Grid)({
  height: "100%"
})

const NFTContainer: React.FC = ({ children }) => (
  <NFTContainerGrid container direction={"column"} justifyContent={"center"} alignItems={"center"}>
    <Grid item>{children}</Grid>
  </NFTContainerGrid>
)

export const NFT: React.FC<Props> = ({ qmHash, name, mediaType }) => {
  return (
    <StyledLink
      href={`${IPFS_GATEWAY_URI}/${qmHash}`}
      rel="noopener"
      target="_blank"
      style={{ height: "100%", display: "block" }}
      onClick={e => {
        e.stopPropagation()
      }}
    >
      {mediaType === "image" ? (
        <NFTImg src={`${IPFS_GATEWAY_URI}/${qmHash}`} alt={`${name}-thumbnail`} />
      ) : mediaType === "audio" ? (
        <NFTContainer>
          <NFTAudio src={`${IPFS_GATEWAY_URI}/${qmHash}`} controls />
        </NFTContainer>
      ) : mediaType === "video" ? (
        <NFTVideo src={`${IPFS_GATEWAY_URI}/${qmHash}`} controls autoPlay muted />
      ) : (
        <NFTContainer>
          <Typography variant={"body1"} color={"textPrimary"}>
            No Media Available
          </Typography>
        </NFTContainer>
      )}
    </StyledLink>
  )
}
