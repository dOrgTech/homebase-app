import React, { useEffect, useState } from "react"
import { CircularProgress, Grid, Typography, styled, useMediaQuery, useTheme } from "@material-ui/core"
import { ProposalDetailCard } from "../../components/ProposalDetailCard"
import { GridContainer } from "modules/common/GridContainer"
import { ChoiceItemSelected } from "../../components/ChoiceItemSelected"
import { VoteDetails } from "../../components/VoteDetails"
import { useHistory, useLocation, useParams } from "react-router-dom"
import { Poll } from "models/Polls"
import { Choice } from "models/Choice"
import { useTezos } from "services/beacon/hooks/useTezos"
import { getSignature } from "services/lite/utils"
import { useNotification } from "modules/common/hooks/useNotification"
import { usePollChoices } from "../../hooks/usePollChoices"
import { useCommunity } from "../../hooks/useCommunity"
import { useSinglePoll } from "../../hooks/usePoll"
import { ProposalStatus } from "../../components/ProposalTableRowStatusBadge"
import { voteOnLiteProposal } from "services/services/lite/lite-services"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { useTokenVoteWeight } from "services/contracts/token/hooks/useTokenVoteWeight"
import BigNumber from "bignumber.js"
import { ArrowBackIosOutlined } from "@material-ui/icons"
import { useIsMember } from "../../hooks/useIsMember"
import { useHistoryLength } from "modules/explorer/context/HistoryLength"
import { getEthSignature } from "services/utils/utils"

const DescriptionText = styled(Typography)({
  fontSize: 24,
  fontWeight: 600
})

const PageContainer = styled("div")({
  marginBottom: 50,
  width: "1000px",
  height: "100%",
  margin: "auto",
  padding: "28px 0",
  boxSizing: "border-box",
  paddingTop: 0,

  ["@media (max-width: 1425px)"]: {},

  ["@media (max-width:1335px)"]: {},

  ["@media (max-width:1167px)"]: {
    width: "86vw"
  },

  ["@media (max-width:1030px)"]: {},

  ["@media (max-width:960px)"]: {},

  ["@media (max-width:645px)"]: {
    flexDirection: "column"
  }
})

const LinearContainer = styled(GridContainer)(({ theme }) => ({
  background: theme.palette.secondary.light,
  borderRadius: 8
}))

