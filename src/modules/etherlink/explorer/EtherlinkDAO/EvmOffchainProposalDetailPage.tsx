import { GridContainer } from "modules/common/GridContainer"
import {
  Button,
  Grid,
  TableRow,
  TableBody,
  Table,
  Typography,
  useMediaQuery,
  useTheme,
  TableCell,
  IconButton
} from "@mui/material"
import { PageContainer } from "components/ui/DaoCreator"
import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { EtherlinkContext } from "services/wagmi/context"
import { EvmProposalDetailCard } from "modules/etherlink/components/EvmProposalDetailCard"
import { EvmProposalVoteDetail } from "modules/etherlink/components/EvmProposalVoteDetail"
import { EvmProposalCountdown } from "modules/etherlink/components/EvmProposalCountdown"
import { EvmProposalVoterList } from "modules/etherlink/components/EvmProposalVoterList"
import { ThumbDownAlt } from "@mui/icons-material"
import { ThumbUpAlt } from "@mui/icons-material"
import { useNotification } from "modules/common/hooks/useNotification"
import { useEvmProposalOps } from "services/contracts/etherlinkDAO/hooks/useEvmProposalOps"
import { ProposalStatus } from "services/services/dao/mappers/proposal/types"
import { CopyButton } from "modules/common/CopyButton"
import { styled } from "@material-ui/core"
import { EvmChoiceItemSelected } from "../EvmProposals/EvmChoiceItemSelected"
import { IEvmOffchainChoice, IEvmProposal } from "modules/etherlink/types"
import BigNumber from "bignumber.js"
import { SmallButton } from "modules/common/SmallButton"
import React from "react"

const LinearContainer = styled(GridContainer)(({ theme }) => ({
  background: theme.palette.secondary.light,
  borderRadius: 8
}))

const RenderProposalAction = ({ daoProposalSelected }: { daoProposalSelected: IEvmProposal | undefined }) => {
  const { castOffchainVote } = useEvmProposalOps()
  const isVotingActive = daoProposalSelected?.isVotingActive
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
                <EvmChoiceItemSelected
                  key={choice.id}
                  choice={choice}
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
              castOffchainVote(
                selectedOffchainVotes.map(x => {
                  return {
                    choice: x.name,
                    choiceId: x._id,
                    pollID: daoProposalSelected?.id
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
  if (daoProposalSelected?.status === ProposalStatus.PASSED) {
    return (
      <Grid container justifyContent="center">
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
            <Button
              disabled={isCastingVote}
              onClick={() => {
                setIsCastingVote(true)
                castVote(daoProposalSelected?.id, true)
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
              style={{ background: "rgb(113 214 156)" }}
            >
              <ThumbUpAlt sx={{ mr: 1 }} /> Support
            </Button>
            <Button
              onClick={() => {
                setIsCastingVote(true)
                castVote(daoProposalSelected?.id, false)
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
              style={{ background: "red" }}
            >
              <ThumbDownAlt sx={{ mr: 1 }} /> Reject
            </Button>
          </Grid>
        )}
      </>
    )
  }

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
  const { daoSelected, daoProposals, selectDaoProposal } = useContext(EtherlinkContext)

  const theme = useTheme()

  useEffect(() => {
    const proposal = daoProposals?.find((x: IEvmProposal) => x.id === proposalId)
    setDaoProposalSelected(proposal)
  }, [proposalId, daoProposals, daoSelected])

  return (
    <div>
      <PageContainer style={{ gap: 30 }}>
        <Grid container style={{ gap: 30 }}>
          <Grid item>
            <EvmProposalDetailCard poll={daoProposalSelected} />
          </Grid>
        </Grid>
      </PageContainer>

      <PageContainer style={{ gap: 10, color: "white", marginTop: 10, background: "#25282d" }}>
        <Grid item xs={12} md={12} style={{ padding: "40px" }}>
          <RenderProposalAction daoProposalSelected={daoProposalSelected} />
        </Grid>
      </PageContainer>

      {daoProposalSelected?.type ? (
        <EvmProposalVoteDetail poll={daoProposalSelected} token={daoSelected?.token} />
      ) : null}

      <PageContainer style={{ gap: 10, color: "white", padding: 40 }}>
        <Grid container>
          <Typography style={{ color: "white", fontSize: 20, fontWeight: 600 }}>Proposal Data</Typography>
        </Grid>
        <Grid style={{ color: "white", marginTop: 20 }} container>
          {daoProposalSelected?.description}
        </Grid>
      </PageContainer>

      <EvmProposalVoterList />
    </div>
  )
}
