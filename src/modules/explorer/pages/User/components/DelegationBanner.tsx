/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useState } from "react"
import { Box, CircularProgress, Grid, Theme, Typography, styled, withStyles } from "@material-ui/core"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { Edit } from "@material-ui/icons"
import { DelegationDialog } from "./DelegationModal"
import { useDelegationStatus } from "services/contracts/token/hooks/useDelegationStatus"
import { useTezos } from "services/beacon/hooks/useTezos"
import { useDelegationVoteWeight } from "services/contracts/token/hooks/useDelegationVoteWeight"
import BigNumber from "bignumber.js"
import { parseUnits } from "services/contracts/utils"
import { ProfileAvatar } from "modules/explorer/components/styled/ProfileAvatar"
import { CopyButton } from "modules/common/CopyButton"

export enum DelegationsType {
  NOT_DELEGATING = "NOT_DELEGATING",
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

const CustomCopyButton = withStyles({
  root: {
    "& .MuiBox-root": {
      padding: "0px !important"
    }
  },
  disabled: {}
})(Grid)

export const matchTextToStatus = (value: DelegationsType | undefined) => {
  switch (value) {
    case DelegationsType.NOT_DELEGATING:
      return "Not delegating"
    case DelegationsType.DELEGATING:
      return "Delegating to "
    default:
      return
  }
}

export const Delegation: React.FC<{ daoId: string }> = ({ daoId }) => {
  const { data: dao } = useDAO(daoId)
  const { network, account, connect } = useTezos()

  const { data: delegatedTo, isLoading, refetch } = useDelegationStatus(dao?.data.token.contract)
  const [delegationStatus, setDelegationStatus] = useState<DelegationsType>(DelegationsType.NOT_DELEGATING)
  const [openModal, setOpenModal] = useState(false)
  const { data: delegateVoteBalances } = useDelegationVoteWeight(dao?.data.token.contract, dao?.data.address)
  const [voteWeight, setVoteWeight] = useState(new BigNumber(0))
  const [loadingRes, setLoadingRes] = useState(true)
  const [shouldRefetch, setShouldRefetch] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoadingRes(false)
    }, 4000)
  }, [])

  setTimeout(() => {
    if (shouldRefetch) {
      refetch()
    }
  }, 60000)

  const onCloseAction = () => {
    setOpenModal(false)
  }

  useEffect(() => {
    if (delegatedTo === account) {
      setDelegationStatus(DelegationsType.DELEGATING)
    } else if (delegatedTo && delegatedTo !== account) {
      setDelegationStatus(DelegationsType.DELEGATING)
    } else {
      setDelegationStatus(DelegationsType.NOT_DELEGATING)
    }
    setShouldRefetch(false)
  }, [delegatedTo])

  useEffect(() => {
    let totalVoteWeight = new BigNumber(0)
    delegateVoteBalances?.forEach(delegatedVote => {
      const balance = new BigNumber(delegatedVote.balance)
      totalVoteWeight = totalVoteWeight.plus(balance)
    })
    setVoteWeight(totalVoteWeight)
  }, [delegateVoteBalances])

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
            {!voteWeight || voteWeight.eq(new BigNumber(0)) ? (
              "-"
            ) : (
              <>{`${parseUnits(voteWeight, dao.data.token.decimals).toString()} ${dao.data.token.symbol}`}</>
            )}
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
        <Subtitle variant="body1">
          {isLoading || loadingRes ? (
            <CircularProgress color="secondary" />
          ) : (
            <>
              <Grid container direction="row" alignItems="center" style={{ gap: 8 }}>
                {matchTextToStatus(delegationStatus)}
                {delegationStatus === DelegationsType.NOT_DELEGATING ? null : (
                  <ProfileAvatar size={22} address={delegatedTo ? delegatedTo : ""} />
                )}
                {delegationStatus === DelegationsType.DELEGATING ? delegatedTo : null}
                {delegationStatus === DelegationsType.NOT_DELEGATING ? null : (
                  <CustomCopyButton>
                    <CopyButton text={delegatedTo ? delegatedTo : ""} />
                  </CustomCopyButton>
                )}
              </Grid>
            </>
          )}
        </Subtitle>
      </Grid>
      <DelegationDialog
        open={openModal}
        onClose={onCloseAction}
        status={delegationStatus}
        setDelegationStatus={setDelegationStatus}
        delegationStatus={delegationStatus}
        delegatedTo={delegatedTo}
        setShouldRefetch={setShouldRefetch}
      />
    </DelegationBox>
  )
}
