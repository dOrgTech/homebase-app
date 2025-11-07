import React, { useContext } from "react"
import BigNumber from "bignumber.js"
import { Box, Grid } from "components/ui"
import { Item, ItemContent, ItemTitle, ItemValue } from "components/ui"
import { formatNumber } from "modules/explorer/utils/FormatNumber"

import { EtherlinkContext } from "services/wagmi/context"
import { IEvmProposal } from "../types"
import { useDaoMembers } from "../hooks/useDaoMembers"

export const EvmDaoStatsRow = () => {
  const { daoSelected, daoProposals, network, provider } = useContext(EtherlinkContext)
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
