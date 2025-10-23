import { Button, Grid, Typography, CircularProgress, ThumbDownAlt, ThumbUpAlt } from "components/ui"
import { useContext, useEffect, useState } from "react"
import { EtherlinkContext } from "services/wagmi/context"
import { useProposalTimeline } from "services/wagmi/etherlink/hooks/useProposalTimeline"
import { usePastVoteWeight } from "services/wagmi/etherlink/hooks/usePastVoteWeight"
import { useNotification } from "modules/common/hooks/useNotification"
import { useEvmProposalOps } from "services/contracts/etherlinkDAO/hooks/useEvmProposalOps"
import { useProposalUiOverride } from "services/wagmi/etherlink/hooks/useProposalUiOverride"

const renderStaticActionLabel = (isTimerActiveComputed: boolean, effectiveDisplayStatus?: string) => {
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

export const ProposalActionButtons = () => {
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
    {
      id: daoProposalSelected?.id,
      status: liveDisplayStatus || daoProposalSelected?.status,
      displayStatus: daoProposalSelected?.displayStatus
    },
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
    if (override?.status === "executed") return "Executed"
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

  if (isDeploying) {
    const processingLabel = effectiveDisplayStatus === "Executable" ? "Executing proposal..." : "Queuing proposal..."

    return (
      <Grid container direction="column" alignItems="center" justifyContent="center" style={{ gap: 12 }}>
        {renderStaticActionLabel(isTimerActiveComputed, effectiveDisplayStatus)}
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
          {renderStaticActionLabel(isTimerActiveComputed, effectiveDisplayStatus)}
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
        {renderStaticActionLabel(isTimerActiveComputed, effectiveDisplayStatus)}
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
        {renderStaticActionLabel(isTimerActiveComputed, effectiveDisplayStatus)}
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
        {renderStaticActionLabel(isTimerActiveComputed, effectiveDisplayStatus)}
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
          {renderStaticActionLabel(isTimerActiveComputed, effectiveDisplayStatus)}
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
            {renderStaticActionLabel(isTimerActiveComputed, effectiveDisplayStatus)}
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
          {renderStaticActionLabel(isTimerActiveComputed, effectiveDisplayStatus)}
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

  return <Grid>{renderStaticActionLabel(isTimerActiveComputed, effectiveDisplayStatus)}</Grid>
}
