import React, { useContext, useEffect, useState } from "react"
import { Button, Grid, styled, useMediaQuery, useTheme } from "@material-ui/core"
import BackButton from "modules/common/BackButton"
import { ProposalDetailCard } from "../../components/ProposalDetailCard"
import { GridContainer } from "modules/common/GridContainer"
import { ChoiceItemSelected } from "../../components/ChoiceItemSelected"
import { VoteDetails } from "../../components/VoteDetails"
import { useHistory, useLocation, useParams } from "react-router-dom"
import { Poll } from "models/Polls"
import { Choice } from "models/Choice"
import { useTezos } from "services/beacon/hooks/useTezos"
import { getCurrentBlock, getSignature, getUserTotalSupplyAtReferenceBlock } from "services/lite/utils"
import { useNotification } from "modules/common/hooks/useNotification"
import { DashboardContext } from "../../context/ActionSheets/explorer"
import { useHasVoted } from "../../hooks/useHasVoted"
import { usePollChoices } from "../../hooks/usePollChoices"
import { useCommunity } from "../../hooks/useCommunity"
import { useIsMembers } from "../../hooks/useIsMember"
import { useSinglePoll } from "../../hooks/usePoll"
import { ProposalStatus } from "../../components/ProposalTableRowStatusBadge"

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

export const ProposalDetails: React.FC = () => {
  const { id, proposalId } = useParams<{
    id: string
    proposalId: string
  }>()

  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))
  const navigate = useHistory()
  const { state } = useLocation<{ poll: Poll; choices: Choice[] }>()
  const [selectedVote, setSelectedVote] = useState<Choice>()
  const { network, account, wallet } = useTezos()
  const openNotification = useNotification()
  const [refresh, setRefresh] = useState<number>()
  const { hasVoted, vote } = useHasVoted(refresh)
  const community = useCommunity()
  const poll = useSinglePoll(proposalId, id, community)
  const choices = usePollChoices(poll, refresh)
  const isMember = useIsMembers(account, community?.members)

  useEffect(() => {
    choices.map(elem => {
      return (elem.selected = false)
    })
  })

  const saveVote = async () => {
    if (!wallet) {
      return
    }

    const publicKey = (await wallet?.client.getActiveAccount())?.publicKey
    const { signature, payloadBytes } = await getSignature(
      account,
      wallet,
      JSON.stringify({
        address: account,
        choice: selectedVote?.name,
        choiceId: selectedVote?._id
      })
    )
    if (!signature) {
      openNotification({
        message: `Issue with Signature`,
        autoHideDuration: 3000,
        variant: "error"
      })
      return
    }
    await fetch(`${process.env.REACT_APP_API_URL}/update/${selectedVote?._id}/choice`, {
      method: "POST",
      body: JSON.stringify({
        signature,
        publicKey,
        payloadBytes
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(resp => {
        if (resp.ok) {
          openNotification({
            message: "Your vote has been submitted",
            autoHideDuration: 3000,
            variant: "success"
          })
          setRefresh(Math.random())
        } else {
          openNotification({
            message: `Something went wrong!!`,
            autoHideDuration: 3000,
            variant: "error"
          })
          return
        }
      })
      .catch(err => {
        openNotification({
          message: `Something went wrong!!`,
          autoHideDuration: 3000,
          variant: "error"
        })
        return
      })
  }

  return (
    <PageContainer style={{ gap: 30 }}>
      <Grid container>
        <BackButton />
      </Grid>
      <Grid container style={{ gap: 30 }}>
        <Grid item>
          <ProposalDetailCard poll={poll} />
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
                  return <ChoiceItemSelected key={index} choice={choice} setSelectedVote={setSelectedVote} />
                })}
              </Grid>
              {isMember && poll?.isActive === ProposalStatus.ACTIVE ? (
                <Button variant="contained" color="secondary" onClick={() => saveVote()}>
                  Cast your vote
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
