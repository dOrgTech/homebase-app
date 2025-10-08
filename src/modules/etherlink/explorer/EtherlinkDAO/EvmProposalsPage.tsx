import React, { useMemo, useState, useCallback } from "react"
import { useContext } from "react"
import { EtherlinkContext } from "services/wagmi/context"
import { Grid } from "components/ui"
import { SmallButton } from "modules/common/SmallButton"
import { EvmDaoProposalList } from "modules/etherlink/components/EvmDaoProposalList"
import { ProposalActionsDialog } from "modules/explorer/components/ProposalActionsDialog"
import { useTimelineForProposals } from "services/wagmi/etherlink/hooks/useProposalTimeline"
import { IEvmProposal } from "modules/etherlink/types"
import { toDisplayStatus } from "modules/etherlink/status"
import { ProposalsShell } from "components/ui/ProposalsShell"
import { TabPanel } from "modules/explorer/components/TabPanel"
import { FilterProposalsDialog } from "modules/explorer/components/FiltersDialog"
import { Filters } from "modules/explorer/pages/User/components/UserMovements"
import { useQuerySyncedFilters } from "modules/etherlink/explorer/filters/useQuerySyncedFilters"
import { displayStatusFromKey, PTypeKey } from "modules/etherlink/explorer/filters/queryFilters"

