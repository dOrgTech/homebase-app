import React from "react"
import { Grid, Typography, styled } from "@material-ui/core"
import { ethers } from "ethers"
import { ShortenedValueField } from "./ShortenedValueField"
import { ContainerVoteDetail, Header, AssetLabel } from "components/ui/etherlink/styled"

const AmountContainer = styled(Grid)({
  display: "flex",
  alignItems: "center",
  gap: "8px"
})

interface TransferETHProposalRendererProps {
  proposalData: { parameter: string; value: string }[]
  targets?: string[]
  callDataPlain?: string[]
  values?: any[]
  tokenSymbol?: string
  decimals?: number
}

export const TransferETHProposalRenderer: React.FC<TransferETHProposalRendererProps> = ({
  proposalData,
  targets: _targets,
  callDataPlain: _callDataPlain,
  values: _values,
  tokenSymbol: _tokenSymbol,
  decimals: _decimals
}) => {
  // For Transfer XTZ, the proposalData structure is an array of parameter objects:
  // [
  //   { parameter: "Function", value: "transferETH" },
  //   { parameter: "Signature", value: "transferETH(address to, uint256 amount)" },
  //   { parameter: "to (address)", value: "0x..." },
  //   { parameter: "amount (uint256)", value: "10000000000000000" }
  // ]

  // Find the "to" address parameter
  const toParam = proposalData.find(
    item => item.parameter.toLowerCase().includes("to") && item.parameter.toLowerCase().includes("address")
  )
  const toAddress = toParam?.value || ""

  // Find the "amount" parameter
  const amountParam = proposalData.find(
    item => item.parameter.toLowerCase().includes("amount") && item.parameter.toLowerCase().includes("uint")
  )
  const amountRaw = amountParam?.value || "0"

  // In Etherlink, XTZ is represented like ETH with 18 decimals (wei), not 6 (mutez)
  const XTZ_DECIMALS = 18
  const formatAmount = (value: string) => {
    try {
      // Use ethers.formatUnits to convert from wei to XTZ
      const formatted = ethers.formatUnits(value, XTZ_DECIMALS)
      return formatted
    } catch {
      return value
    }
  }

  const formattedAmount = formatAmount(amountRaw)

  return (
    <ContainerVoteDetail
      container
      direction="column"
      style={{ border: "1px solid #575757", marginTop: 20, padding: 20 }}
    >
      <Grid item style={{ marginBottom: 20 }}>
        <Typography variant="h3" color="textPrimary">
          Transfer XTZ
        </Typography>
      </Grid>
      <Grid item style={{ marginBottom: 16 }}>
        <Header style={{ fontSize: 14, marginBottom: 8 }}>To Address:</Header>
        <ShortenedValueField value={toAddress} label="To Address" />
      </Grid>
      <Grid item>
        <Header style={{ fontSize: 14, marginBottom: 8 }}>Amount:</Header>
        <AmountContainer>
          <ShortenedValueField value={formattedAmount} label="Amount" />
          <AssetLabel>XTZ</AssetLabel>
        </AmountContainer>
      </Grid>
    </ContainerVoteDetail>
  )
}
