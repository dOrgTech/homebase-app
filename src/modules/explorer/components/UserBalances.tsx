import { Button, Grid, styled, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import React, { useMemo } from "react"
import { useTezos } from "services/beacon/hooks/useTezos"
import { useDAO } from "services/services/dao/hooks/useDAO"
import CancelIcon from "@mui/icons-material/Cancel"

const BalancesBox = styled(Grid)(({ theme }) => ({
  minHeight: "137px",
  maxHeight: "344px",
  padding: "38px 38px",
  background: theme.palette.primary.main,
  boxSizing: "border-box",
  borderRadius: 8,
  boxShadow: "none",

  ["@media (max-width:409.99px)"]: {
    maxHeight: "325px"
  }
}))

interface Balances {
  available: {
    displayName: string
    balance?: string
  }
  pending: {
    displayName: string
    balance?: string
  }
  staked: {
    displayName: string
    balance?: string
  }
}

const BalanceHeaderText = styled(Typography)({
  paddingBottom: 10,
  fontSize: 18,
  fontWeight: 600,

  ["@media (max-width:710px)"]: {
    fontSize: 16
  },

  ["@media (max-width:635px)"]: {
    fontSize: 18,
    paddingBottom: 8
  },

  ["@media (max-width:409.99px)"]: {
    fontSize: 16
  }
})

const BalanceGrid = styled(Grid)({
  ["@media (max-width:636px)"]: {
    marginBottom: 25
  },

  ["@media (max-width:409.99px)"]: {
    marginBottom: 20
  }
})

const Balance = styled(Typography)({
  fontSize: 32,
  lineHeight: "0.9",
  fontWeight: 300,

  ["@media (max-width:1030px)"]: {
    fontSize: 30
  }
})

const OnChainTitle = styled(Typography)({
  fontSize: 24,
  fontWeight: 600
})

const OnChainSubtitle = styled(Typography)({
  fontSize: 18,
  fontWeight: 300,
  color: "#bfc5ca",
  lineHeight: "160%"
})

const OnChainBox = styled(Grid)(({ theme }) => ({
  display: "flex",
  padding: "36px 48px 33px 48px",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start",
  gap: 24,
  flexShrink: 0,
  borderRadius: 8,
  background: theme.palette.primary.main,
  maxWidth: "32% !important",
  [theme.breakpoints.down("sm")]: {
    maxWidth: "100% !important",
    marginBottom: 12
  }
}))

const UnstakeText = styled(Typography)({
  marginLeft: 4,
  fontSize: 18
})

const UnstakeButton = styled(Button)({
  "padding": 0,
  "&:hover": {
    backgroundColor: "inherit",
    background: "inherit"
  }
})

export const UserBalances: React.FC<{ daoId: string; canUnstakeVotes: boolean; onUnstakeFromAllProposals: any }> = ({
  daoId,
  children,
  canUnstakeVotes,
  onUnstakeFromAllProposals
}) => {
  const { account } = useTezos()
  const { data: dao, ledger } = useDAO(daoId)
  const symbol = dao && dao.data.token.symbol.toUpperCase()
  const theme = useTheme()
  const isExtraSmall = useMediaQuery(theme.breakpoints.down(635))

  const balances = useMemo(() => {
    const userBalances: Balances = {
      available: {
        displayName: "Available Balance"
      },
      pending: {
        displayName: "Pending Balance"
      },
      staked: {
        displayName: "Staked Balance"
      }
    }

    if (!ledger) {
      return userBalances
    }

    const userLedger = ledger.find(l => l.holder.address.toLowerCase() === account.toLowerCase())

    if (!userLedger) {
      userBalances.available.balance = "-"
      userBalances.pending.balance = "-"
      userBalances.staked.balance = "-"

      return userBalances
    }

    userBalances.available.balance = userLedger.available_balance.dp(10, 1).toString()
    userBalances.pending.balance = userLedger.pending_balance.dp(10, 1).toString()
    userBalances.staked.balance = userLedger.staked.dp(10, 1).toString()
    return userBalances
  }, [account, ledger])

  const balancesList = Object.keys(balances).map(key => balances[key as keyof Balances])

  return (
    <Grid container direction="column" style={{ gap: 40 }}>
      {children}
      <Grid item container direction={isExtraSmall ? "column" : "row"} justifyContent="space-between">
        <Grid container item direction="row">
          <OnChainTitle align="center" color="textPrimary">
            On-Chain {symbol} Balances
          </OnChainTitle>
        </Grid>
        <Grid style={{ marginBottom: 24 }} container item direction="row">
          <OnChainSubtitle>These settings only affect your participation in on-chain polls</OnChainSubtitle>
        </Grid>
        <Grid container direction={isExtraSmall ? "column" : "row"} justifyContent="space-between">
          {dao &&
            balancesList.map(({ displayName, balance }, i) => (
              <OnChainBox item xs key={`balance-${i}`}>
                <BalanceHeaderText color="textPrimary" align={isExtraSmall ? "center" : "left"}>
                  {displayName}
                </BalanceHeaderText>
                <BalanceGrid
                  container
                  alignItems="baseline"
                  justifyContent={isExtraSmall ? "center" : "flex-start"}
                  direction="row"
                >
                  <Grid item xs={6}>
                    <Balance color="textPrimary">{balance}</Balance>
                  </Grid>
                  {i === 2 ? (
                    <Grid item xs container direction="row" alignItems="center" justifyContent="flex-end">
                      <UnstakeButton variant="text" disabled={!canUnstakeVotes} onClick={onUnstakeFromAllProposals}>
                        <CancelIcon style={{ fontSize: 16 }} />
                        <UnstakeText>Unstake</UnstakeText>
                      </UnstakeButton>
                    </Grid>
                  ) : null}
                </BalanceGrid>
              </OnChainBox>
            ))}
        </Grid>
      </Grid>
    </Grid>
  )
}
