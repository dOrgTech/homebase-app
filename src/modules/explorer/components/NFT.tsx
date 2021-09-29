import { Link } from "@material-ui/core";
import { styled } from "@material-ui/styles";
import React from "react";
import { IPFS_GATEWAY_URI } from "services/ipfs";

const NFTImg = styled("img")({
  maxHeight: "100%",
  maxWidth: "100%",
  width: "auto",
  display: "block",
});

const NFTVideo = styled("video")({
  maxHeight: "100%",
  maxWidth: "100%",
  width: "auto",
  margin: "auto",
  display: "block",
});

interface Props {
  qmHash: string;
  name: string;
  mimeType: string;
}

const getFormatTag = (mimeType: string) => {
  if (mimeType.includes("video")) {
    return "video";
  }

  return "image";
};

export const NFT: React.FC<Props> = ({ qmHash, name, mimeType }) => {
  const format = getFormatTag(mimeType);

  return (
    <Link
      href={`${IPFS_GATEWAY_URI}/${qmHash}`}
      rel="noopener"
      target="_blank"
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      {format === "image" ? (
        <NFTImg
          src={`${IPFS_GATEWAY_URI}/${qmHash}`}
          alt={`${name}-thumbnail`}
        />
      ) : (
        <NFTVideo
          src={`${IPFS_GATEWAY_URI}/${qmHash}`}
          controls
          autoPlay
          muted
        />
      )}
    </Link>
  );
};
