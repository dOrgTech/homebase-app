import React from "react"
import { Grid, styled, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { Network } from "services/beacon"
import { useDAOTreasuryBalance } from "../hooks/useDAOTreasuryBalance"

const HintText = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  fontWeight: 300,
  color: theme.palette.primary.light
}))

const WarningText = styled(Typography)({
  fontSize: 14,
  fontWeight: 300,
  color: "#ED254E"
})

interface Props {
  daoContract: string | undefined
  network: string | undefined
  amount: string | undefined
}

/**
 * Shows the linked on-chain DAO's XTZ treasury balance next to a requested
 * amount, and warns when the request cannot be covered. Renders nothing when
 * the community has no on-chain DAO.
 */
export const TreasuryBalanceHint: React.FC<Props> = ({ daoContract, network, amount }) => {
  const { data: balance } = useDAOTreasuryBalance(daoContract, network as Network)

  if (!daoContract || !balance) {
    return null
  }

  const parsedAmount = amount ? new BigNumber(amount) : undefined
  const exceedsBalance = parsedAmount && parsedAmount.isFinite() && parsedAmount.gt(balance)

  return (
    <Grid container direction="column" style={{ gap: 4, marginTop: 8 }}>
      <Grid item>
        <HintText>DAO treasury balance: {balance.dp(6, BigNumber.ROUND_DOWN).toString()} XTZ</HintText>
      </Grid>
      {exceedsBalance ? (
        <Grid item>
          <WarningText>Requested amount exceeds the DAO treasury balance</WarningText>
        </Grid>
      ) : null}
    </Grid>
  )
}
