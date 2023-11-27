import React, { useMemo } from "react"
import { Box, Grid, styled, useTheme, Typography, Paper } from "@material-ui/core"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { useProposals } from "services/services/dao/hooks/useProposals"
import BigNumber from "bignumber.js"
import { ProposalStatus } from "services/services/dao/mappers/proposal/types"
import { useDAOID } from "../pages/DAO/router"
import { usePolls } from "modules/lite/explorer/hooks/usePolls"
import dayjs from "dayjs"
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"
import FiberSmartRecordIcon from "@mui/icons-material/FiberSmartRecord"
import LockIcon from "@mui/icons-material/Lock"
import HowToVoteIcon from "@mui/icons-material/HowToVote"
import PaletteIcon from "@mui/icons-material/Palette"
import { ReactComponent as TzIcon } from "assets/img/tz_circle.svg"
import { formatNumber } from "../utils/FormatNumber"
import { useDAOHoldings, useDAONFTHoldings } from "services/contracts/baseDAO/hooks/useDAOHoldings"

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
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
  fontWeight: 600,
  [theme.breakpoints.down("md")]: {
    fontSize: 15
  }
}))

const ItemValue = styled(Typography)(({ theme }) => ({
  fontSize: 36,
  fontWeight: 300,
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

export const DAOStatsRow: React.FC = () => {
  const daoId = useDAOID()
  const { data, ledger } = useDAO(daoId)
  const symbol = data && data.data.token.symbol.toUpperCase()
  const theme = useTheme()
  const { data: activeProposals } = useProposals(daoId, ProposalStatus.ACTIVE)
  const { data: polls } = usePolls(data?.liteDAOData?._id)
  const activeLiteProposals = polls?.filter(p => Number(p.endTime) > dayjs().valueOf())
  const { tokenHoldings } = useDAOHoldings(daoId)
  const { nftHoldings } = useDAONFTHoldings(daoId)

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
    if (!data) {
      return new BigNumber(0)
    }

    return data.data.token.supply
  }, [data])

  const totalTokens = amountLocked.plus(amountNotLocked)

  const amountLockedPercentage = totalTokens ? amountLocked.div(totalTokens).multipliedBy(100) : new BigNumber(0)

  return (
    <Box sx={{ flexGrow: 1, width: "inherit" }}>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4}>
          <Item>
            <ItemContent item container direction="row" alignItems="center">
              <AccountBalanceWalletIcon color="secondary" />
              <ItemTitle color="textPrimary">Total {symbol}</ItemTitle>
            </ItemContent>
            <Grid item>
              <ItemValue color="textPrimary">{formatNumber(totalTokens)}</ItemValue>
            </Grid>
          </Item>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Item>
            <ItemContent item container direction="row" alignItems="center">
              <TzIcon color="secondary" />
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
              <FiberSmartRecordIcon color="secondary" style={{ transform: "rotate(180deg)" }} />
              <ItemTitle color="textPrimary">Tokens</ItemTitle>
            </ItemContent>
            <Grid item>
              <ItemValue color="textPrimary">{tokenHoldings.length || "-"}</ItemValue>
            </Grid>
          </Item>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Item>
            <ItemContent item container direction="row" alignItems="center">
              <LockIcon color="secondary" /> <ItemTitle color="textPrimary">{symbol} Locked</ItemTitle>
            </ItemContent>
            <Grid item container direction="row">
              <ItemValue color="textPrimary">{formatNumber(amountLocked)}</ItemValue>
              <Percentage color="textPrimary">{formatNumber(amountLockedPercentage)}%</Percentage>
            </Grid>
          </Item>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Item>
            <ItemContent item container direction="row" alignItems="center">
              <HowToVoteIcon color="secondary" />
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
              <PaletteIcon color="secondary" />
              <ItemTitle color="textPrimary">NFTs</ItemTitle>
            </ItemContent>
            <Grid item>
              <ItemValue color="textPrimary">{nftHoldings?.length || "-"}</ItemValue>
            </Grid>
          </Item>
        </Grid>
      </Grid>
    </Box>
  )
}
