import { Button, Grid, TableRow, TableBody, Table, Typography, TableCell, IconButton } from "components/ui"
import { PageContainer } from "components/ui/DaoCreator"
import { ContentContainer } from "modules/explorer/components/ContentContainer"
import { useContext, useEffect, useState } from "react"
import dayjs from "dayjs"
import { useParams } from "react-router-dom"
import { EtherlinkContext } from "services/wagmi/context"
import { EvmProposalDetailCard } from "modules/etherlink/components/EvmProposalDetailCard"
import { EvmProposalVoteDetail } from "modules/etherlink/components/EvmProposalVoteDetail"
import { EvmProposalCountdown } from "modules/etherlink/components/EvmProposalCountdown"
import { useProposalTimeline } from "services/wagmi/etherlink/hooks/useProposalTimeline"
import { EvmProposalVoterList } from "modules/etherlink/components/EvmProposalVoterList"
import { ThumbDownAlt, ThumbUpAlt } from "components/ui"
import { useNotification } from "modules/common/hooks/useNotification"
import { useEvmProposalOps } from "services/contracts/etherlinkDAO/hooks/useEvmProposalOps"
import { useProposalUiOverride } from "services/wagmi/etherlink/hooks/useProposalUiOverride"
import { CopyButton } from "modules/common/CopyButton"
import { useTezos } from "services/beacon/hooks/useTezos"
import { dbg } from "utils/debug"

