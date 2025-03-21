/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useMemo, useState } from "react"
import { Grid, LinearProgress, styled, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import { GridContainer } from "modules/common/GridContainer"
import { VotesDialog } from "./VotesDialog"
import { Poll } from "models/Polls"
import { Choice } from "models/Choice"
import {
  calculateChoiceTotal,
  calculateProposalTotal,
  calculateWeight,
  calculateWeightXTZ,
  calculateXTZTotal,
  getGroupedVotes,
  getTotalVoters,
  getTreasuryPercentage,
  nFormatter
} from "services/lite/utils"
import numbro from "numbro"
import { useTezos } from "services/beacon/hooks/useTezos"
import { useCommunityToken } from "../hooks/useCommunityToken"
import { getTurnoutValue } from "services/utils/utils"
import { useTokenDelegationSupported } from "services/contracts/token/hooks/useTokenDelegationSupported"
import { DownloadCsvFile } from "./DownloadCsvFile"
import { SmallButton } from "modules/common/SmallButton"

const DescriptionText = styled(Typography)({
  fontSize: 24,
  fontWeight: 600
})

const TotalText = styled(Typography)({
  fontSize: 18,
  fontWeight: 600
})

const TotalValue = styled(Typography)({
  fontSize: 18,
  fontWeight: 300
})

const Container = styled(Grid)(({ theme }) => ({
  background: theme.palette.secondary.light,
  borderRadius: 8
}))

const TitleContainer = styled(Grid)(({ theme }) => ({
  padding: "40px 48px 10px",
  borderRadius: 8,
  marginTop: 20,
  gap: 32,
  [theme.breakpoints.down("sm")]: {
    padding: "18px 25px"
  }
}))

const LinearContainer = styled(GridContainer)({
  paddingBottom: 0,
  minHeight: 70,
  background: "inherit !important"
})

const LegendContainer = styled(GridContainer)({
  minHeight: 30,
  paddingBottom: 0,
  alignItems: "center",
  background: "inherit"
})

const GraphicsContainer = styled(Grid)({
  paddingBottom: 25
})

export const VoteDetails: React.FC<{
  poll: Poll | undefined
  choices: Choice[]
  token: any
  communityId: any
  isXTZ: boolean
}> = ({ poll, choices, token, communityId, isXTZ }) => {
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("xs"))
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [open, setOpen] = React.useState(false)
  const { network } = useTezos()
  const [turnout, setTurnout] = useState<number | null>()
  const [votes, setVotes] = useState<Choice[]>([])
  const tokenData = useCommunityToken(communityId)
  const { data: isTokenDelegationSupported } = useTokenDelegationSupported(tokenData?.tokenAddress)
  const totalXTZ = calculateXTZTotal(choices)
  const groupedVotes = getGroupedVotes(choices)

  const handleClickOpen = () => {
    setVotes(choices.filter(elem => elem.walletAddresses.length > 0))
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const formatConfig = {
    average: true,
    mantissa: 1,
    thousandSeparated: true,
    trimMantissa: true
  }

  useMemo(async () => {
    if (token && tokenData) {
      const value = await getTurnoutValue(
        network,
        tokenData?.tokenAddress,
        tokenData.tokenID,
        Number(poll?.referenceBlock),
        getTotalVoters(choices)
      )
      if (value) {
        setTurnout(value)
      }
    }
  }, [poll, choices, network, token, tokenData])

  return (
    <Container container direction="column">
      <TitleContainer item>
        <DescriptionText color="textPrimary">Votes</DescriptionText>
      </TitleContainer>
      <GraphicsContainer container>
        {choices &&
          choices.map((choice: Choice, index) => {
            const pollWeight = calculateWeight(
              poll?.totalSupplyAtReferenceBlock,
              calculateChoiceTotal(choice.walletAddresses, tokenData?.decimals),
              tokenData?.decimals
            )
              .dp(2, 1)
              .toNumber()

            const pollWeightXtz = calculateWeight(
              poll?.totalSupplyAtReferenceBlock,
              calculateChoiceTotal(choice.walletAddresses, isXTZ ? 6 : tokenData?.decimals),
              isXTZ ? 6 : tokenData?.decimals
            )
              .dp(2, 1)
              .toString()

            const calculatedChoiceTotalCount = numbro(
              calculateChoiceTotal(choice.walletAddresses, isXTZ ? 6 : tokenData?.decimals)
            ).format(formatConfig)

            const tokenSymbol = !isMobile
              ? nFormatter(calculateChoiceTotal(choice.walletAddresses, isXTZ ? 6 : tokenData?.decimals), 1)
              : calculatedChoiceTotalCount

            const linearProgressValue = !poll?.isXTZ ? pollWeight : calculateWeightXTZ(choice, totalXTZ)
            return (
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
                        {choice.walletAddresses.length} Voters - {tokenSymbol} {isXTZ ? "XTZ" : tokenData?.symbol}
                      </Typography>
                    ) : null}
                  </Grid>
                </Grid>
                <Grid item container direction="row" alignItems="center">
                  <Grid item xs={10} lg={11} sm={11}>
                    <LinearProgress
                      style={{ width: "100%", marginRight: "4px" }}
                      color="secondary"
                      value={linearProgressValue}
                      variant="determinate"
                    />
                  </Grid>
                  <Grid item xs={2} lg={1} sm={1} container justifyContent="flex-end">
                    <Typography color="textPrimary" variant="body2">
                      {!poll?.isXTZ ? pollWeightXtz : numbro(calculateWeightXTZ(choice, totalXTZ)).format(formatConfig)}
                      %
                    </Typography>
                  </Grid>
                </Grid>
              </LinearContainer>
            )
          })}

        <LegendContainer container direction="row">
          <Grid item container direction="row" xs={12} sm={6} md={6} lg={6} style={{ gap: 10 }}>
            <TotalText color="textPrimary" variant="body1" onClick={() => handleClickOpen()}>
              Total Votes:
            </TotalText>
            <TotalValue color="textPrimary" variant="body1">
              {numbro(calculateProposalTotal(choices, isXTZ ? 6 : tokenData?.decimals)).format(formatConfig)}
            </TotalValue>
            {isTokenDelegationSupported && turnout && !poll?.isXTZ ? (
              <Typography color="textPrimary" variant="body1">
                ({turnout.toFixed(2)} % Turnout)
              </Typography>
            ) : null}
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
            alignItems="center"
            justifyContent={isMobileSmall ? "flex-start" : "flex-end"}
          >
            {/* <Typography color="textPrimary" variant="body1">
              {isXTZ ? "XTZ" : poll?.tokenSymbol}
            </Typography>
            {!poll?.isXTZ && (
              <Typography color="textPrimary" variant="body1">
                (
                {getTreasuryPercentage(
                  calculateProposalTotal(choices, isXTZ ? 6 : tokenData?.decimals),
                  poll?.totalSupplyAtReferenceBlock,
                  isXTZ ? 6 : tokenData?.decimals
                )
                  .dp(5, 1)
                  .toString()}
                % of Total Supply)
              </Typography>
            )} */}
            {getTotalVoters(choices) > 0 ? (
              <DownloadCsvFile
                data={groupedVotes}
                pollId={poll?._id}
                decimals={tokenData?.decimals ? tokenData?.decimals : ""}
                isXTZ={isXTZ}
                symbol={isXTZ ? "XTZ" : tokenData?.symbol ? tokenData?.symbol : ""}
              />
            ) : null}

            <SmallButton onClick={() => setOpen(true)}> View Votes</SmallButton>
          </Grid>
        </LegendContainer>
        <VotesDialog
          decimals={tokenData?.decimals}
          symbol={isXTZ ? "XTZ" : tokenData?.symbol ? tokenData?.symbol : ""}
          choices={choices}
          groupedVotes={groupedVotes}
          open={open}
          isXTZ={isXTZ}
          handleClose={handleClose}
        />
      </GraphicsContainer>
    </Container>
  )
}
