import {
  Button,
  Grid,
  TableRow,
  TableBody,
  Table,
  Typography,
  TableCell,
  IconButton,
  CircularProgress
} from "components/ui"
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
import { usePastVoteWeight } from "services/wagmi/etherlink/hooks/usePastVoteWeight"
import { EvmProposalVoterList } from "modules/etherlink/components/EvmProposalVoterList"
import { ThumbDownAlt, ThumbUpAlt } from "components/ui"
import { useNotification } from "modules/common/hooks/useNotification"
import { useEvmProposalOps } from "services/contracts/etherlinkDAO/hooks/useEvmProposalOps"
import { useProposalUiOverride } from "services/wagmi/etherlink/hooks/useProposalUiOverride"
import { CopyButton } from "modules/common/CopyButton"
import { dbg } from "utils/debug"

const RenderProposalAction = () => {
  const [isDeploying, setIsDeploying] = useState(false)
  const { isConnected, connect, daoSelected, daoProposalSelected, daoProposalVoters, signer, provider } =
    useContext(EtherlinkContext)

  const [isCastingVote, setIsCastingVote] = useState(false)
  const [votedOptimistic, setVotedOptimistic] = useState(false)
  const openNotification = useNotification()
  const { castVote, queueForExecution, executeProposal } = useEvmProposalOps()
  // Reset optimistic-voted flag when switching proposals
  useEffect(() => {
    setVotedOptimistic(false)
  }, [daoProposalSelected?.id])
  const {
    isTimerActive: isTimerActiveComputed,
    timerLabel: timerLabelComputed,
    effectiveDisplayStatus: liveDisplayStatus,
    phase: livePhase
  } = useProposalTimeline(daoProposalSelected, daoSelected)

  const hasUserCastedVote = daoProposalVoters?.find((voter: any) => voter.voter === signer?.address)
  const hasVoted = !!hasUserCastedVote || votedOptimistic
  const {
    loading: loadingPastWeight,
    human: pastWeightHuman,
    weight: pastWeightRaw
  } = usePastVoteWeight(
    { address: daoSelected?.address, token: daoSelected?.token, decimals: daoSelected?.decimals },
    { id: daoProposalSelected?.id },
    signer?.address,
    (signer as any)?.provider || provider
  )

  // Optimistic override: hide queue button immediately after success
  const override = useProposalUiOverride(s => s.overrides[daoProposalSelected?.id || ""]) as any
  const effectiveStatus = (override?.status as string) || daoProposalSelected?.status
  const effectiveDisplayStatus = ((): string | undefined => {
    if (!daoProposalSelected) return undefined
    // If UI override indicates queued but the local timer has ended,
    // treat as Executable to avoid waiting for Firestore refresh.
    if (override?.status === "queued")
      return !isTimerActiveComputed && timerLabelComputed === "Execution available in" ? "Executable" : "Queued"
    if (override?.status === "executable") return "Executable"
    if (override?.status === "executed") return "Executed"
    // Fallback priority: live computed status from timeline hook → Firestore display → raw status
    const base = liveDisplayStatus || daoProposalSelected?.displayStatus || (daoProposalSelected as any)?.status
    if (base === "Queued" && !isTimerActiveComputed && timerLabelComputed === "Execution available in")
      return "Executable"
    return base as string | undefined
  })()

  // For non-timer states, surface a concise action label similar to WeRule
  const renderStaticActionLabel = () => {
    if (isTimerActiveComputed) return null
    let label = "Voting has ended"
    if (effectiveDisplayStatus === "Pending") label = "Voting begins in"
    else if (effectiveDisplayStatus === "Active") label = "Voting ends in"
    else if (effectiveDisplayStatus === "Queued") label = "Executable in"
    return (
      <Grid container justifyContent="center" style={{ marginBottom: 10 }}>
        <Typography style={{ color: "white" }}>{label}</Typography>
      </Grid>
    )
  }

  if (isDeploying) {
    const processingLabel = effectiveDisplayStatus === "Executable" ? "Executing proposal..." : "Queuing proposal..."

    return (
      <Grid container direction="column" alignItems="center" justifyContent="center" style={{ gap: 12 }}>
        {renderStaticActionLabel()}
        <CircularProgress size={28} style={{ color: "rgb(113 214 156)" }} />
        <Typography style={{ color: "white" }}>{processingLabel}</Typography>
      </Grid>
    )
  }

  if (effectiveDisplayStatus === "Executable") {
    // Show Execute Button
    if (!isConnected) {
      return (
        <Grid container justifyContent="center">
          {renderStaticActionLabel()}
          <Button
            variant="contained"
            color="secondary"
            style={{ background: "rgb(113 214 156)" }}
            onClick={() => connect?.()}
          >
            Connect Wallet to Execute
          </Button>
        </Grid>
      )
    }
    return (
      <Grid container justifyContent="center">
        {renderStaticActionLabel()}
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
        {renderStaticActionLabel()}
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

  // Show Queue for Execution when proposal has succeeded OR when the
  // derived ready-to-queue hint is present (parity with WeRule)
  if (effectiveDisplayStatus === "Succeeded" || daoProposalSelected?.readyToQueue) {
    return (
      <Grid container justifyContent="center">
        {renderStaticActionLabel()}
        {!isConnected ? (
          <Button
            variant="contained"
            color="secondary"
            style={{ background: "rgb(113 214 156)" }}
            onClick={() => connect?.()}
          >
            Connect Wallet to Queue
          </Button>
        ) : (
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
            Queue for Execution
          </Button>
        )}
      </Grid>
    )
  }

  if (livePhase === "voting") {
    if (!isConnected) {
      return (
        <Grid container justifyContent="center" style={{ gap: 10 }}>
          {renderStaticActionLabel()}
          <Button
            variant="contained"
            color="secondary"
            style={{ background: "rgb(113 214 156)" }}
            onClick={() => connect?.()}
          >
            Connect Wallet to Vote
          </Button>
        </Grid>
      )
    }
    // If the user has already voted (from Firestore or optimistically), hide buttons and show a clear message.
    if (hasVoted) {
      return (
        <>
          <Grid container style={{ gap: 10 }} alignItems="center" justifyContent="center">
            {renderStaticActionLabel()}
            {isConnected && (
              <Grid container justifyContent="center" style={{ marginBottom: 6 }}>
                <Typography style={{ color: "#aaa", fontFamily: "monospace" }}>
                  {loadingPastWeight || pastWeightHuman === null
                    ? "Checking your voting weight..."
                    : `Your voting weight for this proposal is ${pastWeightHuman}`}
                </Typography>
              </Grid>
            )}
          </Grid>
          <Grid container justifyContent="center" style={{ marginTop: 10 }}>
            <Typography style={{ color: "white" }}>You have already voted</Typography>
          </Grid>
        </>
      )
    }
    return (
      <>
        <Grid container style={{ gap: 10 }} alignItems="center" justifyContent="center">
          {renderStaticActionLabel()}
          {isConnected && (
            <Grid container justifyContent="center" style={{ marginBottom: 6 }}>
              <Typography style={{ color: "#aaa", fontFamily: "monospace" }}>
                {loadingPastWeight || pastWeightHuman === null
                  ? "Checking your voting weight..."
                  : `Your voting weight for this proposal is ${pastWeightHuman}`}
              </Typography>
            </Grid>
          )}
          <Button
            disabled={isCastingVote || loadingPastWeight || (pastWeightRaw !== null && pastWeightRaw <= 0n)}
            onClick={() => {
              setIsCastingVote(true)
              castVote(daoProposalSelected?.id, true)
                .then((receipt: any) => {
                  console.log("Receipt", receipt)
                  setVotedOptimistic(true)
                  openNotification({
                    message: "Vote cast successfully",
                    autoHideDuration: 2000,
                    variant: "success"
                  })
                })
                .catch((error: any) => {
                  console.log("Vote error", error)
                  openNotification({
                    message: error?.message || "Error casting vote",
                    autoHideDuration: 2000,
                    variant: "error"
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
                  setVotedOptimistic(true)
                  openNotification({
                    message: "Vote cast successfully",
                    autoHideDuration: 2000,
                    variant: "success"
                  })
                })
                .catch((error: any) => {
                  console.log("Vote error", error)
                  openNotification({
                    message: error?.message || "Error casting vote",
                    autoHideDuration: 2000,
                    variant: "error"
                  })
                })
                .finally(() => {
                  setIsCastingVote(false)
                })
            }}
            variant="contained"
            color="secondary"
            style={{ background: "red" }}
            disabled={isCastingVote || loadingPastWeight || (pastWeightRaw !== null && pastWeightRaw <= 0n)}
          >
            <ThumbDownAlt style={{ marginRight: 8 }} /> Reject
          </Button>
        </Grid>
      </>
    )
  }
  // If timer running or queued waiting, actions are managed above; otherwise show static label
  if (isTimerActiveComputed || effectiveDisplayStatus === "Queued") return null

  return <Grid>{renderStaticActionLabel()}</Grid>
}

export const EvmProposalDetailsPage = () => {
  const params = useParams() as { proposalId: string }
  const proposalId = params?.proposalId

  const { daoSelected, daoProposals, daoProposalSelected, selectDaoProposal } = useContext(EtherlinkContext)
  const { checkOnchainQueuedAndOverride } = useEvmProposalOps()
  const clearOverride = useProposalUiOverride(s => s.clear)
  const setExecutableOverride = useProposalUiOverride(s => s.setExecutable)
  const {
    isTimerActive,
    timerLabel,
    timerTargetDate,
    effectiveDisplayStatus: headerDisplayStatus
  } = useProposalTimeline(daoProposalSelected, daoSelected)
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
    // Intentionally keep dependencies minimal to avoid infinite re-selection loops
    // when callback identities change during doc subscriptions and decoding.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposalId, daoProposalSelected?.id])

  // Chain-state fallback: if the proposal is already queued on-chain, reflect immediately
  useEffect(() => {
    if (!daoProposalSelected?.id) return
    checkOnchainQueuedAndOverride?.()
  }, [daoProposalSelected?.id, checkOnchainQueuedAndOverride])

  // When override says 'queued' with an ETA, flip to 'executable' at ETA to reveal Execute button immediately
  useEffect(() => {
    const pid = daoProposalSelected?.id
    if (!pid) return
    if (override?.status !== "queued" || typeof override?.eta !== "number") return
    const now = Math.floor(Date.now() / 1000)
    const ms = (override.eta - now) * 1000
    if (ms <= 0) {
      setExecutableOverride(pid)
      return
    }
    const t = setTimeout(() => setExecutableOverride(pid), ms)
    return () => clearTimeout(t)
  }, [daoProposalSelected?.id, override?.status, override?.eta, setExecutableOverride])

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
          <EvmProposalDetailCard poll={daoProposalSelected} displayStatusOverride={headerDisplayStatus as any} />
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
