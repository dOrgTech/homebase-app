import { Button, Grid, Typography, useMediaQuery, useTheme } from "components/ui"
import { ApproveButton, RejectButton } from "modules/etherlink/components/VotingButtons"
import { PageContainer } from "components/ui/DaoCreator"
import { ContentContainer } from "modules/explorer/components/ContentContainer"
import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { EtherlinkContext } from "services/wagmi/context"
import { EvmProposalDetailCard } from "modules/etherlink/components/EvmProposalDetailCard"
import { EvmProposalVoteDetail } from "modules/etherlink/components/EvmProposalVoteDetail"
import { EvmOffchainVoteDetails } from "modules/etherlink/components/EvmOffchainVoteDetails"
import { EvmProposalCountdown } from "modules/etherlink/components/EvmProposalCountdown"
import { EvmProposalVoterList } from "modules/etherlink/components/EvmProposalVoterList"
import { ThumbDownAlt, ThumbUpAlt } from "components/ui"
import { useNotification } from "modules/common/hooks/useNotification"
import { useEvmProposalOps } from "services/contracts/etherlinkDAO/hooks/useEvmProposalOps"
import { ProposalStatus } from "services/services/dao/mappers/proposal/types"

import { EvmChoiceItemSelectedCompat } from "../EvmProposals/EvmChoiceItemSelectedCompat"
import { IEvmOffchainChoice, IEvmProposal } from "modules/etherlink/types"
import { useProposalTimeline } from "services/wagmi/etherlink/hooks/useProposalTimeline"
import { SmallButton } from "modules/common/SmallButton"
import { etherlinkStyled } from "components/ui"
const LinearContainer = etherlinkStyled.LinearContainerOffchain

const RenderProposalAction = ({ daoProposalSelected }: { daoProposalSelected: IEvmProposal | undefined }) => {
  const { castOffchainVote } = useEvmProposalOps()
  const isVotingActive = daoProposalSelected?.isVotingActive
  const isTimerActive = daoProposalSelected?.isTimerActive
  const [isCastingVote, setIsCastingVote] = useState(false)
  const openNotification = useNotification()
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))
  const { castVote, queueForExecution, executeProposal } = useEvmProposalOps()
  const [selectedOffchainVotes, setSelectedOffchainVotes] = useState<IEvmOffchainChoice[]>([])

  if (daoProposalSelected?.type === "offchain" && daoProposalSelected?.status === ProposalStatus.ACTIVE) {
    return (
      <>
        <Grid>
          <EvmProposalCountdown />
        </Grid>

        <Typography style={{ color: "white", fontSize: 20, fontWeight: 500 }}>Options</Typography>
        {isVotingActive && (
          <LinearContainer container style={{ gap: 32 }} direction="row" justifyContent="center">
            <Grid
              container
              item
              justifyContent={isMobileSmall ? "center" : "space-between"}
              direction="row"
              style={{ gap: 30 }}
            >
              {daoProposalSelected?.choices?.map((choice: any) => (
                <EvmChoiceItemSelectedCompat
                  key={String(choice._id || choice.id || choice.name)}
                  choice={choice}
                  allChoices={daoProposalSelected?.choices as any}
                  setSelectedVotes={setSelectedOffchainVotes}
                  votes={selectedOffchainVotes}
                  multiple={false}
                />
              ))}
            </Grid>
          </LinearContainer>
        )}
        <Grid container justifyContent="center">
          <SmallButton
            disabled={selectedOffchainVotes.length === 0}
            variant="contained"
            color="secondary"
            onClick={() => {
              if (!daoProposalSelected?.id) return
              castOffchainVote(
                selectedOffchainVotes.map(x => {
                  return {
                    choice: x.name,
                    choiceId: x._id,
                    pollID: daoProposalSelected.id as string
                  }
                })
              )
            }}
            style={{ marginTop: 20, opacity: selectedOffchainVotes.length === 0 ? 0.5 : 1 }}
          >
            Cast your vote
          </SmallButton>
        </Grid>
      </>
    )
  }
  if (daoProposalSelected?.status === "passed") {
    return (
      <Grid container justifyContent="center">
        <Grid>
          <EvmProposalCountdown />
        </Grid>

        <Button
          variant="contained"
          color="secondary"
          style={{ background: "rgb(113 214 156)" }}
          onClick={() =>
            queueForExecution()
              .then((receipt: any) => {
                console.log("Queue receipt", receipt)
                openNotification({
                  message: "Proposal queued for execution",
                  autoHideDuration: 2000,
                  variant: "success"
                })
              })
              .catch((error: any) => {
                console.log("Queue error", error)
                openNotification({
                  message: "Error queuing proposal",
                  autoHideDuration: 2000,
                  variant: "error"
                })
              })
          }
        >
          Queue for Execution
        </Button>
      </Grid>
    )
  }

  if (daoProposalSelected?.status === ProposalStatus.EXECUTABLE) {
    return (
      <Grid container justifyContent="center">
        <Button
          variant="contained"
          color="secondary"
          style={{ background: "rgb(113 214 156)" }}
          onClick={() => executeProposal()}
        >
          Execute
        </Button>
      </Grid>
    )
  }

  if (daoProposalSelected?.status === ProposalStatus.EXECUTED) {
    return (
      <Grid container justifyContent="center">
        <Button
          variant="contained"
          color="secondary"
          style={{ background: "rgb(113 214 156)" }}
          onClick={() => window.open(`${daoProposalSelected?.txHash}`, "_blank")}
        >
          View on Block Explorer
        </Button>
      </Grid>
    )
  }

  if (daoProposalSelected?.status === ProposalStatus.ACTIVE) {
    return (
      <>
        <Grid>
          <EvmProposalCountdown />
        </Grid>

        {isVotingActive && (
          <Grid container style={{ gap: 10 }} alignItems="center" justifyContent="center">
            <ApproveButton
              disabled={isCastingVote}
              onClick={() => {
                if (!daoProposalSelected?.id) return
                setIsCastingVote(true)
                castVote(daoProposalSelected.id as string, true)
                  .then((receipt: any) => {
                    console.log("Receipt", receipt)
                    openNotification({
                      message: "Vote cast successfully",
                      autoHideDuration: 2000,
                      variant: "success"
                    })
                  })
                  .finally(() => {
                    setIsCastingVote(false)
                  })
              }}
              variant="contained"
              color="secondary"
            >
              <ThumbUpAlt style={{ marginRight: 8 }} /> Support
            </ApproveButton>
            <RejectButton
              onClick={() => {
                if (!daoProposalSelected?.id) return
                setIsCastingVote(true)
                castVote(daoProposalSelected.id as string, false)
                  .then((receipt: any) => {
                    console.log("Receipt", receipt)
                    openNotification({
                      message: "Vote cast successfully",
                      autoHideDuration: 2000,
                      variant: "success"
                    })
                  })
                  .finally(() => {
                    setIsCastingVote(false)
                  })
              }}
              variant="contained"
              color="secondary"
            >
              <ThumbDownAlt style={{ marginRight: 8 }} /> Reject
            </RejectButton>
          </Grid>
        )}
      </>
    )
  }
  if (isTimerActive) return null
  return (
    <Grid>
      <Typography style={{ color: "white" }}>
        Proposal is not active
        <br />
        (No Quorum)
      </Typography>
    </Grid>
  )
}

