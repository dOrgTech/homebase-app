import React, { Fragment, useEffect, useState } from "react"
import { Grid, Theme, Typography, styled } from "@material-ui/core"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { Edit } from "@material-ui/icons"
import { DelegationDialog } from "./DelegationModal"

export enum DelegationsType {
  ACCEPTING_DELEGATION = "ACCEPTING_DELEGATION",
  NOT_ACCEPTING_DELEGATION = "NOT_ACCEPTING_DELEGATION",
  DELEGATING = "DELEGATING"
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

export const matchTextToStatus = (value: DelegationsType | undefined) => {
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

export const Delegation: React.FC<{ voteWeight: any; daoId: string }> = ({ voteWeight, daoId }) => {
  const { data: dao } = useDAO(daoId)
  const [delegationStatus, setDelegationStatus] = useState<DelegationsType | undefined>(
    DelegationsType.NOT_ACCEPTING_DELEGATION
  )
  const [openModal, setOpenModal] = useState(false)

  const onCloseAction = () => {
    setOpenModal(false)
  }

  useEffect(() => {
    console.log("se actualizó", delegationStatus)
  }, [delegationStatus])

  return (
    <DelegationBox container direction="column">
      <Grid container style={{ gap: 12 }} direction="column">
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
        <Grid container direction="row" justifyContent="space-between" alignItems="center">
          <Grid item xs={6}>
            <Typography color="textPrimary">Delegation Status</Typography>
          </Grid>
          <Grid
            item
            container
            direction="row"
            xs={6}
            alignItems="center"
            justifyContent="flex-end"
            style={{ gap: 4, cursor: "pointer" }}
          >
            <Edit color="secondary" fontSize="small" onClick={() => setOpenModal(true)} />
            <Typography color="secondary" onClick={() => setOpenModal(true)}>
              Edit
            </Typography>
          </Grid>
        </Grid>
        <Subtitle variant="body1">{matchTextToStatus(delegationStatus)}</Subtitle>
      </Grid>
      <DelegationDialog
        open={openModal}
        onClose={onCloseAction}
        status={delegationStatus}
        setDelegationStatus={setDelegationStatus}
      />
    </DelegationBox>
  )
}
