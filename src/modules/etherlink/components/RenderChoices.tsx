import React from "react"
import { Grid, Typography, useMediaQuery, useTheme } from "components/ui"
import { LinearProgress } from "components/ui/LinearProgress"
import { IEvmOffchainChoice, IEvmProposal } from "../types"
import { etherlinkStyled as _est } from "components/ui"
import { formatVotingWeight } from "services/contracts/utils"
const { LinearContainer } = _est
export const RenderChoices = ({
  mode,
  choices,
  tokenSymbol,
  daoProposalSelected,
  totalVoteCount: _totalVoteCount,
  decimals
}: {
  mode: string
  choices: any[]
  tokenSymbol: string
  daoProposalSelected: IEvmProposal
  totalVoteCount: number
  decimals: number
}) => {
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("xs"))

  if (mode === "offchain") {
    const totalVotees = choices?.reduce((acc, curr) => acc + curr.walletAddresses.length, 0)
    return (
      <>
        {choices.map((choice: IEvmOffchainChoice, idx: number) => {
          const voteCount = choice.walletAddresses.length
          const linearProgressValue = totalVotees > 0 ? (voteCount / totalVotees) * 100 : 0
          return (
            <LinearContainer container direction="column" style={{ gap: 20 }} key={`offchain-option-${idx}`}>
              <Grid item container direction="row" alignItems="center">
                <Grid item xs={12} lg={6} sm={6}>
                  <Typography color="textPrimary" variant="body2">
                    {choice.name}
                  </Typography>
                </Grid>
                <Grid item xs={12} lg={6} sm={6} container justifyContent={isMobileSmall ? "flex-start" : "flex-end"}>
                  <Typography color="textPrimary" variant="body2">
                    {voteCount} Voters - {tokenSymbol}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item container direction="row" alignItems="center">
                <Grid item xs={10} lg={11} sm={11}>
                  <LinearProgress value={linearProgressValue} variant="success" />
                </Grid>
                <Grid item xs={2} lg={1} sm={1} container justifyContent="flex-end">
                  <Typography color="textPrimary" variant="body2">
                    {linearProgressValue}%
                  </Typography>
                </Grid>
              </Grid>
            </LinearContainer>
          )
        })}
      </>
    )
  }

  // Calculate total voting weight for percentage calculation
  const totalVotingWeight = BigInt(daoProposalSelected?.inFavor || "0") + BigInt(daoProposalSelected?.against || "0")

  return (
    <>
      {choices.map((choice, idx) => {
        const isFor = choice.name === "For"
        const voteCount = isFor ? daoProposalSelected?.votesFor : daoProposalSelected?.votesAgainst
        const votingWeight = isFor
          ? BigInt(daoProposalSelected?.inFavor || "0")
          : BigInt(daoProposalSelected?.against || "0")

        // Calculate percentage based on voting weight, not voter count
        // Convert to Number before division to preserve decimal precision
        const linearProgressValue =
          totalVotingWeight > 0n ? (Number(votingWeight) / Number(totalVotingWeight)) * 100 : 0

        // Format the voting weight with decimals and abbreviations
        const formattedWeight = formatVotingWeight(votingWeight, decimals)

        return (
          <LinearContainer container direction="column" style={{ gap: 20 }} key={`onchain-option-${idx}`}>
            <Grid item container direction="row" alignItems="center">
              <Grid item xs={12} lg={6} sm={6}>
                <Typography color="textPrimary" variant="body2">
                  {choice.name}
                </Typography>
              </Grid>
              <Grid item xs={12} lg={6} sm={6} container justifyContent={isMobileSmall ? "flex-start" : "flex-end"}>
                <Typography color="textPrimary" variant="body2">
                  {formattedWeight} {tokenSymbol} ({voteCount} {voteCount === 1 ? "Voter" : "Voters"})
                </Typography>
              </Grid>
            </Grid>
            <Grid item container direction="row" alignItems="center">
              <Grid item xs={10} lg={11} sm={11}>
                <LinearProgress value={linearProgressValue} variant={isFor ? "success" : "error"} />
              </Grid>
              <Grid item xs={2} lg={1} sm={1} container justifyContent="flex-end">
                <Typography color="textPrimary" variant="body2">
                  {linearProgressValue.toFixed(2)}%
                </Typography>
              </Grid>
            </Grid>
          </LinearContainer>
        )
      })}
    </>
  )
}
