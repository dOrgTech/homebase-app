import { Button, Grid, Theme, Tooltip, Typography, useMediaQuery } from "@material-ui/core"
import { styled, useTheme } from "@material-ui/styles"
import ReactHtmlParser from "react-html-parser"
import { BigNumber } from "bignumber.js"
import ProgressBar from "react-customizable-progressbar"
import { StatusBadge } from "modules/explorer/components/StatusBadge"
import { UserBadge } from "modules/explorer/components/UserBadge"
import { VotersProgress } from "modules/explorer/components/VotersProgress"
import { useCanDropProposal } from "modules/explorer/hooks/useCanDropProposal"
import React, { useCallback, useMemo, useState } from "react"
import { useParams } from "react-router"
import { useAgoraTopic } from "services/agora/hooks/useTopic"
import { BaseDAO } from "services/contracts/baseDAO"
import { useDropProposal } from "services/contracts/baseDAO/hooks/useDropProposal"
import { parseUnits, toShortAddress } from "services/contracts/utils"
import { useDAO } from "services/indexer/dao/hooks/useDAO"
import { useProposal } from "services/indexer/dao/hooks/useProposal"
import { ContentContainer } from "../../components/ContentContainer"
import { useDAOID } from "../DAO/router"
import { useVotesStats } from "modules/explorer/hooks/useVotesStats"
import { formatNumber } from "modules/explorer/utils/FormatNumber"
import { HighlightedBadge } from "modules/explorer/components/styled/HighlightedBadge"
import { TransferBadge } from "modules/explorer/components/TransferBadge"
import {
  FA2Transfer,
  LambdaProposal,
  Proposal,
  ProposalStatus,
  RegistryProposal,
  TreasuryProposal
} from "services/indexer/dao/mappers/proposal/types"
import { useDAOHoldings } from "services/contracts/baseDAO/hooks/useDAOHoldings"
import { VoteDialog } from "../../components/VoteDialog"
import { XTZTransferBadge } from "../../components/XTZTransferBadge"
import { InfoIcon } from "../../components/styled/InfoIcon"
import { ProposalTransferBadge } from "modules/explorer/components/ProposalTransferBadge"
import { useUnstakeVotes } from "../../../../services/contracts/baseDAO/hooks/useUnstakeVotes"
import { useTezos } from "../../../../services/beacon/hooks/useTezos"
import { CodeVisor } from "./components/CodeVisor"
import { CopyButton } from "modules/common/CopyButton"

const Container = styled(ContentContainer)({
  padding: "36px 45px"
})

const HistoryItem = styled(Grid)(({ theme }: { theme: Theme }) => ({
  marginTop: 20,
  paddingBottom: 12,
  display: "flex",
  height: "auto",

  [theme.breakpoints.down("sm")]: {
    width: "unset"
  }
}))

const QuorumTitle = styled(Typography)(() => ({
  color: "#3866F9"
}))

const ViewCodeButton = styled(Button)({
  height: 31,
  fontSize: 16
})

const ProgressText = styled(Typography)(({ textColor }: { textColor: string }) => ({
  color: textColor,
  display: "flex",
  alignItems: "center",
  position: "absolute",
  width: "100%",
  height: "100%",
  fontSize: 16,
  userSelect: "none",
  boxShadow: "none",
  background: "inherit",
  fontFamily: "Roboto Mono",
  justifyContent: "center",
  top: 0
}))

const DetailsText = styled(Typography)({
  wordBreak: "break-all"
})

const VoteButton = styled(Button)(({ favor }: { favor: boolean }) => ({
  backgroundColor: favor ? "#3FE888" : "#FF486E"
}))

const InfoTitle = styled(Typography)({
  marginTop: 37,
  fontWeight: 400,
  fontSize: 18,
  lineHeigh: "27px"
})

const InfoItem = styled(Typography)({
  marginTop: 11,
  fontWeight: 400,
  fontSize: 16,
  lineHeight: "24px"
})

