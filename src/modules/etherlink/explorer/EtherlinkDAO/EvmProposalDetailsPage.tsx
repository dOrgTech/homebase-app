import { GridContainer } from "modules/common/GridContainer"
import { Button, Grid, TableRow, TableBody, Table, Typography, useMediaQuery, useTheme, TableCell } from "@mui/material"
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

const RenderProposalAction = () => {
  const { daoProposalSelected } = useContext(EtherlinkContext)
  const [isCastingVote, setIsCastingVote] = useState(false)
  const openNotification = useNotification()
  const { castVote, queueForExecution, executeProposal } = useEvmProposalOps()

  if (daoProposalSelected?.status === ProposalStatus.PASSED) {
    return (
      <Grid container justifyContent="center">
        <Button
          variant="contained"
          color="secondary"
          style={{ background: "rgb(113 214 156)" }}
          onClick={() =>
            queueForExecution()
              .then((receipt: any) => console.log("Queue receipt", receipt))
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

export const EvmProposalDetailsPage = () => {
  const params = useParams() as { proposalId: string }
  const proposalId = params?.proposalId

  const { daoSelected, daoProposalSelected, selectDaoProposal } = useContext(EtherlinkContext)

  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))

  useEffect(() => {
    selectDaoProposal(proposalId)
  }, [proposalId, selectDaoProposal])

  return (
    <div>
      <PageContainer style={{ gap: 30 }}>
        <Grid container style={{ gap: 30 }}>
          <Grid item>
            <EvmProposalDetailCard poll={daoProposalSelected} />
          </Grid>
        </Grid>
      </PageContainer>

      <PageContainer style={{ gap: 10, color: "white", marginTop: 10 }}>
        <Grid item xs={12} md={12} style={{ padding: "40px" }}>
          <RenderProposalAction />
        </Grid>
      </PageContainer>

      <EvmProposalVoteDetail poll={daoProposalSelected} token={daoSelected?.token} />

      <PageContainer style={{ gap: 10, color: "white", padding: 40 }}>
        <Grid container>
          <Typography style={{ color: "white", fontSize: 20, fontWeight: 600 }}>Proposal Data</Typography>
        </Grid>
        <Grid container>
          {daoProposalSelected?.proposalData?.map(
            ({ parameter, value }: { parameter: string; value: string }, idx: number) => {
              return (
                <Grid key={idx}>
                  <Table
                    aria-label="simple table"
                    style={{ background: "#222222", borderRadius: 8, border: "1px solid #555555", marginTop: "20px" }}
                  >
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Typography style={{ color: "white" }}>Parameter</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography style={{ color: "white" }}>{parameter}</Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography style={{ color: "white" }}>Value</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography style={{ color: "white" }}>{value}</Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>
              )
            }
          )}
        </Grid>
      </PageContainer>

      <EvmProposalVoterList />
    </div>
  )
}

const UnusedBlock = ({ choices, isMobileSmall }: { choices: any; isMobileSmall: boolean }) => (
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
          {/* {[choices].map((choice, index) => {
          return (
            <ChoiceItemSelected
              multiple={false}
              key={index}
              choice={choice}
              votes={[]}
              setSelectedVotes={() => {}}
            />
          )
        })} */}
        </Grid>
        {/* {poll?.isActive === ProposalStatus.ACTIVE ? (
        <Button
          disabled={
            (selectedVotes.length === 0 || (votingPower && votingPower.eq(new BigNumber(0)))) && isMember
          }
          variant="contained"
          color="secondary"
          onClick={() => saveVote()}
        >
          {votingPower && votingPower.gt(new BigNumber(0)) ? "Cast your vote" : "No Voting Weight"}
        </Button>
      ) : null} */}
      </GridContainer>
    ) : null}
  </Grid>
)
