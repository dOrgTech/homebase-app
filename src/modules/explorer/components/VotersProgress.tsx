import React, { useState } from "react"
import { Grid, styled, Theme, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import { MultiColorBar as CustomBar, ProgressBar } from "modules/explorer/components/ProgressBar"
import { useVotesStats } from "../hooks/useVotesStats"
import BigNumber from "bignumber.js"
import { useProposal } from "services/services/dao/hooks/useProposal"
import { Proposal } from "services/services/dao/mappers/proposal/types"
import { VotesDetailDialog } from "./VotesDetailDialog"
import numbro from "numbro"
import { SmallButton } from "modules/common/SmallButton"
import { ReactComponent as DownloadCSVIcon } from "assets/img/download_csv.svg"
import { mkConfig, generateCsv, download, asString } from "export-to-csv"
import { writeFile } from "node:fs"

interface VotersData {
  showButton: boolean
  daoId: string
  proposalId: string
  wrapAll?: boolean
}

const StatusTitle = styled(Typography)({
  fontWeight: 500,
  fontSize: 18
})

const PercentageValue = styled(Typography)(({ theme }: { theme: Theme }) => ({
  fontWeight: 300,
  [theme.breakpoints.down("sm")]: {
    marginTop: 8
  }
}))

const formatConfig = {
  average: true,
  mantissa: 2,
  thousandSeparated: true,
  trimMantissa: true
}

export const VotersProgress: React.FC<VotersData> = ({ showButton, daoId, proposalId, wrapAll }) => {
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))
  const { data: proposalData } = useProposal(daoId, proposalId)
  const proposal = proposalData as Proposal | undefined
  const quorumThreshold = proposal?.quorumThreshold || new BigNumber(0)
  const upVotes = proposal ? proposal.upVotes : new BigNumber(0)
  const downVotes = proposal ? proposal.downVotes : new BigNumber(0)

  const { upVotesQuorumPercentage, downVotesQuorumPercentage, upVotesSumPercentage, downVotesSumPercentage } =
    useVotesStats({
      quorumThreshold,
      upVotes,
      downVotes
    })

  const downloadCvs = () => {
    const csvConfig = mkConfig({
      useKeysAsHeaders: true,
      filename: `proposal-${proposal?.startDate}`,
      title: "Voting Details",
      showTitle: false
    })
    const votesData = proposal ? proposal?.voters : []
    const csv = generateCsv(csvConfig)(votesData)
    download(csvConfig)(csv)
  }

  return (
    <>
      <Grid item xs={12} container direction="row" alignItems="center" spacing={2}>
        <Grid
          item
          xs
          container
          direction="column"
          alignItems="baseline"
          justifyContent="flex-start"
          style={{ gap: 32 }}
        >
          <Grid item container>
            <Grid item container direction="row" alignItems="baseline" wrap="nowrap">
              <StatusTitle color="textPrimary" variant="subtitle2">
                For
              </StatusTitle>
            </Grid>
            <Grid item container direction="row" justifyContent="space-between">
              <Grid item xs={isMobileSmall ? 12 : 10}>
                <ProgressBar
                  favor={true}
                  variant="determinate"
                  value={upVotesSumPercentage.toNumber()}
                  color="secondary"
                />
              </Grid>
              <Grid item xs={isMobileSmall ? 12 : 2}>
                <PercentageValue color="textPrimary" align="right">
                  {proposal ? numbro(upVotes).format(formatConfig) : "-"} (
                  {upVotesQuorumPercentage && upVotesQuorumPercentage.isGreaterThan(100)
                    ? 100
                    : numbro(upVotesQuorumPercentage).format(formatConfig)}
                  %){" "}
                </PercentageValue>
              </Grid>
            </Grid>
          </Grid>
          <Grid item container>
            <Grid container direction="row" alignItems="center" wrap="nowrap">
              <StatusTitle color="textPrimary" variant="subtitle2">
                Against
              </StatusTitle>
            </Grid>
            <Grid item container direction="row">
              <Grid item xs={isMobileSmall ? 12 : 10}>
                <ProgressBar
                  favor={false}
                  variant="determinate"
                  value={downVotesSumPercentage.toNumber()}
                  color="secondary"
                />
              </Grid>
              <Grid item xs={isMobileSmall ? 12 : 2}>
                <PercentageValue color="textPrimary" align="right">
                  {proposal ? numbro(downVotes).format(formatConfig) : "-"} (
                  {downVotesQuorumPercentage && downVotesQuorumPercentage.isGreaterThan(100)
                    ? 100
                    : numbro(downVotesQuorumPercentage).format(formatConfig)}
                  %){" "}
                </PercentageValue>
              </Grid>
            </Grid>
          </Grid>
          {showButton ? (
            <Grid container direction="row" alignItems="center" justifyContent="flex-end">
              <Grid
                xs={isMobileSmall ? 6 : 2}
                item
                container
                alignItems="center"
                justifyContent={isMobileSmall ? "flex-start" : "flex-end"}
                style={{ cursor: "pointer" }}
              >
                <DownloadCSVIcon style={{ marginRight: 8 }} />
                <Typography color="secondary" onClick={downloadCvs}>
                  {" "}
                  Download CSV
                </Typography>
              </Grid>
              <Grid item xs={isMobileSmall ? 6 : 2} container justifyContent="flex-end">
                <SmallButton onClick={() => setOpen(true)}>View Votes</SmallButton>
              </Grid>
            </Grid>
          ) : null}
        </Grid>
      </Grid>
      <VotesDetailDialog daoAddress={daoId} proposalAddress={proposalId} open={open} onClose={() => setOpen(false)} />
    </>
  )
}
