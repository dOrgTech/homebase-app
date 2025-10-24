import React from "react"
import { Grid, Typography } from "@material-ui/core"
import { ethers } from "ethers"
import { ShortenedValueField } from "./ShortenedValueField"
import { ContainerVoteDetail, Header } from "components/ui/etherlink/styled"

interface TransferERC20ProposalRendererProps {
  proposalData: { parameter: string; value: string }[]
  decimals?: number
}

export const TransferERC20ProposalRenderer: React.FC<TransferERC20ProposalRendererProps> = ({
  proposalData,
  decimals = 18
}) => {
  // For Transfer ERC20, the proposalData structure is an array of parameter objects:
  // [
  //   { parameter: "Function", value: "transferERC20" },
  //   { parameter: "Signature", value: "transferERC20(address token, address to, uint256 amount)" },
  //   { parameter: "token (address)", value: "0x..." },
  //   { parameter: "to (address)", value: "0x..." },
  //   { parameter: "amount (uint256)", value: "..." }
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

  // Find the "amount" parameter
  const amountParam = proposalData.find(
    item => item.parameter.toLowerCase().includes("amount") && item.parameter.toLowerCase().includes("uint")
  )
  const amountRaw = amountParam?.value || "0"

  // Format the amount with decimals
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

  return (
    <ContainerVoteDetail
      container
      direction="column"
      style={{ border: "1px solid #575757", marginTop: 20, padding: 20 }}
    >
      <Grid item style={{ marginBottom: 20 }}>
        <Typography variant="h3" color="textPrimary">
          Transfer ERC20 Token
        </Typography>
      </Grid>
      <Grid item style={{ marginBottom: 16 }}>
        <Header style={{ fontSize: 14, marginBottom: 8 }}>Token Address:</Header>
        <ShortenedValueField value={tokenAddress} label="Token Address" />
      </Grid>
      <Grid item style={{ marginBottom: 16 }}>
        <Header style={{ fontSize: 14, marginBottom: 8 }}>To Address:</Header>
        <ShortenedValueField value={toAddress} label="To Address" />
      </Grid>
      <Grid item>
        <Header style={{ fontSize: 14, marginBottom: 8 }}>Amount:</Header>
        <ShortenedValueField value={formatAmount(amountRaw)} label="Amount" />
      </Grid>
    </ContainerVoteDetail>
  )
}
