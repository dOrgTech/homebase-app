/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useState } from "react"
import { Box, CircularProgress, Grid, Theme, Typography, styled, withStyles } from "@material-ui/core"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { Edit } from "@material-ui/icons"
import { DelegationDialog } from "./DelegationModal"
import { useDelegationStatus } from "services/contracts/token/hooks/useDelegationStatus"
import { useTezos } from "services/beacon/hooks/useTezos"
import { useTokenVoteWeight } from "services/contracts/token/hooks/useTokenVoteWeight"
import BigNumber from "bignumber.js"
import { parseUnits, toShortAddress } from "services/contracts/utils"
import { ProfileAvatar } from "modules/explorer/components/styled/ProfileAvatar"
import { CopyButton } from "modules/common/CopyButton"

export enum DelegationsType {
  NOT_DELEGATING = "NOT_DELEGATING",
  DELEGATING = "DELEGATING"
}

const DelegationBox = styled(Grid)(({ theme }: { theme: Theme }) => ({
  minHeight: "178px",
  boxSizing: "border-box",
  borderRadius: 8,
  boxShadow: "none",
  gap: 32
}))

const Subtitle = styled(Typography)({
  fontWeight: 300,
  color: "#bfc5ca",
  fontSize: 18
})

const Balance = styled(Typography)({
  fontSize: 32,
  fontWeight: 300
})

const CustomCopyButton = withStyles({
  root: {
    "& .MuiBox-root": {
      padding: "0px !important"
    }
  }
})(Grid)

const OffChainBox = styled(Grid)(({ theme }) => ({
  display: "flex",
  padding: "36px 48px 33px 48px",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start",
  gap: 24,
  flexShrink: 0,
  borderRadius: 8,
  background: theme.palette.primary.main
}))

const DelegationText = styled(Grid)({
  fontSize: 24,
  fontWeight: 300,
  color: "#fff"
})

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
  const { account } = useTezos()

  const { data: delegatedTo, isLoading, refetch } = useDelegationStatus(dao?.data.token.contract)
  const [delegationStatus, setDelegationStatus] = useState<DelegationsType>(DelegationsType.NOT_DELEGATING)
  const [openModal, setOpenModal] = useState(false)
  const { data: voteWeight } = useTokenVoteWeight(dao?.data.token.contract)
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

  return (
    <DelegationBox container direction="row">
      <Grid container style={{ gap: 12 }} direction="column">
        <Typography variant="h4" color="textPrimary">
          Off-chain Delegation
        </Typography>
        <Subtitle>These settings only affect your participation in off-chain polls</Subtitle>
      </Grid>
      <Grid container direction="row" justifyContent="space-between">
        {dao && voteWeight && (
          <OffChainBox
            style={{ gap: 12, flexBasis: "32%", maxWidth: "32%" }}
            container
            item
            md={4}
            xs={4}
            direction="column"
          >
            <Typography color="textPrimary">Voting Weight</Typography>
            <Balance color="textPrimary">
              {!voteWeight || voteWeight.votingWeight.eq(new BigNumber(0)) ? (
                "-"
              ) : (
                <>{`${parseUnits(voteWeight.votingWeight, dao.data.token.decimals).toString()} ${
                  dao.data.token.symbol
                }`}</>
              )}
            </Balance>
          </OffChainBox>
        )}
        <OffChainBox container item md={7} xs style={{ gap: 12, flexBasis: "66%", maxWidth: "66%" }} direction="column">
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
                Change Status
              </Typography>
            </Grid>
          </Grid>
          <Subtitle variant="body1">
            {isLoading || loadingRes ? (
              <CircularProgress color="secondary" />
            ) : (
              <>
                <DelegationText container direction="row" alignItems="center" style={{ gap: 8 }}>
                  {matchTextToStatus(delegationStatus)}
                  {delegationStatus === DelegationsType.NOT_DELEGATING ? null : (
                    <ProfileAvatar size={22} address={delegatedTo ? toShortAddress(delegatedTo) : ""} />
                  )}
                  {delegationStatus === DelegationsType.DELEGATING ? delegatedTo : null}
                  {delegationStatus === DelegationsType.NOT_DELEGATING ? null : (
                    <CustomCopyButton>
                      <CopyButton text={delegatedTo ? delegatedTo : ""} />
                    </CustomCopyButton>
                  )}
                </DelegationText>
              </>
            )}
          </Subtitle>
        </OffChainBox>
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