const InfoCopyIcon = styled(CopyButton)({
  "height": 15,
  "& svg": {
    height: 15
  }
})

const getReadableConfig = (configKey: keyof Proposal["metadata"]["config"]) => {
  switch (configKey) {
    case "frozen_extra_value":
      return "Proposal fee"
    case "slash_scale_value":
      return "Percentage of tokens returned after rejection"

    default:
      return "Unknown Config parameter"
  }
}

export const ProposalDetails: React.FC = () => {
  const { proposalId } = useParams<{
    proposalId: string
  }>()
  const daoId = useDAOID()
  const [openVote, setOpenVote] = useState(false)
  const [openVisor, setOpenVisor] = useState(false)
  const [voteIsSupport, setVoteIsSupport] = useState(false)
  const theme = useTheme<Theme>()
  const { data: proposal } = useProposal(daoId, proposalId)
  const isLambdaProposal = proposal?.type === "lambda"
  const { data: dao, cycleInfo } = useDAO(daoId)
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))
  const { mutate: dropProposal } = useDropProposal()
  const { data: holdings } = useDAOHoldings(daoId)
  const { account } = useTezos()
  const canDropProposal = useCanDropProposal(daoId, proposalId)
  const { data: agoraPost } = useAgoraTopic(Number(proposal?.metadata?.agoraPostId))
  const [code, setCode] = React.useState<string>(`
  const allowances = new MichelsonMap();
  const ledger = new MichelsonMap();
  ledger.set('tz1btkXVkVFWLgXa66sbRJa8eeUSwvQFX4kP', { allowances, balance: '100' });

  const opknownBigMapContract = await tezos.contract.originate({
    code: knownBigMapContract,
    storage: {
      ledger,
      owner: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
      totalSupply: '100',
    },
  }); 
  
  const opknownBigMapContract = await tezos.contract.originate({
    code: knownBigMapContract,
    storage: {
      ledger,
      owner: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
      totalSupply: '100',
    },
  }); 

  const opknownBigMapContract = await tezos.contract.originate({
    code: knownBigMapContract,
    storage: {
      ledger,
      owner: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
      totalSupply: '100',
    },
  }); 

  const opknownBigMapContract = await tezos.contract.originate({
    code: knownBigMapContract,
    storage: {
      ledger,
      owner: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
      totalSupply: '100',
    },
  }); 
}`)

  const quorumThreshold = proposal?.quorumThreshold || new BigNumber(0)
  const { mutate: mutateUnstake } = useUnstakeVotes()

  const getLambdaProposalInfo = useCallback(() => {
    const info = {
      type: "",
      title: "",
      code: ""
    }

    if (!isLambdaProposal) {
      return info
    }

    const lambdaProposal = proposal as LambdaProposal
    if (!!lambdaProposal.metadata.add_handler) {
      info.type = "add_handler"
      info.title = "Add Handler"
      info.code = JSON.stringify(lambdaProposal.metadata.add_handler, null, 2)
    } else if (!!lambdaProposal.metadata.remove_handler) {
      info.type = "remove_handler"
      info.title = "Remove Handler"
      info.code = JSON.stringify(lambdaProposal.metadata.remove_handler, null, 2)
    } else if (!!lambdaProposal.metadata.execute_handler) {
      info.type = "execute_handler"
      info.title = "Execute Handler"
      info.code = JSON.stringify(lambdaProposal.metadata.execute_handler, null, 2)
    }

    return info
  }, [proposal, isLambdaProposal])
  const lambdaProposalInfo = getLambdaProposalInfo()

  const onClickVote = (support: boolean) => {
    setVoteIsSupport(support)
    setOpenVote(true)
  }

  const onCloseVote = () => {
    setOpenVote(false)
  }

  const onDropProposal = useCallback(async () => {
    await dropProposal({
      dao: dao as BaseDAO,
      proposalId
    })
  }, [dao, dropProposal, proposalId])

  const onUnstakeVotes = useCallback(async () => {
    await mutateUnstake({
      dao: dao as BaseDAO,
      proposalId
    })
  }, [dao, mutateUnstake, proposalId])

  const proposalCycle = proposal ? proposal.period : "-"

  const { votesQuorumPercentage } = useVotesStats({
    upVotes: proposal?.upVotes || new BigNumber(0),
    downVotes: proposal?.downVotes || new BigNumber(0),
    quorumThreshold
  })

  const list = useMemo(() => {
    if (!proposal || !(proposal instanceof RegistryProposal)) {
      return []
    }

    return proposal.metadata.list
  }, [proposal])

  const transfers = useMemo(() => {
    if (!holdings || !proposal) {
      return []
    }

    return (proposal as TreasuryProposal | RegistryProposal).metadata.transfers
  }, [holdings, proposal])

  const canVote = cycleInfo && proposal?.getStatus(cycleInfo.currentLevel).status === ProposalStatus.ACTIVE

  const canUnstakeVotes =
    cycleInfo &&
    proposal &&
    account &&
    (proposal.getStatus(cycleInfo.currentLevel).status === ProposalStatus.DROPPED ||
      proposal.getStatus(cycleInfo.currentLevel).status === ProposalStatus.EXECUTED) &&
    proposal.voters.some(({ address }) => address.toLowerCase() === account.toLowerCase())

  const parseReadableConfigValue = (configKey: keyof Proposal["metadata"]["config"], value: BigNumber) => {
    if (dao) {
      switch (configKey) {
        case "frozen_extra_value":
          return parseUnits(value, dao.data.token.decimals).toString()
        case "slash_scale_value":
          return 100 - value.toNumber()

        default:
          return value.toString()
      }
    }
  }

  return (
    <>
      <Grid container direction="column" style={{ gap: 42 }}>
        <Container item>
          <Grid container direction="column" style={{ gap: 18 }}>
            <Grid item container style={{ gap: 21 }}>
              <Grid item>
                <Typography variant="h3" color="textPrimary" align={isMobileSmall ? "center" : "left"}>
                  {agoraPost ? agoraPost.title : `Proposal ${toShortAddress(proposal?.id || "")}`}
                </Typography>
              </Grid>
              <Grid>
                <Button variant="contained" color="secondary" disabled={!canDropProposal} onClick={onDropProposal}>
                  Drop Proposal
                </Button>
                <Tooltip
                  placement="bottom"
                  title="Guardian and proposer may drop proposal at anytime. Anyone may drop proposal if proposal expired"
                >
                  <InfoIcon color="secondary" />
                </Tooltip>
              </Grid>
              <Grid>
                <Button variant="contained" color="secondary" disabled={!canUnstakeVotes} onClick={onUnstakeVotes}>
                  Unstake votes
                </Button>
                <Tooltip
                  placement="bottom"
                  title="Can only unstake if proposal is executed or dropped, and if you have voted and have not called this action on this proposal before"
                >
                  <InfoIcon color="secondary" />
                </Tooltip>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                  {proposal && cycleInfo && (
                    <Grid container style={{ gap: 20 }}>
                      <Grid item>
                        <StatusBadge status={proposal.getStatus(cycleInfo.currentLevel).status} />
                      </Grid>
                      <Grid item>
                        <Typography color="textPrimary" variant="subtitle2">
                          CREATED BY
                        </Typography>
                      </Grid>
                      <Grid item>
                        <UserBadge address={proposal.proposer} short={true} />
                      </Grid>

                      {isLambdaProposal ? (
                        <Grid item>
                          <ViewCodeButton variant="contained" color="secondary" onClick={() => setOpenVisor(true)}>
                            View Code
                          </ViewCodeButton>
                          <CodeVisor
                            open={openVisor}
                            code={lambdaProposalInfo.code}
                            title={lambdaProposalInfo.title}
                            handleClose={() => setOpenVisor(false)}
                          />
                        </Grid>
                      ) : null}
                    </Grid>
                  )}
                </Grid>
                <Grid item>
                  <Grid container style={{ gap: 28 }}>
                    <Grid item>
                      <VoteButton
                        variant="contained"
                        favor={true}
                        onClick={() => onClickVote(true)}
                        disabled={!canVote}
                      >
                        Vote For
                      </VoteButton>
                    </Grid>
                    <Grid item>
                      <VoteButton
                        variant="contained"
                        favor={false}
                        onClick={() => onClickVote(false)}
                        disabled={!canVote}
                      >
                        Vote Against
                      </VoteButton>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
        <Grid item>
          <Grid container style={{ gap: 45 }}>
            <Container item xs={12} md={7}>
              <Grid container direction="column" style={{ gap: 18 }}>
                <Grid item>
                  <Grid container style={{ gap: 18 }}>
                    <Grid item>
                      <Typography color="secondary">Votes</Typography>
                    </Grid>
                    <Grid item>
                      <Typography color="textPrimary">Cycle: {proposalCycle}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <VotersProgress showButton={true} daoId={daoId} proposalId={proposalId} />
                </Grid>
              </Grid>
            </Container>
            <Container item xs>
              <Grid container direction="row" style={{ height: "100%" }} alignItems="center" wrap="nowrap">
                <Grid item>
                  <ProgressBar
                    progress={proposal ? votesQuorumPercentage.toNumber() : 0}
                    radius={50}
                    strokeWidth={7}
                    strokeColor="#3866F9"
                    trackStrokeWidth={4}
                    trackStrokeColor={theme.palette.primary.light}
                  >
                    <div className="indicator">
                      <ProgressText textColor="#3866F9">
                        {proposal ? `${formatNumber(votesQuorumPercentage)}%` : "-"}
                      </ProgressText>
                    </div>
                  </ProgressBar>
                </Grid>
                <Grid item>
                  <Grid
                    container
                    direction="column"
                    alignItems="flex-start"
                    justifyContent="center"
                    wrap="nowrap"
                    style={{ height: "100%" }}
                  >
                    <Grid item>
                      {proposal && (
                        <Tooltip
                          placement="bottom"
                          title={`Amount of ${
                            dao?.data.token.symbol
                          } required to be locked through voting for a proposal to be passed/rejected. ${
                            proposal.upVotes.gte(proposal.downVotes)
                              ? proposal.upVotes.toString()
                              : proposal.downVotes.toString()
                          }/${quorumThreshold} votes.`}
                        >
                          <InfoIcon color="secondary" />
                        </Tooltip>
                      )}
                      <QuorumTitle color="textPrimary">Quorum Threshold:</QuorumTitle>
                    </Grid>
                    <Grid item>
                      <Typography color="textPrimary">{proposal ? quorumThreshold.toString() : "-"}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Container>
          </Grid>
        </Grid>
        <Container item>
          <Grid container direction="column" style={{ gap: 40 }}>
            {agoraPost && (
              <Grid item>
                <Typography color="textPrimary" variant="body1" align={isMobileSmall ? "center" : "left"}>
                  {ReactHtmlParser(agoraPost.post_stream.posts[0].cooked)}
                </Typography>
              </Grid>
            )}

            <Grid item container style={{ gap: 25 }}>
              {proposal ? (
                <>
                  {transfers?.map((transfer, index) => {
                    return (
                      <Grid key={index} item container alignItems="center" direction={isMobileSmall ? "column" : "row"}>
                        {transfer.type === "XTZ" ? (
                          <XTZTransferBadge amount={transfer.amount} address={transfer.beneficiary} />
                        ) : (
                          <TransferBadge
                            amount={transfer.amount}
                            address={transfer.beneficiary}
                            contract={(transfer as FA2Transfer).contractAddress}
                            tokenId={(transfer as FA2Transfer).tokenId}
                          />
                        )}
                      </Grid>
                    )
                  })}
                  {proposal.metadata.config.map(({ key, value }, index) => (
                    <Grid key={index} item container alignItems="center" direction={isMobileSmall ? "column" : "row"}>
                      <HighlightedBadge justifyContent="center" alignItems="center" direction="row" container>
                        <Grid item>
                          <DetailsText variant="body1" color="textPrimary">
                            Change{" "}
                            <Typography variant="body1" color="secondary" display={"inline"}>
                              {getReadableConfig(key as keyof Proposal["metadata"]["config"])}
                            </Typography>{" "}
                            to{" "}
                            <Typography variant="body1" color="secondary" display={"inline"}>
                              {parseReadableConfigValue(key as keyof Proposal["metadata"]["config"], value)}
                            </Typography>
                          </DetailsText>
                        </Grid>
                      </HighlightedBadge>
                    </Grid>
                  ))}
                  {proposal.metadata.update_contract_delegate !== "" && (
                    <ProposalTransferBadge address={proposal.metadata.update_contract_delegate} label="New Delegate" />
                  )}
                  {proposal.metadata.update_guardian !== "" && (
                    <ProposalTransferBadge address={proposal.metadata.update_guardian} label="Update Guardian" />
                  )}
                  {list.map(({ key, value }, index) => (
                    <Grid key={index} item container alignItems="center" direction={isMobileSmall ? "column" : "row"}>
                      <HighlightedBadge justifyContent="center" alignItems="center" direction="row" container>
                        <Grid item>
                          <DetailsText variant="body1" color="textPrimary">
                            Set &quot;{key}&quot; to &quot;{value}&quot;
                          </DetailsText>
                        </Grid>
                      </HighlightedBadge>
                    </Grid>
                  ))}
                </>
              ) : null}
            </Grid>
          </Grid>
        </Container>
        <Grid item>
          <Grid container>
            <Container item md={12} xs={12}>
              {cycleInfo &&
                proposal?.getStatus(cycleInfo.currentLevel).statusHistory.map((item, index) => {
                  return (
                    <HistoryItem
                      container
                      direction="row"
                      key={index}
                      alignItems="baseline"
                      wrap="nowrap"
                      xs={12}
                      style={{ gap: 32 }}
                    >
                      <Grid item>
                        <StatusBadge item status={item.status} />
                      </Grid>
                      <Grid item>
                        <Typography color="textPrimary" variant="subtitle2">
                          {item.timestamp}
                        </Typography>
                      </Grid>
                    </HistoryItem>
                  )
                })}

              {isLambdaProposal ? (
                <>
                  <Grid container direction="column">
                    <Grid item>
                      <InfoTitle color="secondary">Information</InfoTitle>
                    </Grid>
                    <Grid item container direction="row" alignItems="center">
                      <InfoItem color="textPrimary">
                        Contract Address: {"Mock tz1XJcu9baEFdsgtawB7Twas6VxtetwJZcVF "}{" "}
                      </InfoItem>
                      <InfoCopyIcon
                        text="Mock tz1XJcu9baEFdsgtawB7Twas6VxtetwJZcVF"
                        style={{ height: 15, marginLeft: -6 }}
                      />
                    </Grid>
                    <Grid item container direction="row">
                      <InfoItem color="textPrimary">
                        Parameter 1: {"Mock tz1bQgEea45ciBpYdFj4y4P3hNyDM8aMF6WB"}
                      </InfoItem>
                    </Grid>
                    <Grid item container direction="row">
                      <InfoItem color="textPrimary">Parameter 2: {"Mock 1300"}</InfoItem>
                    </Grid>
                    <Grid item container direction="row">
                      <InfoItem color="textPrimary">Type: {lambdaProposalInfo.title}</InfoItem>
                    </Grid>
                  </Grid>
                </>
              ) : null}
            </Container>
          </Grid>
        </Grid>
      </Grid>
      <VoteDialog open={openVote} support={voteIsSupport} onClose={onCloseVote} />
    </>
  )
}