export const EvmOffchainProposalDetailsPage = () => {
  const params = useParams() as { proposalId: string }
  const proposalId = params?.proposalId
  const [daoProposalSelected, setDaoProposalSelected] = useState<IEvmProposal | undefined>(undefined)
  const { daoSelected, daoProposals } = useContext(EtherlinkContext)

  // const theme = useTheme()

  useEffect(() => {
    const proposal = daoProposals?.find((x: IEvmProposal) => x.id === proposalId)
    setDaoProposalSelected(proposal)
  }, [proposalId, daoProposals, daoSelected])

  const { effectiveDisplayStatus } = useProposalTimeline(daoProposalSelected as any, daoSelected as any)

  return (
    <div>
      <Grid container style={{ gap: 30 }}>
        <Grid item>
          <EvmProposalDetailCard poll={daoProposalSelected} displayStatusOverride={effectiveDisplayStatus} />
        </Grid>
      </Grid>

      <ContentContainer style={{ gap: 10, color: "white", marginTop: 10 }}>
        <Grid item xs={12} md={12} style={{ padding: "40px" }}>
          <RenderProposalAction daoProposalSelected={daoProposalSelected} />
        </Grid>
      </ContentContainer>

      {daoProposalSelected?.type === "offchain" ? (
        <EvmOffchainVoteDetails poll={daoProposalSelected} />
      ) : daoProposalSelected?.type ? (
        <EvmProposalVoteDetail poll={daoProposalSelected} token={daoSelected?.token} />
      ) : null}

      <ContentContainer style={{ gap: 10, color: "white", padding: 40 }}>
        <Grid container>
          <Typography style={{ color: "white", fontSize: 20, fontWeight: 600 }}>Proposal Data</Typography>
        </Grid>
        <Grid style={{ color: "white", marginTop: 20 }} container>
          {daoProposalSelected?.description}
        </Grid>
      </ContentContainer>

      <EvmProposalVoterList />
    </div>
  )
}
