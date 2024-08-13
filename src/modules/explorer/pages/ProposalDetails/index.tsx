import _ from "lodash"
import { Button, Grid, Theme, Typography, useMediaQuery, styled, useTheme } from "@material-ui/core"
import ReactHtmlParser from "react-html-parser"
import { BigNumber } from "bignumber.js"
import ProgressBar from "react-customizable-progressbar"
import { StatusBadge, statusColors } from "modules/explorer/components/StatusBadge"
import { UserBadge } from "modules/explorer/components/UserBadge"
import { VotersProgress } from "modules/explorer/components/VotersProgress"
import { useCanDropProposal } from "modules/explorer/hooks/useCanDropProposal"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useParams } from "react-router"
import { useAgoraTopic } from "services/agora/hooks/useTopic"
import { BaseDAO } from "services/contracts/baseDAO"
import { useDropProposal } from "services/contracts/baseDAO/hooks/useDropProposal"
import { parseUnits, toShortAddress } from "services/contracts/utils"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { useProposal } from "services/services/dao/hooks/useProposal"
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
  Transfer
} from "services/services/dao/mappers/proposal/types"
import { useDAOHoldings } from "services/contracts/baseDAO/hooks/useDAOHoldings"
import { VoteDialog } from "../../components/VoteDialog"
import { XTZTransferBadge } from "../../components/XTZTransferBadge"
import { ProposalTransferBadge } from "modules/explorer/components/ProposalTransferBadge"
import { useUnstakeVotes } from "../../../../services/contracts/baseDAO/hooks/useUnstakeVotes"
import { useTezos } from "../../../../services/beacon/hooks/useTezos"
import { ProposalCodeEditorInput } from "modules/explorer/components/ProposalFormInput"
import Prism, { highlight } from "prismjs"
import { CodeCollapse } from "modules/explorer/components/CodeCollapse"
import dayjs from "dayjs"
import ThumbUpIcon from "@mui/icons-material/ThumbUp"
import ThumbDownIcon from "@mui/icons-material/ThumbDown"
import { getStatusDate } from "services/utils/utils"

const TitleText = styled(Typography)({
  fontSize: 36,
  fontWeight: 500,
  lineHeight: 0.9,

  ["@media (max-width:1030px)"]: {
    fontSize: 26
  }
})

const Container = styled(ContentContainer)(({ theme }: { theme: Theme }) => ({
  "padding": "40px 48px 43px 48px",
  "backgroundColor": theme.palette.primary.contrastText,
  "& a": {
    color: "#81feb7",
    textDecoration: "underline"
  },
  [theme.breakpoints.down("sm")]: {
    padding: "30px 38px"
  }
}))

const ContainerTitle = styled(Typography)({
  fontSize: 24,
  fontWeight: 600
})

const HistoryItem = styled(Grid)(({ theme }: { theme: Theme }) => ({
  marginTop: 8,
  paddingBottom: 4,
  display: "flex",
  height: "auto",

  [theme.breakpoints.down("sm")]: {
    width: "unset"
  }
}))

const ProgressText = styled(Typography)(({ textcolor }: { textcolor: string }) => ({
  color: textcolor,
  display: "flex",
  alignItems: "center",
  position: "absolute",
  width: "100%",
  height: "100%",
  fontSize: 16,
  userSelect: "none",
  boxShadow: "none",
  background: "inherit",
  fontFamily: "Roboto Flex",
  justifyContent: "center",
  top: 0
}))

const ValueText = styled(Typography)({
  marginLeft: 8
})

const DetailsText = styled(Typography)({
  wordBreak: "break-all"
})

