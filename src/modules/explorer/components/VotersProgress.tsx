import React, { useState } from "react"
import { Button, Grid, Paper, styled, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import { formatNumber } from "../utils/FormatNumber"
import { MultiColorBar as CustomBar } from "modules/explorer/components/ProgressBar"
import { useVotesStats } from "../hooks/useVotesStats"
import BigNumber from "bignumber.js"
import { useProposal } from "services/services/dao/hooks/useProposal"
import { Proposal } from "services/services/dao/mappers/proposal/types"
import { VotesDetailDialog } from "./VotesDetailDialog"

interface VotersData {
  showButton: boolean
  daoId: string
  proposalId: string
  wrapAll?: boolean
}

const GreenDot = styled(Paper)(({ theme }) => ({
  width: 9,
  height: 9,
  marginRight: 9,
  background: theme.palette.secondary.main
}))

const RedDot = styled(Paper)(({ theme }) => ({
  width: 9,
  height: 9,
  marginRight: 9,
  background: theme.palette.error.main
}))

const StatusTitle = styled(Typography)({
  fontWeight: "bold",
  marginRight: 12
})

export const VotersProgress: React.FC<VotersData> = ({ showButton, daoId, proposalId, wrapAll }) => {
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))
  const { data: proposalData } = useProposal(daoId, proposalId)
  const proposal = proposalData as Proposal | undefined
  const quorumThreshold = proposal?.quorumThreshold || new BigNumber(0)
  const upVotes = proposal ? proposal.upVotes : new BigNumber(0)
  const downVotes = proposal ? proposal.downVotes : new BigNumber(0)

  const { upVotesQuorumPercentage, downVotesQuorumPercentage, upVotesSumPercentage } = useVotesStats({
    quorumThreshold,
    upVotes,
    downVotes
  })

  return (
    <>
      <Grid item xs={12} container direction="row" alignItems="center" spacing={2}>
        <Grid item xs container direction="row" alignItems="baseline" justifyContent="flex-start">
          <Grid
            item
            md={isMobileSmall || wrapAll ? 12 : true}
            container
            direction="row"
            alignItems="baseline"
            wrap="nowrap"
          >
            <GreenDot />
            <StatusTitle color="textPrimary" variant="subtitle2">
              SUPPORT:{" "}
            </StatusTitle>
            <Typography color="textPrimary" variant="subtitle2">
              {proposal ? upVotes.toString() : "-"} (
              {upVotesQuorumPercentage && upVotesQuorumPercentage.isGreaterThan(100)
                ? 100
                : formatNumber(upVotesQuorumPercentage)}
              %){" "}
            </Typography>
          </Grid>

          <Grid md={isMobileSmall || wrapAll ? 12 : true} container direction="row" alignItems="center" wrap="nowrap">
            <RedDot />
            <StatusTitle color="textPrimary" variant="subtitle2">
              OPPOSE:{" "}
            </StatusTitle>
            <Typography color="textPrimary" variant="subtitle2">
              {proposal ? downVotes.toString() : "-"} (
              {downVotesQuorumPercentage && downVotesQuorumPercentage.isGreaterThan(100)
                ? 100
                : formatNumber(downVotesQuorumPercentage)}
              %){" "}
            </Typography>
          </Grid>
        </Grid>

        {showButton ? (
          <Grid xs={2} container direction="row" alignItems="center" justifyContent="flex-end">
            <Button
              variant={"contained"}
              color={"secondary"}
              size={"small"}
              onClick={() => setOpen(true)}
              // favor={true}
            >
              View
            </Button>
          </Grid>
        ) : null}
      </Grid>
      <Grid item xs={12}>
        <CustomBar variant="determinate" value={upVotesSumPercentage.toNumber()} color="secondary" />
      </Grid>
      <VotesDetailDialog daoAddress={daoId} proposalAddress={proposalId} open={open} onClose={() => setOpen(false)} />
    </>
  )
}
