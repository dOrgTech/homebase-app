import React from "react"
import { Grid, Typography } from "@material-ui/core"
import { ethers } from "ethers"
import { ShortenedValueField } from "./ShortenedValueField"
import { ContainerVoteDetail, Header } from "components/ui/etherlink/styled"

interface MintBurnProposalRendererProps {
  proposalData: { parameter: string; value: string }[]
  proposalType: string
  tokenSymbol?: string
  decimals?: number
  compact?: boolean
}

export const MintBurnProposalRenderer: React.FC<MintBurnProposalRendererProps> = ({
  proposalData,
  proposalType,
  tokenSymbol = "SSE",
  decimals = 18,
  compact = false
}) => {
  const isMint = proposalType?.toLowerCase().includes("mint")
  const actionType = isMint ? "Mint" : "Burn"

  // Extract address and amount from the proposal data
  const addressParam = proposalData.find(
    item =>
      item.parameter.toLowerCase().includes("to") ||
      item.parameter.toLowerCase().includes("from") ||
      item.parameter === "0" ||
      item.parameter.match(/^(to|from)\s*\(/)
  )
  const amountParam = proposalData.find(
    item =>
      item.parameter.toLowerCase().includes("amount") || item.parameter === "1" || item.parameter.match(/^amount\s*\(/)
  )

  const formatAmount = (value: string) => {
    try {
      if (value && !isNaN(Number(value)) && value.length > 10) {
        const formatted = ethers.formatUnits(value, decimals)
        return formatted
      }
      return value
    } catch {
      return value
    }
  }

  const content = (
    <>
      <Grid item style={{ marginBottom: 16 }}>
        <Header style={{ fontSize: 14, marginBottom: 8 }}>To Address:</Header>
        <ShortenedValueField value={addressParam?.value || ""} label="To Address" />
      </Grid>
      <Grid item>
        <Header style={{ fontSize: 14, marginBottom: 8 }}>Amount:</Header>
        <ShortenedValueField value={formatAmount(amountParam?.value || "")} label="Amount" />
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
          {actionType} {tokenSymbol} Tokens
        </Typography>
      </Grid>
      {content}
    </ContainerVoteDetail>
  )
}
