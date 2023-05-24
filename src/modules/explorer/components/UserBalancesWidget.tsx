import { Grid, styled, Theme, Typography, useTheme } from "@material-ui/core"
import BigNumber from "bignumber.js"
import hexToRgba from "hex-to-rgba"
import React, { useMemo } from "react"
import { useTezos } from "services/beacon/hooks/useTezos"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { useDAOID } from "../pages/DAO/router"

const BalanceBox = styled(Grid)(({ radiusSide, color }: { radiusSide: "left" | "right" | "none"; color: string }) => {
  let borderRadius = "0"

  switch (radiusSide) {
    case "none": {
      break
    }
    case "left": {
      borderRadius = "4px 0 0 4px"
      break
    }
    case "right": {
      borderRadius = "0 4px 4px 0"
      break
    }
  }

  return {
    "width": 166,
    "height": 41.85,
    borderRadius,
    color,
    "backgroundColor": hexToRgba(color, 0.15),
    "& > div": {
      height: "100%"
    }
  }
})

const TitleText = styled(Typography)({
  fontSize: 11,
  fontWeight: 500
})

const BalanceText = styled(Typography)({
  fontSize: 15,
  fontWeight: 500
})

export const UserBalancesWidget: React.FC = () => {
  const { account } = useTezos()
  const daoId = useDAOID()
  const { ledger, data: dao } = useDAO(daoId)
  const theme = useTheme<Theme>()
  const userLedger = useMemo(() => {
    const found = ledger?.find(l => l.holder.address.toLowerCase() === account.toLowerCase())

    return (
      found || {
        available_balance: new BigNumber(0),
        pending_balance: new BigNumber(0),
        staked: new BigNumber(0)
      }
    )
  }, [account, ledger])

  return (
    <Grid container justifyContent="center">
      {userLedger && dao && (
        <>
          <BalanceBox item color={theme.palette.secondary.main} radiusSide="left">
            <Grid container alignItems="center" justifyContent="center">
              <Grid item>
                <TitleText align="center" color="inherit">
                  Available Balance
                </TitleText>
                <BalanceText align="center" color="textPrimary">
                  {userLedger.available_balance.toString()} {dao.data.token.symbol}
                </BalanceText>
              </Grid>
            </Grid>
          </BalanceBox>
          <BalanceBox item color={theme.palette.warning.main} radiusSide="none">
            <Grid container alignItems="center" justifyContent="center">
              <Grid item>
                <TitleText align="center" color="inherit">
                  Pending Balance
                </TitleText>
                <BalanceText align="center" color="textPrimary">
                  {userLedger.pending_balance.toString()} {dao.data.token.symbol}
                </BalanceText>
              </Grid>
            </Grid>
          </BalanceBox>
          <BalanceBox item color={theme.palette.info.main} radiusSide="right">
            <Grid container alignItems="center" justifyContent="center">
              <Grid item>
                <TitleText align="center" color="inherit">
                  Staked Balance
                </TitleText>
                <BalanceText align="center" color="textPrimary">
                  {userLedger.staked.toString()} {dao.data.token.symbol}
                </BalanceText>
              </Grid>
            </Grid>
          </BalanceBox>
        </>
      )}
    </Grid>
  )
}
