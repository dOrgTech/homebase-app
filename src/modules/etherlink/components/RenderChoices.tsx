import React from "react"
import { Grid, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import { LinearProgress } from "components/ui/LinearProgress"
import { IEvmOffchainChoice, IEvmProposal } from "../types"
import { LinearContainer } from "./styled"
export const RenderChoices = ({
  mode,
  choices,
  tokenSymbol,
  daoProposalSelected,
  totalVoteCount
}: {
  mode: string
  choices: any[]
  tokenSymbol: string
  daoProposalSelected: IEvmProposal
  totalVoteCount: number
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

  return (
    <>
      {choices.map((choice, idx) => {
        const isFor = choice.name === "For"
        const voteCount = isFor ? daoProposalSelected?.votesFor : daoProposalSelected?.votesAgainst
        const linearProgressValue = totalVoteCount > 0 ? (voteCount / totalVoteCount) * 100 : 0

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
                  {voteCount} Voters - {tokenSymbol}
                </Typography>
              </Grid>
            </Grid>
            <Grid item container direction="row" alignItems="center">
              <Grid item xs={10} lg={11} sm={11}>
                <LinearProgress value={linearProgressValue} variant={isFor ? "success" : "error"} />
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
