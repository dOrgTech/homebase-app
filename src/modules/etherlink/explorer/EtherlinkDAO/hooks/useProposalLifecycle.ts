import { useEffect } from "react"
import { useProposalUiOverride } from "services/wagmi/etherlink/hooks/useProposalUiOverride"
import { useEvmProposalOps } from "services/contracts/etherlinkDAO/hooks/useEvmProposalOps"
import { dbg } from "utils/debug"

interface UseProposalLifecycleProps {
  proposalId: string
  daoProposalSelected: any
  daoSelected: any
  daoProposals: any[]
  selectDaoProposal: (id: string) => void
}

export const useProposalLifecycle = ({
  proposalId,
  daoProposalSelected,
  daoSelected,
  daoProposals,
  selectDaoProposal
}: UseProposalLifecycleProps) => {
  const { checkOnchainQueuedAndOverride } = useEvmProposalOps()
  const clearOverride = useProposalUiOverride(s => s.clear)
  const setExecutableOverride = useProposalUiOverride(s => s.setExecutable)
  const override = useProposalUiOverride(s => s.overrides[daoProposalSelected?.id || ""]) as any

  // Select the proposal when proposalId changes
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
    const os = override?.status
    if (!daoProposalSelected?.id || !os) return

    // Only clear override when Firestore has caught up to or superseded the optimistic state
    const shouldClear =
      (os === "queued" && (s === "queued" || s === "executed")) ||
      (os === "executable" && (s === "executable" || s === "executed")) ||
      (os === "executed" && s === "executed")

    if (shouldClear) {
      clearOverride(daoProposalSelected.id)
    }
  }, [daoProposalSelected?.id, daoProposalSelected?.status, override?.status, clearOverride])
}
