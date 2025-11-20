import React, { useContext, useState } from "react"
import BigNumber from "bignumber.js"
import { ethers } from "ethers"
import { Box, Grid, styled, Typography, IconButton, Tooltip } from "components/ui"
import { Item, ItemContent, ItemTitle, ItemValue } from "components/ui"
import { formatNumber } from "modules/explorer/utils/FormatNumber"
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined"

import { EtherlinkContext } from "services/wagmi/context"
import { IEvmProposal } from "../types"
import { useDaoMembers } from "../hooks/useDaoMembers"

const UnderlyingTokenContainer = styled(Box)({
  padding: "16px 24px",
  background: "rgba(255, 255, 255, 0.05)",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: "8px"
})

const TokenLabel = styled(Typography)({
  color: "rgba(255, 255, 255, 0.7)",
  fontSize: "14px"
})

const TokenAddress = styled(Typography)({
  color: "#fff",
  fontFamily: "monospace",
  fontSize: "14px",
  wordBreak: "break-all"
})

export const EvmDaoStatsRow = () => {
  const { daoSelected, daoProposals, network, provider } = useContext(EtherlinkContext)
  const [copied, setCopied] = useState(false)

  const awaitingExecutionCount = daoProposals.filter(
    (proposal: IEvmProposal) => proposal.status === "executable"
  )?.length

  const activeProposalsCount = daoProposals.filter((proposal: IEvmProposal) => proposal.status === "active")?.length

  const decimals = daoSelected?.decimals || 0
  const totalSupplyDisplay = (() => {
    try {
      if (!daoSelected?.totalSupply) return "-"
      const normalized = new BigNumber(daoSelected.totalSupply).dividedBy(new BigNumber(10).pow(decimals))
      const formatted = formatNumber(normalized)
      return formatted !== undefined && formatted !== null ? String(formatted) : "-"
    } catch (_) {
      return "-"
    }
  })()

  const { data: daoMemberData = [] } = useDaoMembers(network || "", daoSelected?.token || "", decimals, provider)

  // Check if this is a wrapped token DAO with a valid underlying token address
  const underlyingToken = daoSelected?.underlyingToken
  const isWrappedTokenDao =
    !!underlyingToken && typeof underlyingToken === "string" && ethers.isAddress(underlyingToken)

  const handleCopyAddress = () => {
    if (underlyingToken) {
      navigator.clipboard.writeText(underlyingToken)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // For wrapped token DAOs, show underlying token address instead of stats
  if (isWrappedTokenDao) {
    return (
      <Box style={{ flexGrow: 1, width: "inherit" }}>
        <UnderlyingTokenContainer>
          <Box>
            <TokenLabel>Voting power is derived from underlying token:</TokenLabel>
            <TokenAddress>{underlyingToken}</TokenAddress>
          </Box>
          <Tooltip title={copied ? "Copied!" : "Copy address"}>
            <IconButton size="small" onClick={handleCopyAddress} style={{ color: "rgba(255, 255, 255, 0.7)" }}>
              <FileCopyOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </UnderlyingTokenContainer>
      </Box>
    )
  }

  return (
    <Box style={{ flexGrow: 1, width: "inherit" }}>
      <Grid container spacing={4}>
        {[
          {
            title: "Voting Power",
            value: totalSupplyDisplay
          },
          {
            title: "Members",
            value: daoMemberData?.length || "-"
          },
          {
            title: "Active Proposals",
            value: daoSelected?.proposals?.length || activeProposalsCount || "0"
          },
          {
            title: "Awaiting Executions",
            value: daoSelected?.awaiting_executions || awaitingExecutionCount || "-"
          }
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Item>
              <ItemContent item container direction="row" alignItems="center">
                <ItemTitle color="textPrimary">{item.title} </ItemTitle>
              </ItemContent>
              <Grid item>
                <ItemValue color="textPrimary">{item.value}</ItemValue>
              </Grid>
            </Item>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
