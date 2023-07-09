import React, { useState } from "react"
import { Grid, Theme, Typography, styled } from "@material-ui/core"
import { useDAO } from "services/services/dao/hooks/useDAO"

export enum DelegationsType {
  ACCEPTING_DELEGATION = "ACCEPTING_DELEGATION",
  NOT_ACCEPTING_DELEGATION = "NOT_ACCEPTING_DELEGATION",
  DELEGATING = "DELEGATING"
}

interface DelegationStatus {
  status: DelegationsType.ACCEPTING_DELEGATION | DelegationsType.NOT_ACCEPTING_DELEGATION | DelegationsType.DELEGATING
}

const DelegationBox = styled(Grid)(({ theme }: { theme: Theme }) => ({
  minHeight: "178px",
  padding: "46px 55px",
  background: theme.palette.primary.main,
  boxSizing: "border-box",
  borderRadius: 8,
  boxShadow: "none",
  gap: 32
}))

const Subtitle = styled(Typography)({
  fontWeight: 200,
  color: "#fff",
  fontSize: 16
})

const Balance = styled(Typography)({
  fontSize: 24,
  fontWeight: 200
})

export const Delegation: React.FC<{ voteWeight: any; daoId: string }> = ({ voteWeight, daoId }) => {
  const { data: dao } = useDAO(daoId)
  const [delegationStatus, setDelegationStatus] = useState<DelegationsType>(DelegationsType.NOT_ACCEPTING_DELEGATION)

  const matchTextToStatus = (value: DelegationsType) => {
    switch (value) {
      case DelegationsType.ACCEPTING_DELEGATION:
        return "Accepting delegations"
      case DelegationsType.NOT_ACCEPTING_DELEGATION:
        return "Not currently accepting delegations or delegating"
      case DelegationsType.DELEGATING:
        return "Delegating to "
      default:
        return
    }
  }

  return (
    <DelegationBox container direction="column">
      <Grid container style={{ gap: 12 }}>
        <Typography variant="h4" color="textPrimary">
          Off-chain Delegation
        </Typography>
        <Subtitle variant="body1">These settings only affect your participation in off-chain polls</Subtitle>
      </Grid>
      {dao && (
        <Grid container style={{ gap: 12 }} direction="column">
          <Typography color="textPrimary">Voting Weight</Typography>
          <Balance color="secondary">
            {voteWeight} {voteWeight !== "-" ? dao.data.token.symbol : ""}
          </Balance>
        </Grid>
      )}
      <Grid container style={{ gap: 12 }} direction="column">
        <Typography color="textPrimary">Delegation Status</Typography>
        <Subtitle variant="body1">{matchTextToStatus(delegationStatus)}</Subtitle>
      </Grid>
    </DelegationBox>
  )
}
