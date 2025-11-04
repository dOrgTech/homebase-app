import React from "react"
import { Grid, Typography } from "@material-ui/core"
import { ShortenedValueField } from "./ShortenedValueField"
import { ContainerVoteDetail, Header } from "components/ui/etherlink/styled"

interface TransferERC721ProposalRendererProps {
  proposalData: { parameter: string; value: string }[]
  compact?: boolean
}

export const TransferERC721ProposalRenderer: React.FC<TransferERC721ProposalRendererProps> = ({
  proposalData,
  compact = false
}) => {
  // For Transfer ERC721 (NFT), the proposalData structure is an array of parameter objects:
  // [
  //   { parameter: "Function", value: "transferERC721" },
  //   { parameter: "Signature", value: "transferERC721(address token, address to, uint256 tokenId)" },
  //   { parameter: "token (address)", value: "0x..." },
  //   { parameter: "to (address)", value: "0x..." },
  //   { parameter: "tokenId (uint256)", value: "..." }
  // ]

  // Find the "token" address parameter
  const tokenParam = proposalData.find(
    item =>
      item.parameter.toLowerCase().includes("token") &&
      item.parameter.toLowerCase().includes("address") &&
      !item.parameter.toLowerCase().includes("tokenid")
  )
  const tokenAddress = tokenParam?.value || ""

  // Find the "to" address parameter
  const toParam = proposalData.find(
    item =>
      item.parameter.toLowerCase().includes("to") &&
      item.parameter.toLowerCase().includes("address") &&
      !item.parameter.toLowerCase().includes("token")
  )
  const toAddress = toParam?.value || ""

  const tokenIdParam = proposalData.find(
    item => item.parameter.toLowerCase().includes("tokenid") && item.parameter.toLowerCase().includes("uint")
  )
  const tokenId = tokenIdParam?.value || "0"

  const content = (
    <>
      <Grid item style={{ marginBottom: 16 }}>
        <Header style={{ fontSize: 14, marginBottom: 8 }}>NFT Contract Address:</Header>
        <ShortenedValueField value={tokenAddress} label="NFT Contract Address" />
      </Grid>
      <Grid item style={{ marginBottom: 16 }}>
        <Header style={{ fontSize: 14, marginBottom: 8 }}>To Address:</Header>
        <ShortenedValueField value={toAddress} label="To Address" />
      </Grid>
      <Grid item>
        <Header style={{ fontSize: 14, marginBottom: 8 }}>Token ID:</Header>
        <ShortenedValueField value={tokenId} label="Token ID" />
      </Grid>
    </>
  )

  if (compact) {
    return <>{content}</>
  }

  return (
    <ContainerVoteDetail
      container
      direction="column"
      style={{ border: "1px solid #575757", marginTop: 20, padding: 20 }}
    >
      <Grid item style={{ marginBottom: 20 }}>
        <Typography variant="h3" color="textPrimary">
          Transfer ERC721 NFT
        </Typography>
      </Grid>
      {content}
    </ContainerVoteDetail>
  )
}
