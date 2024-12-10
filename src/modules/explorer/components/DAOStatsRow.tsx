import React, { useMemo } from "react"
import { Box, Grid, styled, useTheme, Typography, Paper } from "@material-ui/core"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { useProposals } from "services/services/dao/hooks/useProposals"
import BigNumber from "bignumber.js"
import { ProposalStatus } from "services/services/dao/mappers/proposal/types"
import { useDAOID } from "../pages/DAO/router"
import { usePolls } from "modules/lite/explorer/hooks/usePolls"
import dayjs from "dayjs"
import { useDAOHoldings, useDAONFTHoldings } from "services/contracts/baseDAO/hooks/useDAOHoldings"
import { useTimeLeftInCycle } from "../hooks/useTimeLeftInCycle"
import { useIsProposalButtonDisabled } from "services/contracts/baseDAO/hooks/useCycleInfo"
import numbro from "numbro"

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

const Percentage = styled(Typography)({
  fontSize: 18,
  fontWeight: 300,
  marginTop: 20,
  paddingLeft: 18
})

const formatConfig = {
  average: true,
  mantissa: 1,
  thousandSeparated: true,
  trimMantissa: true
}

const DAOStatsRowTezos = () => {
  const daoId = useDAOID()
  const { data, ledger, cycleInfo } = useDAO(daoId)
  const symbol = data && data.data.token.symbol.toUpperCase()
  const { data: activeProposals } = useProposals(daoId, ProposalStatus.ACTIVE)
  const { data: polls } = usePolls(data?.liteDAOData?._id)
  const activeLiteProposals = polls?.filter(p => Number(p.endTime) > dayjs().valueOf())
  const { tokenHoldings } = useDAOHoldings(daoId)
  const { data: executableProposals } = useProposals(daoId, ProposalStatus.EXECUTABLE)
  const { hours, minutes, days } = useTimeLeftInCycle()
  const shouldDisable = useIsProposalButtonDisabled(daoId)
  const tokenDecimals = data?.data.token.decimals || 0
  const tokenScaleFactor = new BigNumber(10).pow(tokenDecimals)

  const amountLocked = useMemo(() => {
    if (!ledger) {
      return new BigNumber(0)
    }

    return ledger.reduce((acc, current) => {
      const frozenBalance = new BigNumber(current.total_balance) || new BigNumber(0)
      return acc.plus(frozenBalance)
    }, new BigNumber(0))
  }, [ledger])

  const amountNotLocked = useMemo(() => {
    return data?.data.token.supply || new BigNumber(0)
  }, [data])

  const totalTokens = amountLocked.plus(amountNotLocked)

  const amountLockedPercentage = totalTokens ? amountLocked.div(totalTokens).multipliedBy(100) : new BigNumber(0)

  const totalTokensWithoutDecimals = totalTokens.dividedBy(tokenScaleFactor)
  const amountLockedWithoutDecimals = amountLocked.dividedBy(tokenScaleFactor)

  return (
    <Box sx={{ flexGrow: 1, width: "inherit" }}>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4}>
          <Item>
            <ItemContent item container direction="row" alignItems="center">
              <ItemTitle color="textPrimary">Total {symbol}</ItemTitle>
            </ItemContent>
            <Grid item>
              <ItemValue color="textPrimary">{numbro(totalTokensWithoutDecimals).format(formatConfig)}</ItemValue>
            </Grid>
          </Item>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Item>
            <ItemContent item container direction="row" alignItems="center">
              <ItemTitle color="textPrimary">{symbol} Locked</ItemTitle>
            </ItemContent>
            <Grid item container direction="row">
              <ItemValue color="textPrimary">{numbro(amountLocked).format(formatConfig)}</ItemValue>
              <Percentage color="textPrimary">{numbro(amountLockedPercentage).format(formatConfig)}%</Percentage>
            </Grid>
          </Item>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Item>
            <ItemContent item container direction="row" alignItems="center">
              <ItemTitle color="textPrimary">{symbol} Locked</ItemTitle>
            </ItemContent>
            <Grid item container direction="row">
              <ItemValue color="textPrimary">{numbro(amountLocked).format(formatConfig)}</ItemValue>
              <Percentage color="textPrimary">{numbro(amountLockedPercentage).format(formatConfig)}%</Percentage>
            </Grid>
          </Item>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Item>
            <ItemContent item container direction="row" alignItems="center">
              <ItemTitle color="textPrimary">Voting Addresses</ItemTitle>
            </ItemContent>
            <Grid item>
              <ItemValue color="textPrimary">{data?.data.ledger.length || "-"}</ItemValue>
            </Grid>
          </Item>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Item>
            <ItemContent item container direction="row" alignItems="center">
              <ItemTitle color="textPrimary">Cycle Status</ItemTitle>
            </ItemContent>
            <Grid item>
              <ItemValue color="textPrimary">{shouldDisable ? "Voting" : "Creating"}</ItemValue>
            </Grid>
          </Item>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Item>
            <ItemContent item container direction="row" alignItems="center">
              <ItemTitle color="textPrimary">Current Cycle</ItemTitle>
            </ItemContent>
            <Grid item>
              <ItemValue color="textPrimary">{cycleInfo?.currentCycle}</ItemValue>
            </Grid>
          </Item>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Item>
            <ItemContent item container direction="row" alignItems="center">
              <ItemTitle color="textPrimary">Time Left in Cycle</ItemTitle>
            </ItemContent>
            <Grid item>
              <ItemValue color="textPrimary">
                {" "}
                {days}d {hours}h {minutes}m{" "}
              </ItemValue>
            </Grid>
          </Item>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Item>
            <ItemContent item container direction="row" alignItems="center">
              <ItemTitle color="textPrimary">Total Tokens</ItemTitle>
            </ItemContent>
            <Grid item>
              <ItemValue color="textPrimary">{tokenHoldings.length || "-"}</ItemValue>
            </Grid>
          </Item>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Item>
            <ItemContent item container direction="row" alignItems="center">
              <ItemTitle color="textPrimary">Active Proposals</ItemTitle>
            </ItemContent>
            <Grid item>
              <ItemValue color="textPrimary">
                {" "}
                {activeLiteProposals
                  ? Number(activeProposals?.length) + Number(activeLiteProposals?.length)
                  : Number(activeProposals?.length)}
              </ItemValue>
            </Grid>
          </Item>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Item>
            <ItemContent item container direction="row" alignItems="center">
              <ItemTitle color="textPrimary">Executable Proposals</ItemTitle>
            </ItemContent>
            <Grid item>
              <ItemValue color="textPrimary">{executableProposals?.length}</ItemValue>
            </Grid>
          </Item>
        </Grid>
      </Grid>
    </Box>
  )
}

export const DAOStatsRowEtherlink = () => {
  const daoId = useDAOID()
  const { data } = useDAO(daoId)
  const daoStats = data?.data?.etherlink?.stats
  return (
    <Box sx={{ flexGrow: 1, width: "inherit" }}>
      <Grid container spacing={4}>
        {[
          {
            title: "Members",
            value: daoStats?.members
          },
          {
            title: "Active Proposals",
            value: daoStats?.active_proposals
          },
          {
            title: "Awaiting Executions",
            value: daoStats?.awaiting_executions || "-"
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

export const DAOStatsRow: React.FC = () => {
  const daoId = useDAOID()
  const { data } = useDAO(daoId)
  const network = data?.data.network
  return network?.startsWith("etherlink") ? <DAOStatsRowEtherlink /> : <DAOStatsRowTezos />
}
