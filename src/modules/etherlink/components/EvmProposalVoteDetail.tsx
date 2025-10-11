/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useContext, useEffect, useMemo, useState } from "react"
import { Grid, Typography, useMediaQuery, useTheme } from "components/ui"

import { useTezos } from "services/beacon/hooks/useTezos"
import { getTurnoutValue } from "services/utils/utils"
import { useTokenDelegationSupported } from "services/contracts/token/hooks/useTokenDelegationSupported"
import { EtherlinkContext } from "services/wagmi/context"
import { useEvmDaoUiOps } from "services/contracts/etherlinkDAO/hooks/useEvmDaoOps"
import { EVM_PROPOSAL_CHOICES } from "../config"
import { IEvmProposal } from "../types"
import { etherlinkStyled as _est } from "components/ui"
const { ContainerVoteDetail: Container, TitleContainer, LegendContainer, GraphicsContainer } = _est
import { RenderChoices } from "./RenderChoices"
import { ProposalHistory } from "./ProposalHistory"

// moved to ./RenderChoices to keep this file focused

export const EvmProposalVoteDetail: React.FC<{
  poll: IEvmProposal
  token: any
}> = ({ poll, token }) => {
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("xs"))
  const choices = poll.type === "offchain" ? poll.choices : EVM_PROPOSAL_CHOICES
  const { network } = useTezos()
  const [turnout, setTurnout] = useState<number | null>()
  const { setShowProposalVoterList } = useEvmDaoUiOps()
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
  try {
    console.log("[EvmProposalVoteDetail] votesQuorumPercentage", {
      id: (daoProposalSelected as any)?.id,
      votesQuorumPercentage
    })
  } catch (_) {}
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
      {daoProposalSelected?.type !== "offchain" ? (
        <ProposalHistory
          votesQuorumPercentage={votesQuorumPercentage}
          statusHistory={daoProposalSelected?.statusHistoryMap}
        />
      ) : null}
    </>
  )
}
