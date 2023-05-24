import { Grid, styled, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import React, { useMemo } from "react"
import { useTezos } from "services/beacon/hooks/useTezos"
import { useDAO } from "services/services/dao/hooks/useDAO"

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
  fontSize: 36,
  lineHeight: "0.9",
  fontWeight: 300,

  ["@media (max-width:1030px)"]: {
    fontSize: 30
  }
})

const BalanceToken = styled(Typography)({
  fontSize: 24,
  fontWeight: 300
})

export const UserBalances: React.FC<{ daoId: string }> = ({ daoId, children }) => {
  const { account } = useTezos()
  const { data: dao, ledger } = useDAO(daoId)
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
        {dao &&
          balancesList.map(({ displayName, balance }, i) => (
            <Grid item key={`balance-${i}`}>
              <BalanceHeaderText color="secondary" align={isExtraSmall ? "center" : "left"}>
                {displayName}
              </BalanceHeaderText>
              <BalanceGrid
                container
                alignItems="baseline"
                spacing={1}
                justifyContent={isExtraSmall ? "center" : "flex-start"}
              >
                <Grid item>
                  <Balance color="textPrimary">{balance}</Balance>
                </Grid>
                <Grid item>
                  <BalanceToken color="textPrimary">{balance !== "-" ? dao.data.token.symbol : ""}</BalanceToken>
                </Grid>
              </BalanceGrid>
            </Grid>
          ))}
      </Grid>
    </Grid>
  )
}

export const UserBalancesBox: React.FC<{ daoId: string }> = ({ daoId }) => {
  return (
    <BalancesBox item>
      <UserBalances daoId={daoId} />
    </BalancesBox>
  )
}