export const EvmProposalsPage = () => {
  const { filters: qFilters, setFilters: setQFilters } = useQuerySyncedFilters()
  const { daoProposals, daoSelected, isProposalDialogOpen, setIsProposalDialogOpen } = useContext(EtherlinkContext)
  const processedProposals = useTimelineForProposals<IEvmProposal>(
    daoProposals as unknown as IEvmProposal[],
    daoSelected as any
  )
  const selectedTab = qFilters.type === "offchain" ? 1 : 0
  const [openFiltersDialog, setOpenFiltersDialog] = useState(false)
  const onChangeTab = useCallback(
    (idx: number) => {
      setQFilters({ type: idx === 1 ? "offchain" : "onchain" })
    },
    [setQFilters]
  )

  const tezosToDisplay: Record<string, string> = {
    "pending": "Pending",
    "active": "Active",
    "passed": "Succeeded",
    "rejected": "Rejected",
    "no quorum": "NoQuorum",
    "executable": "Executable",
    "expired": "Expired",
    "executed": "Executed",
    "dropped": "Defeated"
  }

  const matchesOnchainStatusFromQuery = (p: any) => {
    // status array comes normalized (hyphenated keys); empty or ['all'] means no filter
    const statusKeys = Array.isArray(qFilters.status) ? (qFilters.status as string[]) : []
    const filtered = (statusKeys || []).filter(s => s !== "all")
    if (filtered.length === 0) return true
    const disp = toDisplayStatus(p.effectiveDisplayStatus || p.displayStatus || p.status)
    const allowed = filtered.map(k => displayStatusFromKey(k as any)).filter(Boolean)
    return allowed.includes(disp as any)
  }

  const isOffchainActive = (p: any) => {
    const disp = toDisplayStatus(p.effectiveDisplayStatus || p.displayStatus || p.status)
    return disp === "Active" || disp === "Pending"
  }

  const matchesPtypeKey = (p: any, key: PTypeKey) => {
    const t = String(p?.type || "").toLowerCase()
    if (key === "mint") return t.startsWith("mint")
    if (key === "burn") return t.startsWith("burn")
    if (key === "registry") return t.includes("registry")
    if (key === "transfer") return t.includes("transfer")
    if (key === "contract-call")
      return t.includes("contract call") || t.includes("contract_call") || t.includes("arbitrary")
    if (key === "voting-delay") return t.includes("voting delay")
    if (key === "voting-period") return t.includes("voting period")
    if (key === "threshold") return t.includes("proposal threshold")
    if (key === "quorum") return t.includes("quorum")
    return true
  }

  const filteredProposals = useMemo(() => {
    let base = processedProposals || []

    // author filter (query param)
    if (qFilters.author && qFilters.author !== "all") {
      base = base.filter((p: any) => p.author === qFilters.author)
    }

    if (selectedTab === 0) {
      // on-chain
      base = base.filter(p => p.type !== "offchain").filter(matchesOnchainStatusFromQuery)
      const ptypes = qFilters.ptype || []
      if (ptypes.length > 0) {
        base = base.filter((p: any) => (ptypes as PTypeKey[]).some(k => matchesPtypeKey(p, k)))
      }
    } else {
      // off-chain
      base = base.filter(p => p.type === "offchain")
      const offStatuses = (qFilters.status || []) as string[]
      const hasActive = offStatuses.includes("active")
      const hasClosed = offStatuses.includes("closed")
      if (hasActive && !hasClosed) base = base.filter(isOffchainActive)
      if (hasClosed && !hasActive) base = base.filter(p => !isOffchainActive(p))
    }
    return base
  }, [processedProposals, qFilters.author, qFilters.status, qFilters.ptype, selectedTab])

  // Determine whether any filters are active for current tab to highlight the Filters pill
  const isFiltered = useMemo(() => {
    const hasAuthor = !!(qFilters.author && qFilters.author !== "all")
    const statuses = (qFilters.status || []) as string[]
    const hasOnchainStatus = selectedTab === 0 && statuses.some(s => s !== "all")
    const hasPtype = selectedTab === 0 && (qFilters.ptype?.length || 0) > 0
    const hasOffchainStatus = selectedTab === 1 && statuses.some(s => s === "active" || s === "closed")
    return hasAuthor || hasOnchainStatus || hasPtype || hasOffchainStatus
  }, [qFilters.author, qFilters.status, qFilters.ptype, selectedTab])

  return (
    <>
      <ProposalsShell
        selectedTab={selectedTab}
        onChangeTab={onChangeTab}
        onOpenFilters={() => setOpenFiltersDialog(true)}
        isFiltered={isFiltered}
        rightActions={
          <SmallButton variant="contained" color="secondary" onClick={() => setIsProposalDialogOpen(true)}>
            New Proposal
          </SmallButton>
        }
      >
        <Grid item xs={12} style={{ marginTop: 38, gap: 16 }}>
          <TabPanel value={selectedTab} index={0}>
            <EvmDaoProposalList proposals={(filteredProposals || []).filter(p => p.type !== "offchain")} />
          </TabPanel>
          <TabPanel value={selectedTab} index={1}>
            <EvmDaoProposalList proposals={(filteredProposals || []).filter(p => p.type === "offchain")} />
          </TabPanel>
        </Grid>
      </ProposalsShell>
      <ProposalActionsDialog open={isProposalDialogOpen} handleClose={() => setIsProposalDialogOpen(false)} />
      <FilterProposalsDialog
        open={openFiltersDialog}
        handleClose={() => setOpenFiltersDialog(false)}
        selectedTab={selectedTab}
        showEvmType
        saveFilters={(f: Filters) => {
          // Map dialog choices to query params
          const type = f?.evmType === "offchain" ? "offchain" : "onchain"
          const onchainStatusLabels = (f?.onchainStatus || []).map(s => String(s.label).toLowerCase())
          // Convert dialog labels to canonical status keys
          const statusFromDialog = onchainStatusLabels
            .map(l => l.replace(/\s+/g, " ")) // normalize spaces
            .map(l =>
              l === "passed" ? "succeeded" : l === "failed" ? "defeated" : l === "no quorum" ? "no-quorum" : l
            )
          const offchainStatus = f?.offchainStatus || "all"
          const status = type === "offchain" ? [offchainStatus] : statusFromDialog.length ? statusFromDialog : ["all"]

          // ptype mapping from dialog evmType
          const evmType = String(f?.evmType || "all").toLowerCase()
          let ptype: PTypeKey[] = []
          if (type === "onchain") {
            if (evmType === "token") ptype = ["mint", "burn"]
            else if (evmType === "registry") ptype = ["registry"]
            else if (evmType === "transfer") ptype = ["transfer"]
            else if (evmType === "contract call") ptype = ["contract-call"]
            else if (evmType === "voting delay") ptype = ["voting-delay"]
            else if (evmType === "voting period") ptype = ["voting-period"]
            else if (evmType === "proposal threshold") ptype = ["threshold"]
            else if (evmType === "all" || evmType === "offchain") ptype = []
          }

          setQFilters({ type, status: status as any, ptype })
        }}
      />
    </>
  )
}
