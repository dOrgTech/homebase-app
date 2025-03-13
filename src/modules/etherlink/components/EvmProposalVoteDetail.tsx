/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useContext, useEffect, useMemo, useState } from "react"
import { Grid, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import ProgressBar from "react-customizable-progressbar"

import { useTezos } from "services/beacon/hooks/useTezos"
import { getTurnoutValue } from "services/utils/utils"
import { useTokenDelegationSupported } from "services/contracts/token/hooks/useTokenDelegationSupported"
import { EtherlinkContext } from "services/wagmi/context"
import { LinearProgress } from "components/ui/LinearProgress"
import { useEvmDaoOps } from "services/contracts/etherlinkDAO/hooks/useEvmDaoOps"
import { EVM_PROPOSAL_CHOICES } from "../config"
import { IEvmOffchainChoice, IEvmProposal, ITransactionStatus } from "../types"
import dayjs from "dayjs"
import {
  ContainerVoteDetail as Container,
  TitleContainer,
  LinearContainer,
  LegendContainer,
  GraphicsContainer,
  ProgressText,
  HistoryItem,
  HistoryValue,
  HistoryKey
} from "./styled"
import { ContainerTitle } from "components/ui/Containers"

const RenderChoices = ({
  mode,
  isMobileSmall,
  choices,
  tokenSymbol,
  daoProposalSelected,
  totalVoteCount
}: {
  mode: string
  isMobileSmall: boolean
  choices: any[]
  tokenSymbol: string
  daoProposalSelected: IEvmProposal
  totalVoteCount: number
}) => {
  if (mode === "offchain") {
    const totalVotees = choices?.reduce((acc, curr) => acc + curr.walletAddresses.length, 0)
    return (
      <>
        {choices.map((choice: IEvmOffchainChoice, idx: number) => {
          const voteCount = choice.walletAddresses.length
          const linearProgressValue = (voteCount / totalVotees) * 100
          const isFor = choice.name === "For"
          const votePercentage = (choice.walletAddresses.length / totalVotees) * 100
          return (
            <LinearContainer container direction="column" style={{ gap: 20 }} key={`'option-'${idx}`}>
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
          <LinearContainer container direction="column" style={{ gap: 20 }} key={`'option-'${idx}`}>
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

export const EvmProposalVoteDetail: React.FC<{
  poll: IEvmProposal
  token: any
}> = ({ poll, token }) => {
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("xs"))
  const choices = poll.type === "offchain" ? poll.choices : EVM_PROPOSAL_CHOICES
  const { network } = useTezos()
  const [turnout, setTurnout] = useState<number | null>()
  const { setShowProposalVoterList } = useEvmDaoOps()
  const { daoSelected } = useContext(EtherlinkContext)

  const daoProposalSelected = poll
  const tokenData = useMemo(
    () => ({
      tokenAddress: daoSelected?.token,
      tokenID: daoSelected?.id,
      symbol: daoSelected?.symbol,
      decimals: daoSelected?.decimals
    }),
    [daoSelected]
  )
  const { data: isTokenDelegationSupported } = useTokenDelegationSupported(tokenData?.tokenAddress)
  const totalVoteCount = daoProposalSelected?.votesFor + daoProposalSelected?.votesAgainst

  const handleClickOpen = () => {
    setShowProposalVoterList(true)
    // setVotes(choices.filter(elem => elem.walletAddresses.length > 0))
  }

  useEffect(() => {
    const fetchTurnout = async () => {
      if (token && tokenData) {
        const value = await getTurnoutValue(
          network,
          tokenData?.tokenAddress,
          tokenData.tokenID,
          Number(poll?.referenceBlock),
          totalVoteCount
        )
        if (value) {
          setTurnout(value)
        }
      }
    }
    fetchTurnout()
  }, [poll, network, token, tokenData, totalVoteCount])

  const votesQuorumPercentage = daoProposalSelected?.votesWeightPercentage
  return (
    <>
      <Container container direction="column" style={{ marginTop: 12, marginBottom: 12 }}>
        {/* Disabled as Data is wrong in Firebase */}
        {/* <TitleContainer item>
        <Typography variant={"body2"} color="textPrimary">
          Voter Turnout
        </Typography>
      </TitleContainer>
      <LinearContainer container direction="column" style={{ gap: 20 }}>
        <Grid item container direction="row" alignItems="center">
          <Grid item xs={12} lg={12} sm={12}>
            <LinearProgress
              style={{ width: "100%", marginRight: "4px", height: "10px" }}
              color="secondary"
              value={50}
              variant="determinate"
            />
          </Grid>
        </Grid>
      </LinearContainer> */}
        <TitleContainer item>
          <Typography variant={"h4"} color="textPrimary">
            Voting Results
          </Typography>
        </TitleContainer>
        <GraphicsContainer container>
          {choices && choices?.length > 0 ? (
            <RenderChoices
              mode={daoProposalSelected.type}
              isMobileSmall={isMobileSmall}
              choices={choices}
              tokenSymbol={tokenData?.symbol}
              daoProposalSelected={daoProposalSelected}
              totalVoteCount={totalVoteCount}
            />
          ) : null}

          <LegendContainer container direction="row">
            <Grid item container direction="row" xs={12} sm={6} md={6} lg={6} style={{ gap: 10 }}>
              <Typography color="secondary" variant="body1" onClick={() => handleClickOpen()}>
                {totalVoteCount}
              </Typography>
              <Typography color="textPrimary" variant="body1" onClick={() => handleClickOpen()}>
                Votes
              </Typography>
              {isTokenDelegationSupported && turnout ? (
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
              alignItems="baseline"
              justifyContent={isMobileSmall ? "flex-start" : "flex-end"}
            >
              {/* <Typography color="textPrimary" variant="body1">
              {numbro(calculateProposalTotal(choices, isXTZ ? 6 : tokenData?.decimals)).format(formatConfig)}
            </Typography>
            <Typography color="textPrimary" variant="body1">
              {isXTZ ? "XTZ" : poll?.tokenSymbol}
            </Typography> */}

              {/* {!poll?.isXTZ && (
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
              {/* {totalVoteCount > 0 ? (
              <DownloadCsvFile
                data={choices}
                pollId={poll?._id}
                symbol={isXTZ ? "XTZ" : tokenData?.symbol ? tokenData?.symbol : ""}
              />
            ) : null} */}
            </Grid>
          </LegendContainer>
        </GraphicsContainer>
      </Container>
      <Container container style={{ marginTop: 60, marginBottom: 12 }}>
        <Grid item container direction="column" spacing={8} style={{ paddingLeft: 12, paddingRight: 12 }}>
          {daoProposalSelected?.type !== "offchain" ? (
            <Grid item container direction="row" spacing={8}>
              {/* Quorum */}

              <Grid item xs={isMobileSmall ? 12 : 4} container>
                <Container item xs style={{ padding: 20 }}>
                  <ContainerTitle color="textPrimary">Quorum</ContainerTitle>
                  <Grid
                    container
                    direction="column"
                    justifyContent={isMobileSmall ? "flex-start" : "center"}
                    style={{ height: "100%" }}
                    alignItems="center"
                    wrap="nowrap"
                  >
                    <Grid item>
                      <ProgressBar
                        progress={votesQuorumPercentage}
                        radius={70}
                        strokeWidth={7}
                        strokeColor="#81FEB7"
                        trackStrokeWidth={4}
                        trackStrokeColor={theme.palette.primary.light}
                      >
                        <div className="indicator">
                          <ProgressText textcolor="#81FEB7">{`${votesQuorumPercentage}%`}</ProgressText>
                        </div>
                      </ProgressBar>
                    </Grid>
                  </Grid>
                </Container>
              </Grid>

              {/* History */}
              <Grid item xs={isMobileSmall ? 12 : 8} container>
                <Grid container>
                  <Container item md={12} xs={12} style={{ padding: "20px" }}>
                    <ContainerTitle color="textPrimary" style={{ marginBottom: 24 }}>
                      History
                    </ContainerTitle>
                    {daoProposalSelected?.statusHistoryMap?.map(
                      (
                        item: {
                          status: ITransactionStatus
                          timestamp: dayjs.Dayjs
                          timestamp_human: string
                        },
                        index: number
                      ) => {
                        return (
                          <HistoryItem
                            item
                            container
                            direction="row"
                            key={index}
                            justifyContent="space-between"
                            alignItems="center"
                            wrap="nowrap"
                            xs={12}
                            style={{ gap: 8 }}
                          >
                            <Grid item xs={5}>
                              <HistoryKey color="textPrimary">{item.status}</HistoryKey>
                            </Grid>
                            <Grid item xs={5}>
                              <HistoryValue align="right" color="textPrimary" variant="subtitle2">
                                {item.timestamp_human}
                              </HistoryValue>
                            </Grid>
                          </HistoryItem>
                        )
                      }
                    )}
                  </Container>
                </Grid>
              </Grid>
            </Grid>
          ) : null}
        </Grid>
      </Container>
    </>
  )
}