export const ProposalDetails: React.FC<{ id: string }> = ({ id }) => {
  const { proposalId } = useParams<{
    proposalId: string
  }>()

  const theme = useTheme()
  const historyLength = useHistoryLength()

  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))
  const navigate = useHistory()
  const { network, account, wallet, etherlink } = useTezos()
  const openNotification = useNotification()
  const [refresh, setRefresh] = useState<number>()
  const community = useCommunity(id)
  const poll = useSinglePoll(proposalId, id, community)
  const { state, pathname } = useLocation<{ poll: Poll; choices: Choice[]; daoId: string }>()
  const { data: dao } = useDAO(state?.daoId)
  const { data: voteWeight } = useTokenVoteWeight(
    dao?.data.token.contract || community?.tokenAddress,
    poll?.referenceBlock
  )

  console.log({ voteWeight })

  const [votingPower, setVotingPower] = useState(poll?.isXTZ ? voteWeight?.votingXTZWeight : voteWeight?.votingWeight)

  const choices = usePollChoices(poll, refresh)

  const [selectedVotes, setSelectedVotes] = useState<Choice[]>([])
  const isMember = useIsMember(network, community?.tokenAddress || "", account)
  const [isLoading, setIsLoading] = useState(false)

  const navigateToDao = () => {
    if (historyLength > 1) {
      navigate.goBack()
    } else {
      const daoUrl = pathname?.replace(`proposal/${proposalId}`, "")
      navigate.push(daoUrl)
    }
  }

  useEffect(() => {
    // refetch()
    choices.map(elem => {
      return (elem.selected = false)
    })
  })

  useEffect(() => {
    if (poll?.isXTZ) setVotingPower(voteWeight?.votingXTZWeight as BigNumber)
    else setVotingPower(voteWeight?.votingWeight as BigNumber)
  }, [voteWeight, poll, network])

  const votesData = selectedVotes.map((vote: Choice) => {
    return {
      address: etherlink.isConnected ? etherlink.account.address : account,
      choice: vote?.name,
      choiceId: vote?._id,
      pollID: poll?._id
    }
  })

  const saveVote = async () => {
    if (wallet) {
      try {
        const publicKey = (await wallet?.client.getActiveAccount())?.publicKey
        const { signature, payloadBytes } = await getSignature(account, wallet, JSON.stringify(votesData))
        if (!signature) {
          openNotification({
            message: `Issue with Signature`,
            autoHideDuration: 3000,
            variant: "error"
          })
          return
        }
        const resp = await voteOnLiteProposal(signature, publicKey, payloadBytes, network)
        const response = await resp.json()
        if (resp.ok) {
          openNotification({
            message: "Your vote has been submitted",
            autoHideDuration: 3000,
            variant: "success"
          })
          setRefresh(Math.random())
          setSelectedVotes([])
        } else {
          console.log("Error: ", response.message)
          openNotification({
            message: response.message,
            autoHideDuration: 3000,
            variant: "error"
          })
          return
        }
      } catch (error) {
        console.log("error: ", error)
        openNotification({
          message: `Could not submit vote, Please Try Again!`,
          autoHideDuration: 3000,
          variant: "error"
        })
        setIsLoading(false)
        return
      }
    } else if (etherlink.isConnected) {
      try {
        const publicKey = etherlink.account.address
        console.log({ votesData })
        const { signature, payloadBytes } = await getEthSignature(publicKey, JSON.stringify(votesData))
        if (!signature) {
          openNotification({
            message: `Issue with Signature`,
            autoHideDuration: 3000,
            variant: "error"
          })
          return
        }
        const resp = await voteOnLiteProposal(signature, publicKey, payloadBytes, network)
        const response = await resp.json()
        if (resp.ok) {
          openNotification({
            message: "Your vote has been submitted",
            autoHideDuration: 3000,
            variant: "success"
          })
          setRefresh(Math.random())
          setSelectedVotes([])
        } else {
          console.log("Error: ", response.message)
          openNotification({
            message: response.message,
            autoHideDuration: 3000,
            variant: "error"
          })
          return
        }
      } catch (error) {
        console.log("error: ", error)
        openNotification({
          message: `Could not submit vote, Please Try Again!`,
          autoHideDuration: 3000,
          variant: "error"
        })
        return
      }
    }
  }

  return (
    <PageContainer style={{ gap: 30 }}>
      <Grid container>
        <Grid
          container
          style={{ gap: 15, cursor: "pointer", marginBottom: 23 }}
          onClick={() => navigateToDao()}
          alignItems="center"
        >
          <ArrowBackIosOutlined color="secondary" />
          <Typography color="secondary">Back to community</Typography>
        </Grid>
      </Grid>
      <Grid container style={{ gap: 6 }}>
        <Grid item>
          <ProposalDetailCard poll={poll} daoId={id} />
        </Grid>
        <Grid container item xs={12}>
          {choices && choices.length > 0 ? (
            <>
              <LinearContainer container style={{ gap: 32 }} direction="row" justifyContent="center">
                <Grid item xs={12}>
                  <DescriptionText color="textPrimary">Options</DescriptionText>
                </Grid>
                <Grid
                  container
                  item
                  justifyContent={isMobileSmall ? "center" : "space-between"}
                  direction="row"
                  style={{ gap: 30 }}
                >
                  {choices.map((choice, index) => {
                    return (
                      <ChoiceItemSelected
                        multiple={poll?.votingStrategy === 0 ? false : true}
                        key={index}
                        choice={choice}
                        votes={selectedVotes}
                        setSelectedVotes={setSelectedVotes}
                      />
                    )
                  })}
                </Grid>
                {poll?.isActive === ProposalStatus.ACTIVE ? (
                  !isLoading ? (
                    <SmallButton
                      disabled={
                        (selectedVotes.length === 0 || (votingPower && votingPower.eq(new BigNumber(0)))) && isMember
                      }
                      variant="contained"
                      color="secondary"
                      onClick={() => saveVote()}
                      style={{ marginTop: 20 }}
                    >
                      {votingPower && votingPower.gt(new BigNumber(0)) ? "Cast your vote" : "No Voting Weight"}
                    </SmallButton>
                  ) : (
                    <CircularProgress color="secondary" />
                  )
                ) : null}
              </LinearContainer>
            </>
          ) : null}
        </Grid>
        <Grid item xs={12} style={{ marginTop: 24 }}>
          {poll && poll !== undefined ? (
            <VoteDetails
              isXTZ={poll.isXTZ}
              poll={poll}
              choices={choices}
              token={community?.tokenAddress}
              communityId={community?._id}
            />
          ) : null}
        </Grid>
      </Grid>
    </PageContainer>
  )
}
