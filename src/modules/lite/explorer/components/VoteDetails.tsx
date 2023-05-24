/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useMemo, useState } from "react"
import { Grid, LinearProgress, styled, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import { GridContainer } from "modules/common/GridContainer"
import { VotesDialog } from "./VotesDialog"
import { Poll } from "models/Polls"
import { Choice } from "models/Choice"
import {
  calculateChoiceTotal,
  calculateProposalTotal,
  calculateWeight,
  getTotalVoters,
  getTreasuryPercentage,
  getTurnoutValue,
  nFormatter
} from "services/lite/utils"
import { useTezos } from "services/beacon/hooks/useTezos"
import { useCommunityToken } from "../hooks/useCommunityToken"

const Container = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.main,
  borderRadius: 8
}))

const TitleContainer = styled(Grid)(({ theme }) => ({
  paddingTop: 18,
  paddingLeft: 46,
  paddingRight: 46,
  paddingBottom: 18,
  borderBottom: `0.3px solid ${theme.palette.primary.light}`,
  [theme.breakpoints.down("sm")]: {
    padding: "18px 25px"
  }
}))

const LinearContainer = styled(GridContainer)({
  paddingBottom: 0,
  minHeight: 110
})

const LegendContainer = styled(GridContainer)({
  minHeight: 30,
  paddingBottom: 0
})

const GraphicsContainer = styled(Grid)({
  paddingBottom: 25
})

export const VoteDetails: React.FC<{ poll: Poll | undefined; choices: Choice[]; token: any; communityId: any }> = ({
  poll,
  choices,
  token,
  communityId
}) => {
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("xs"))
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [open, setOpen] = React.useState(false)
  const { network } = useTezos()
  const [turnout, setTurnout] = useState(0)
  const [votes, setVotes] = useState<Choice[]>([])
  const tokenData = useCommunityToken(communityId)

  const handleClickOpen = () => {
    setVotes(choices.filter(elem => elem.walletAddresses.length > 0))

    if (!isMobile) {
      setOpen(true)
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  useMemo(async () => {
    if (token && token !== undefined) {
      const value = await getTurnoutValue(network, token, Number(poll?.referenceBlock), getTotalVoters(choices))
      setTurnout(value)
    }
  }, [poll, choices, network, token])

  return (
    <Container container direction="column">
      <TitleContainer item>
        <Typography variant={"body2"} color="textPrimary">
          Results
        </Typography>
      </TitleContainer>
      <GraphicsContainer container>
        {choices &&
          choices.map((choice: Choice, index) => (
            <LinearContainer container direction="column" style={{ gap: 20 }} key={`'option-'${index}`}>
              <Grid item container direction="row" alignItems="center">
                <Grid item xs={12} lg={6} sm={6}>
                  <Typography color="textPrimary" variant="body2">
                    {choice.name}
                  </Typography>
                </Grid>
                <Grid item xs={12} lg={6} sm={6} container justifyContent={isMobileSmall ? "flex-start" : "flex-end"}>
                  {choice && choice.walletAddresses ? (
                    <Typography color="textPrimary" variant="body2">
                      {choice.walletAddresses.length} Voters -{" "}
                      {nFormatter(calculateChoiceTotal(choice.walletAddresses, tokenData?.decimals), 1)}{" "}
                      {tokenData?.symbol}
                    </Typography>
                  ) : null}
                </Grid>
              </Grid>
              <Grid item container direction="row" alignItems="center">
                <Grid item xs={10} lg={11} sm={11}>
                  <LinearProgress
                    style={{ width: "100%", marginRight: "4px" }}
                    color="secondary"
                    value={calculateWeight(
                      poll?.totalSupplyAtReferenceBlock,
                      calculateChoiceTotal(choice.walletAddresses, tokenData?.decimals),
                      tokenData?.decimals
                    )
                      .dp(2, 1)
                      .toNumber()}
                    variant="determinate"
                  />
                </Grid>
                <Grid item xs={2} lg={1} sm={1} container justifyContent="flex-end">
                  <Typography color="textPrimary" variant="body2">
                    {calculateWeight(
                      poll?.totalSupplyAtReferenceBlock,
                      calculateChoiceTotal(choice.walletAddresses, tokenData?.decimals),
                      tokenData?.decimals
                    )
                      .dp(2, 1)
                      .toString()}
                    %
                  </Typography>
                </Grid>
              </Grid>
            </LinearContainer>
          ))}

        <LegendContainer container direction="row">
          <Grid item container direction="row" xs={12} sm={6} md={6} lg={6} style={{ gap: 10 }}>
            <Typography color="secondary" variant="body1" onClick={() => handleClickOpen()}>
              {getTotalVoters(choices)}
            </Typography>
            <Typography color="textPrimary" variant="body1">
              Votes
            </Typography>
            <Typography color="textPrimary" variant="body2">
              ({turnout.toFixed(2)} % Turnout)
            </Typography>
          </Grid>

          <Grid
            item
            container
            direction="row"
            xs={12}
            md={6}
            sm={6}
            lg={6}
            style={{ gap: 10 }}
            justifyContent={isMobileSmall ? "flex-start" : "flex-end"}
          >
            <Typography color="textPrimary" variant="body1">
              {nFormatter(calculateProposalTotal(choices, tokenData?.decimals), 1)}
            </Typography>
            <Typography color="textPrimary" variant="body1">
              {poll?.tokenSymbol}
            </Typography>
            <Typography color="textPrimary" variant="body2">
              (
              {getTreasuryPercentage(
                calculateProposalTotal(choices, tokenData?.decimals),
                poll?.totalSupplyAtReferenceBlock,
                tokenData?.decimals
              )
                .dp(5, 1)
                .toString()}
              % of Total Supply)
            </Typography>
          </Grid>
        </LegendContainer>
        <VotesDialog
          decimals={tokenData?.decimals ? tokenData?.decimals : ""}
          symbol={tokenData?.symbol ? tokenData?.symbol : ""}
          choices={votes}
          open={open}
          handleClose={handleClose}
        />
      </GraphicsContainer>
    </Container>
  )
}