const RenderProposalAction = () => {
  const [isDeploying, setIsDeploying] = useState(false)
  const { daoProposalSelected, daoProposalVoters } = useContext(EtherlinkContext)
  const { etherlink } = useTezos()

  const [isCastingVote, setIsCastingVote] = useState(false)
  const openNotification = useNotification()
  const { castVote, queueForExecution, executeProposal } = useEvmProposalOps()
  const isTimerActive = daoProposalSelected?.isTimerActive

  const hasUserCastedVote = daoProposalVoters?.find((voter: any) => voter.voter === etherlink?.signer?.address)

  // Optimistic override: hide queue button immediately after success
  const override = useProposalUiOverride(s => s.overrides[daoProposalSelected?.id || ""]) as any
  const effectiveStatus = (override?.status as string) || daoProposalSelected?.status
  const effectiveDisplayStatus = ((): string | undefined => {
    if (!daoProposalSelected) return undefined
    if (override?.status === "queued") return "Queued"
    if (override?.status === "executed") return "Executed"
    return daoProposalSelected?.displayStatus
  })()

  if (daoProposalSelected?.readyToQueue) {
    //Show Queue for Execution Button
    return (
      <Grid container justifyContent="center">
        <Button
          variant="contained"
          color="secondary"
          disabled={isDeploying}
          style={{ background: "rgb(113 214 156)" }}
          onClick={() => {
            setIsDeploying(true)
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
              .finally(() => {
                setIsDeploying(false)
              })
          }}
        >
          {isDeploying ? "Queuing..." : "Queue for Execution"}
        </Button>
      </Grid>
    )
  }

  if (effectiveDisplayStatus === "Executable") {
    // Show Execute Button
    return (
      <Grid container justifyContent="center">
        <Button
          variant="contained"
          color="secondary"
          disabled={isDeploying}
          style={{ background: "rgb(113 214 156)" }}
          onClick={() => {
            setIsDeploying(true)
            executeProposal()
              .then((receipt: any) => {
                console.log("Execute receipt", receipt)
                openNotification({
                  message: "Proposal executed successfully",
                  autoHideDuration: 2000,
                  variant: "success"
                })
              })
              .catch((error: any) => {
                console.log("Execute error", error)
                openNotification({
                  message: "Error executing proposal",
                  autoHideDuration: 2000,
                  variant: "error"
                })
              })
              .finally(() => {
                setIsDeploying(false)
              })
          }}
        >
          {isDeploying ? "Executing..." : "Execute"}
        </Button>
      </Grid>
    )
  }

  if (effectiveDisplayStatus === "Executed") {
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

  if (effectiveDisplayStatus === "Active" || effectiveDisplayStatus === "Succeeded") {
    return (
      <>
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
            <ThumbUpAlt style={{ marginRight: 8 }} /> Support
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
            <ThumbDownAlt style={{ marginRight: 8 }} /> Reject
          </Button>
        </Grid>
        {hasUserCastedVote ? (
          <Grid container justifyContent="center" style={{ marginTop: 10 }}>
            <Typography style={{ color: "white" }}>You have already voted</Typography>
          </Grid>
        ) : null}
      </>
    )
  }
  if (isTimerActive || effectiveDisplayStatus === "Queued") return null

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

  const { daoSelected, daoProposals, daoProposalSelected, selectDaoProposal } = useContext(EtherlinkContext)
  const { checkOnchainQueuedAndOverride } = useEvmProposalOps()
  const clearOverride = useProposalUiOverride(s => s.clear)
  const { isTimerActive, timerLabel, timerTargetDate } = useProposalTimeline(daoProposalSelected, daoSelected)
  const override = useProposalUiOverride(s => s.overrides[daoProposalSelected?.id || ""]) as any

  useEffect(() => {
    if (!proposalId) return
    if (daoProposalSelected?.id === proposalId) return
    selectDaoProposal(proposalId)
    dbg("[UI:proposalDetails]", {
      proposalId,
      daoToken: daoSelected?.token,
      daoDecimals: daoSelected?.decimals,
      proposalsLoaded: daoProposals?.length
    })
  }, [
    proposalId,
    selectDaoProposal,
    daoSelected?.id,
    daoProposals?.length,
    daoProposalSelected?.id,
    daoSelected?.decimals,
    daoSelected?.token
  ])

  // Chain-state fallback: if the proposal is already queued on-chain, reflect immediately
  useEffect(() => {
    if (!daoProposalSelected?.id) return
    checkOnchainQueuedAndOverride?.()
  }, [daoProposalSelected?.id, checkOnchainQueuedAndOverride])

  // Clear optimistic overrides once Firestore reflects queued/executed
  useEffect(() => {
    const s = daoProposalSelected?.status
    if (!daoProposalSelected?.id) return
    if (s === "queued" || s === "executed") {
      clearOverride(daoProposalSelected.id)
    }
  }, [daoProposalSelected?.id, daoProposalSelected?.status, clearOverride])

  return (
    <div>
      <Grid container style={{ gap: 30 }}>
        <Grid item>
          <EvmProposalDetailCard poll={daoProposalSelected} />
        </Grid>
      </Grid>

      {/** Dark content section matching Tezos detail panels */}
      <ContentContainer style={{ gap: 10, color: "white", marginTop: 10 }}>
        <Grid item xs={12} md={12} style={{ padding: "40px" }}>
          {(() => {
            const hasOverrideQueued = override?.status === "queued" && typeof override?.eta === "number"
            const label = hasOverrideQueued ? "Execution available in" : timerLabel
            const target = hasOverrideQueued ? dayjs.unix(override.eta) : timerTargetDate
            const shouldShow = isTimerActive || hasOverrideQueued
            return shouldShow ? <EvmProposalCountdown overrideLabel={label} overrideTarget={target} /> : null
          })()}
          <RenderProposalAction />
        </Grid>
      </ContentContainer>

      <EvmProposalVoteDetail poll={daoProposalSelected} token={daoSelected?.token} />

      <ContentContainer style={{ gap: 10, color: "white", padding: 40 }}>
        <Grid container>
          <Typography style={{ color: "white", fontSize: 20, fontWeight: 600 }}>Proposal Data</Typography>
        </Grid>
        <Grid container>
          {daoProposalSelected?.proposalData?.map(
            ({ parameter, value }: { parameter: string; value: string }, idx: number) => {
              console.log("callDataXYB", { parameter, value })
              const textValue = value?.length > 64 ? value.slice(0, 8) + "..." + value.slice(-4) : value
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
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <Typography style={{ color: "white" }}>{textValue}</Typography>
                            <IconButton
                              onClick={() => navigator.clipboard.writeText(value)}
                              style={{ marginLeft: 8, padding: 4 }}
                            >
                              <CopyButton text={value} />
                            </IconButton>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>
              )
            }
          )}
        </Grid>
      </ContentContainer>

      <EvmProposalVoterList />
    </div>
  )
}