const VoteButton = styled(Button)(({ favor }: { favor: boolean }) => ({
  backgroundColor: favor ? "#3FE888" : "#FF486E",
  borderRadius: 8
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

const DescriptionText = styled(Typography)(({ theme }: { theme: Theme }) => ({
  color: theme.palette.primary.light,
  fontWeight: 300
}))

const HistoryKey = styled(Typography)({
  fontSize: 18,
  fontWeight: 500,
  textTransform: "capitalize"
})

const HistoryValue = styled(Typography)({
  fontSize: 18,
  fontWeight: 300,
  color: "#BFC5CA"
})

const getReadableConfig = (configKey: any) => {
  switch (configKey) {
    case "frozen_extra_value":
      return "Proposal fee"
    case "slash_scale_value":
      return "Percentage of tokens returned after rejection"

    default:
      return "Unknown Config parameter"
  }
}

const formatConfig = {
  average: true,
  mantissa: 1,
  thousandSeparated: true,
  trimMantissa: true
}

export const ProposalDetails: React.FC = () => {
  const { proposalId } = useParams<{
    proposalId: string
  }>()
  const daoId = useDAOID()
  const [openVote, setOpenVote] = useState(false)
  const [voteIsSupport, setVoteIsSupport] = useState(false)
  const [endDate, setEndDate] = useState("")
  const [historyItems, setHistoryItems] = useState<any>([])
  const theme = useTheme<Theme>()
  const { data: proposal } = useProposal(daoId, proposalId)
  const { data: dao, cycleInfo } = useDAO(daoId)
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))
  const { mutate: dropProposal } = useDropProposal()
  const { data: holdings } = useDAOHoldings(daoId)
  const canDropProposal = useCanDropProposal(daoId, proposalId)
  const { data: agoraPost } = useAgoraTopic(Number(proposal?.metadata?.agoraPostId))
  const { network } = useTezos()
  const status = cycleInfo && proposal ? proposal.getStatus(cycleInfo?.currentLevel).status : ProposalStatus.PENDING

  const quorumThreshold = proposal?.quorumThreshold || new BigNumber(0)
  const { mutate: mutateUnstake } = useUnstakeVotes()

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

  const { votesQuorumPercentage } = useVotesStats({
    upVotes: proposal?.upVotes || new BigNumber(0),
    downVotes: proposal?.downVotes || new BigNumber(0),
    quorumThreshold
  })

  useEffect(() => {
    const findEndDate = async () => {
      if (proposal && cycleInfo) {
        const date = proposal?.getStatus(cycleInfo.currentLevel).statusHistory.filter(item => {
          return item.status === proposal.getStatus(cycleInfo.currentLevel).status
        })
        if (date.length > 0) {
          const timestamp = await getStatusDate(date[0].level, network)
          if (timestamp) {
            const day = dayjs(timestamp).format("LL").toString()
            setEndDate(day)
          }
        }
      }
    }
    findEndDate()
  }, [cycleInfo, proposal, network])

  useEffect(() => {
    const findDate = async () => {
      if (proposal && cycleInfo) {
        const mappedArray = await Promise.all(
          proposal?.getStatus(cycleInfo.currentLevel).statusHistory.map(async p => {
            p.date = await getStatusDate(p.level, network).then(i => i)
            return p
          })
        )
        setHistoryItems(mappedArray)
      }
    }
    findDate()
  }, [cycleInfo, proposal, network])

  const list = useMemo(() => {
    if (!proposal || !(proposal instanceof LambdaProposal)) {
      return []
    }

    return proposal.metadata.list
  }, [proposal])

  const transfers = useMemo(() => {
    if (!holdings || !proposal) {
      return []
    }

    return (proposal as LambdaProposal).metadata.transfers
  }, [holdings, proposal])

  const canVote = cycleInfo && proposal?.getStatus(cycleInfo.currentLevel).status === ProposalStatus.ACTIVE
  const hasNFTs = useMemo(() => {
    let NTFFound = false

    transfers.map((transfer: Transfer) => {
      if (
        transfer.tokenId !== undefined &&
        transfer.type === "FA2" &&
        new BigNumber(transfer.tokenId).toNumber() !== 0
      ) {
        NTFFound = true
      }
    })

    return NTFFound
  }, [transfers])

  const hasToken = useMemo(() => {
    let NTFFound = false

    transfers.map((transfer: Transfer) => {
      if (
        (transfer.tokenId !== undefined &&
          transfer.type === "FA2" &&
          new BigNumber(transfer.tokenId).toNumber() === 0) ||
        transfer.type === "XTZ"
      ) {
        NTFFound = true
      }
    })

    return NTFFound
  }, [transfers])
  // const canUnstakeVotes =
  //   cycleInfo &&
  //   proposal &&
  //   account &&
  //   (proposal.getStatus(cycleInfo.currentLevel).status === ProposalStatus.DROPPED ||
  //     proposal.getStatus(cycleInfo.currentLevel).status === ProposalStatus.EXECUTED) &&
  //   !dao?.data.ledger.find(l => l.holder.address.toLowerCase() === account.toLowerCase())?.staked.isZero()

  const parseReadableConfigValue = (configKey: any, value: BigNumber) => {
    if (dao && value) {
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

  console.log({ proposal })
  const showStatusText =
    statusColors(status).text !== ProposalStatus.ACTIVE || statusColors(status).text !== ProposalStatus.PENDING
  return (
    <>
      <Grid container direction="column" style={{ gap: 42 }}>
        <Grid item container>
          <Grid container direction="column" style={{ gap: 18 }}>
            <Grid item container style={{ gap: 21 }}>
              <Grid item>
                <TitleText variant="h3" color="textPrimary" align={isMobileSmall ? "center" : "left"}>
                  {agoraPost ? agoraPost.title : `Proposal ${toShortAddress(proposal?.id || "")}`}
                </TitleText>
              </Grid>
              <Grid container direction="row">
                <Grid item>
                  <DescriptionText variant="body1">Treasury Proposal • Created by</DescriptionText>
                </Grid>
                <Grid style={{ marginLeft: 8 }}>
                  {proposal && cycleInfo && (
                    <UserBadge
                      textStyle={{ fontWeight: 300, color: theme.palette.primary.light }}
                      address={proposal.proposer}
                      short={true}
                    />
                  )}
                </Grid>
              </Grid>
              {/* <Grid>
                <Button variant="contained" color="secondary" disabled={!canDropProposal} onClick={onDropProposal}>
                  Drop Proposal
                </Button>
                <Tooltip
                  placement="bottom"
                  title="Guardian and proposer may drop proposal at anytime. Anyone may drop proposal if proposal expired"
                >
                  <InfoIcon color="secondary" />
                </Tooltip>
              </Grid> */}
              {/* <Grid>
                <Button variant="contained" color="secondary" disabled={!canUnstakeVotes} onClick={onUnstakeVotes}>
                  Unstake votes
                </Button>
                <Tooltip
                  placement="bottom"
                  title="Can only unstake if proposal is executed or dropped, and if you have voted and have not called this action on this proposal before"
                >
                  <InfoIcon color="secondary" />
                </Tooltip>
              </Grid> */}
            </Grid>
            <Grid item container>
              <Grid
                container
                direction={isMobileSmall ? "column" : "row"}
                justifyContent={isMobileSmall ? "center" : "space-between"}
                alignItems="center"
                style={isMobileSmall ? { gap: 18 } : {}}
              >
                {proposal && cycleInfo && (
                  <Grid
                    item
                    container
                    xs={isMobileSmall ? 12 : 9}
                    justifyContent={isMobileSmall ? "center" : "flex-start"}
                    spacing={2}
                    alignItems="flex-end"
                  >
                    <Grid item>
                      {" "}
                      <StatusBadge status={status} />{" "}
                    </Grid>

                    <Grid item>
                      <DescriptionText>
                        Created {dayjs(proposal.startDate).format("LL")}
                        {showStatusText ? (
                          <>
                            {" "}
                            • {statusColors(status).text} {endDate}
                          </>
                        ) : null}
                      </DescriptionText>
                    </Grid>
                  </Grid>
                )}
                <Grid item xs={isMobileSmall ? 12 : 3}>
                  <Grid container justifyContent="flex-end" style={{ gap: 28 }}>
                    <Grid item>
                      <VoteButton
                        variant="contained"
                        favor={true}
                        onClick={() => onClickVote(true)}
                        disabled={!canVote}
                      >
                        <ThumbUpIcon style={{ marginRight: 8 }} />
                        For
                      </VoteButton>
                    </Grid>
                    <Grid item>
                      <VoteButton
                        variant="contained"
                        favor={false}
                        onClick={() => onClickVote(false)}
                        disabled={!canVote}
                      >
                        <ThumbDownIcon style={{ marginRight: 8 }} />
                        Against
                      </VoteButton>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Transfers */}
        {transfers && transfers.length > 0 && hasToken && (
          <Grid item style={{ width: "inherit" }}>
            <Grid container style={{ gap: 45 }}>
              <Container item xs={12}>
                <Grid container direction="column" style={{ gap: 18 }}>
                  <Grid item>
                    <Grid container style={{ gap: 32 }}>
                      <Grid item>
                        <ContainerTitle color="textPrimary">Token Transfer</ContainerTitle>
                      </Grid>
                    </Grid>
                  </Grid>
                  {transfers.map((transfer, index) => {
                    return (
                      <Grid key={index} item container alignItems="center" direction={isMobileSmall ? "column" : "row"}>
                        {transfer.type === "XTZ" ? (
                          <XTZTransferBadge amount={transfer.amount} address={transfer.beneficiary} />
                        ) : transfer.tokenId && new BigNumber(transfer.tokenId).toNumber() === 0 ? (
                          <TransferBadge
                            amount={transfer.amount}
                            address={transfer.beneficiary}
                            contract={(transfer as FA2Transfer).contractAddress}
                            tokenId={(transfer as FA2Transfer).tokenId}
                          />
                        ) : null}
                      </Grid>
                    )
                  })}{" "}
                </Grid>
              </Container>
            </Grid>
          </Grid>
        )}

        {/* Transfers */}
        {transfers && transfers.length > 0 && hasNFTs && (
          <Grid item style={{ width: "inherit" }}>
            <Grid container style={{ gap: 45 }}>
              <Container item xs={12}>
                <Grid container direction="column" style={{ gap: 18 }}>
                  <Grid item>
                    <Grid container style={{ gap: 32 }}>
                      <Grid item>
                        <ContainerTitle color="textPrimary">NFT Transfer</ContainerTitle>
                      </Grid>
                    </Grid>
                  </Grid>
                  {transfers
                    .filter(transfer => transfer.tokenId && new BigNumber(transfer.tokenId).toNumber() !== 0)
                    .map((transfer, index) => {
                      return (
                        <Grid
                          key={index}
                          item
                          container
                          alignItems="center"
                          direction={isMobileSmall ? "column" : "row"}
                        >
                          <TransferBadge
                            amount={transfer.amount}
                            address={transfer.beneficiary}
                            contract={(transfer as FA2Transfer).contractAddress}
                            tokenId={(transfer as FA2Transfer).tokenId}
                          />
                        </Grid>
                      )
                    })}{" "}
                </Grid>
              </Container>
            </Grid>
          </Grid>
        )}

        {/* VOTES */}
        <Grid item style={{ width: "inherit" }}>
          <Grid container style={{ gap: 45 }}>
            <Container item xs={12}>
              <Grid container direction="column" style={{ gap: 18 }}>
                <Grid item>
                  <Grid container style={{ gap: 18 }}>
                    <Grid item>
                      <ContainerTitle color="textPrimary">Votes</ContainerTitle>
                    </Grid>
                  </Grid>
                </Grid>
                <VotersProgress showButton={true} daoId={daoId} proposalId={proposalId} />
              </Grid>
            </Container>
          </Grid>
        </Grid>

        <Grid item container direction="row" spacing={4}>
          {/* Quorum */}
          <Grid item xs={isMobileSmall ? 12 : 4} container>
            <Container item xs>
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
                    progress={proposal ? votesQuorumPercentage.toNumber() : 0}
                    radius={70}
                    strokeWidth={7}
                    strokeColor="#81FEB7"
                    trackStrokeWidth={4}
                    trackStrokeColor={theme.palette.primary.light}
                  >
                    <div className="indicator">
                      <ProgressText textcolor="#81FEB7">
                        {proposal ? `${formatNumber(votesQuorumPercentage)}%` : "-"}
                      </ProgressText>
                    </div>
                  </ProgressBar>
                </Grid>
              </Grid>
            </Container>
          </Grid>
          {/* History */}
          <Grid item xs={isMobileSmall ? 12 : 8} container>
            <Grid container>
              <Container item md={12} xs={12}>
                <ContainerTitle color="textPrimary" style={{ marginBottom: 24 }}>
                  History
                </ContainerTitle>
                {historyItems.map((item: any, index: number) => {
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
                          {dayjs(item.date).format("LLL")}
                        </HistoryValue>
                      </Grid>
                    </HistoryItem>
                  )
                })}

                {/* {isLambdaProposal ? (
                <>
                  <Grid container direction="column">
                    <Grid item>
                      <InfoTitle color="secondary">Information</InfoTitle>
                    </Grid>
                    <Grid item container direction="row">
                      <InfoItem color="textPrimary">
                        Proposal Type: {_.startCase((proposal as LambdaProposal).metadata.lambdaType)}
                      </InfoItem>
                    </Grid>
                  </Grid>
                </>
              ) : null} */}
              </Container>
            </Grid>
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
                  {(proposal as LambdaProposal).metadata.lambdaType === "execute_handler" && (
                    <Grid item container alignItems="center" direction={isMobileSmall ? "column" : "row"}>
                      <HighlightedBadge justifyContent="center" alignItems="center" direction="row" container>
                        <Grid item container direction="row">
                          <DetailsText variant="body1" color="textPrimary">
                            Execute Function{" "}
                          </DetailsText>
                          <ValueText variant="body1" color="secondary" display={"inline"}>
                            {_.startCase((proposal as LambdaProposal).metadata.lambdaHandler.handler_name)}
                          </ValueText>{" "}
                        </Grid>
                      </HighlightedBadge>
                    </Grid>
                  )}
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
                              {parseReadableConfigValue(key as keyof Proposal["metadata"]["config"], value) ?? 0}
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
                  <CodeCollapse code={JSON.stringify((proposal as LambdaProposal).metadata.lambdaHandler, null, 2)} />
                  {(proposal as LambdaProposal).metadata.lambdaType === "add_handler" && (
                    <>
                      <Grid item container alignItems="center" direction={isMobileSmall ? "column" : "row"}>
                        <HighlightedBadge justifyContent="center" alignItems="center" direction="row" container>
                          <Grid item>
                            <DetailsText variant="body1" color="textPrimary">
                              Add Function{" "}
                              <Typography variant="body1" color="secondary" display={"inline"}>
                                {(proposal as LambdaProposal).metadata.lambdaHandler.name}
                              </Typography>{" "}
                            </DetailsText>
                          </Grid>
                        </HighlightedBadge>
                      </Grid>
                      <ProposalCodeEditorInput
                        label="Lambda Code"
                        containerstyle={{ marginTop: "8px" }}
                        insertSpaces
                        ignoreTabKey={false}
                        tabSize={4}
                        padding={10}
                        style={{
                          minHeight: 500,
                          fontFamily: "Roboto Flex",
                          fontSize: 14,
                          fontWeight: 400,
                          outlineWidth: 0
                        }}
                        value={JSON.stringify((proposal as LambdaProposal).metadata.lambdaHandler, null, 2)}
                        onValueChange={code => true}
                        highlight={code => highlight(code, Prism.languages.javascript, "javascript")}
                        title={_.startCase((proposal as LambdaProposal).metadata.lambdaType)}
                      />
                    </>
                  )}
                  {(proposal as LambdaProposal).metadata.lambdaType === "remove_handler" && (
                    <Grid item container alignItems="center" direction={isMobileSmall ? "column" : "row"}>
                      <HighlightedBadge justifyContent="center" alignItems="center" direction="row" container>
                        <Grid item>
                          <DetailsText variant="body1" color="textPrimary">
                            Remove Function{" "}
                            <Typography variant="body1" color="secondary" display={"inline"}>
                              {_.startCase((proposal as LambdaProposal).metadata.lambdaHandler)}
                            </Typography>{" "}
                          </DetailsText>
                        </Grid>
                      </HighlightedBadge>
                    </Grid>
                  )}
                </>
              ) : null}
            </Grid>
          </Grid>
        </Container>
      </Grid>
      <VoteDialog open={openVote} support={voteIsSupport} onClose={onCloseVote} />
    </>
  )
}
