import React, { useEffect, useState } from "react"
import { Button, Grid, Typography, styled, useMediaQuery, useTheme } from "@material-ui/core"
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
import { BackButton } from "modules/lite/components/BackButton"
import { voteOnLiteProposal } from "services/services/lite/lite-services"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { useTokenVoteWeight } from "services/contracts/token/hooks/useTokenVoteWeight"
import BigNumber from "bignumber.js"
import { ArrowBackIosOutlined } from "@material-ui/icons"
import { EnvKey, getEnv } from "services/config"

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

export const ProposalDetails: React.FC<{ id: string }> = ({ id }) => {
  const { proposalId } = useParams<{
    proposalId: string
  }>()

  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))
  const { state } = useLocation<{ poll: Poll; choices: Choice[]; daoId: string }>()
  const navigate = useHistory()
  const { data: dao } = useDAO(state?.daoId)
  const { account, wallet, network, tezos } = useTezos()
  const openNotification = useNotification()
  const [refresh, setRefresh] = useState<number>()
  const community = useCommunity(id)
  const poll = useSinglePoll(proposalId, id, community)
  const choices = usePollChoices(poll, refresh)
  const { data: voteWeight } = useTokenVoteWeight(
    dao?.data.token.contract || community?.tokenAddress,
    poll?.referenceBlock
  )
  const [selectedVotes, setSelectedVotes] = useState<Choice[]>([])

  useEffect(() => {
    // refetch()
    choices.map(elem => {
      return (elem.selected = false)
    })
  })

  const votesData = selectedVotes.map((vote: Choice) => {
    return {
      address: account,
      choice: vote?.name,
      choiceId: vote?._id,
      pollID: poll?._id
    }
  })

  const saveVote = async () => {
    if (!wallet) {
      return
    }

    try {
      const { signature, payloadBytes } = await getSignature(account, wallet, network, JSON.stringify(votesData), tezos)
      let publicKey
      if (getEnv(EnvKey.REACT_APP_IS_NOT_TESTING) !== "true") {
        publicKey = await tezos.signer.publicKey()
      } else {
        publicKey = (await wallet?.client.getActiveAccount())?.publicKey
      }

      if (!signature) {
        openNotification({
          message: `Issue with Signature`,
          autoHideDuration: 3000,
          variant: "error"
        })
        return
      }
      const resp = await voteOnLiteProposal(signature, publicKey, payloadBytes)
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

  return (
    <PageContainer style={{ gap: 30 }}>
      <Grid container>
        <Grid
          container
          style={{ gap: 15, cursor: "pointer", marginBottom: 23 }}
          onClick={() => navigate.push(`/explorer/lite/dao/${id}/community/`)}
          alignItems="center"
        >
          <ArrowBackIosOutlined color="secondary" />
          <Typography color="secondary">Back to community</Typography>
        </Grid>
      </Grid>
      <Grid container style={{ gap: 30 }}>
        <Grid item>
          <ProposalDetailCard poll={poll} daoId={id} />
        </Grid>
        <Grid container item xs={12}>
          {choices && choices.length > 0 ? (
            <GridContainer container style={{ gap: 32 }} direction="row" justifyContent="center">
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
                <Button
                  disabled={selectedVotes.length === 0 || voteWeight?.eq(new BigNumber(0))}
                  variant="contained"
                  color="secondary"
                  onClick={() => saveVote()}
                >
                  {voteWeight?.gt(new BigNumber(0)) ? "Cast your vote" : "No Voting Weight"}
                </Button>
              ) : null}
            </GridContainer>
          ) : null}
        </Grid>
        <Grid item xs={12}>
          {poll && poll !== undefined ? (
            <VoteDetails poll={poll} choices={choices} token={community?.tokenAddress} communityId={community?._id} />
          ) : null}
        </Grid>
      </Grid>
    </PageContainer>
  )
}
