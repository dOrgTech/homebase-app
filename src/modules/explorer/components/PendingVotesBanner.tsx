import React, { useMemo } from "react"
import { Grid, styled, Typography } from "@mui/material"
import HowToVoteIcon from "@mui/icons-material/HowToVote"
import { useHistory } from "react-router-dom"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { useProposals } from "services/services/dao/hooks/useProposals"
import { ProposalStatus } from "services/services/dao/mappers/proposal/types"
import { useTezos } from "services/beacon/hooks/useTezos"
import { useDAOID } from "../pages/DAO/router"
import { ContentContainer } from "./ContentContainer"

const BannerContainer = styled(ContentContainer)(({ theme }) => ({
  "padding": "18px 38px",
  "cursor": "pointer",
  "border": `1px solid ${theme.palette.secondary.main}`,
  "&:hover": {
    opacity: 0.9
  },
  [theme.breakpoints.down("lg")]: {
    width: "inherit"
  }
}))

const BannerText = styled(Typography)({
  fontSize: 16,
  fontWeight: 500
})

const BannerHint = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  fontWeight: 300,
  color: theme.palette.primary.light
}))

/**
 * Nudges a governance-token holder towards proposals that are open for voting
 * and that they have not voted on yet.
 */
export const PendingVotesBanner: React.FC = () => {
  const daoId = useDAOID()
  const navigate = useHistory()
  const { account } = useTezos()
  const { data: dao, cycleInfo, ledger } = useDAO(daoId)
  const { data: proposals } = useProposals(daoId)

  // Only nudge people who actually have a stake in this DAO.
  const isTokenHolder = useMemo(() => {
    if (!account || !ledger) {
      return false
    }

    return ledger.some(
      entry => entry.holder.address.toLowerCase() === account.toLowerCase() && entry.total_balance.gt(0)
    )
  }, [account, ledger])

  const pendingProposals = useMemo(() => {
    if (!proposals || !cycleInfo || !account) {
      return []
    }

    return proposals.filter(proposal => {
      const status = proposal.getStatus(cycleInfo.currentLevel).status
      if (status !== ProposalStatus.ACTIVE) {
        return false
      }

      return !proposal.voters.some(
        (voter: { address: string }) => voter.address.toLowerCase() === account.toLowerCase()
      )
    })
  }, [proposals, cycleInfo, account])

  // The DAO alternates proposing/voting periods of `period` blocks. Only show a
  // countdown when we have both the blocks left and an average block time.
  const closesIn = useMemo(() => {
    if (!cycleInfo || cycleInfo.type !== "voting" || !cycleInfo.timeEstimateForNextBlock) {
      return undefined
    }

    const secondsLeft = cycleInfo.blocksLeft * cycleInfo.timeEstimateForNextBlock
    if (!Number.isFinite(secondsLeft) || secondsLeft <= 0) {
      return undefined
    }

    const hoursLeft = Math.round(secondsLeft / 3600)
    if (hoursLeft < 1) {
      return `${Math.max(1, Math.round(secondsLeft / 60))} minutes`
    }

    return `${hoursLeft} ${hoursLeft === 1 ? "hour" : "hours"}`
  }, [cycleInfo])

  if (!dao || !isTokenHolder || pendingProposals.length === 0) {
    return null
  }

  return (
    <BannerContainer item onClick={() => navigate.push(`/explorer/dao/${daoId}/proposals`)}>
      <Grid container direction="row" alignItems="center" style={{ gap: 14 }}>
        <HowToVoteIcon color="secondary" />
        <Grid item>
          <BannerText color="textPrimary">
            {pendingProposals.length} {pendingProposals.length === 1 ? "proposal is" : "proposals are"} waiting for your
            vote
          </BannerText>
          {closesIn ? <BannerHint>Voting closes in {closesIn}</BannerHint> : null}
        </Grid>
      </Grid>
    </BannerContainer>
  )
}
