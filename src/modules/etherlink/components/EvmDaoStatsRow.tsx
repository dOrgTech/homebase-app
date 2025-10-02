import React, { useContext } from "react"
import { Box, Grid, styled, Typography, Paper } from "@material-ui/core"

import { EtherlinkContext } from "services/wagmi/context"
import { IEvmProposal } from "../types"

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#24282d",
  borderRadius: 8,
  color: theme.palette.text.primary,
  height: 84,
  display: "flex",
  padding: "33px 40px 30px 40px",
  flexDirection: "column",
  gap: 8
}))

const ItemContent = styled(Grid)({
  gap: 8
})

const ItemTitle = styled(Typography)(({ theme }) => ({
  fontSize: 18,
  fontWeight: 500,
  [theme.breakpoints.down("md")]: {
    fontSize: 15
  }
}))

const ItemValue = styled(Typography)(({ theme }) => ({
  fontSize: 32,
  fontWeight: 300,
  overflowX: "scroll",
  cursor: "default",
  [theme.breakpoints.down("sm")]: {
    fontSize: 28
  }
}))

export const EvmDaoStatsRow = () => {
  const { daoSelected, daoProposals } = useContext(EtherlinkContext)
  const awaitingExecutionCount = daoProposals.filter(
    (proposal: IEvmProposal) => proposal.status === "executable"
  )?.length

  const activeProposalsCount = daoProposals.filter((proposal: IEvmProposal) => proposal.status === "active")?.length

  return (
    <Box sx={{ flexGrow: 1, width: "inherit" }}>
      <Grid container spacing={4}>
        {[
          {
            title: "Members",
            value: daoSelected?.holders
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
          <Grid item xs={12} sm={6} md={4} key={index}>
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
