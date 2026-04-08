import React, { useMemo, useState, useCallback, useContext, useEffect } from "react"
import { EtherlinkContext } from "services/wagmi/context"
import { Grid } from "components/ui"
import { SmallButton } from "modules/common/SmallButton"
import { EvmDaoProposalList } from "modules/etherlink/components/EvmDaoProposalList"
import { EvmProposalsActionDialog } from "modules/etherlink/explorer/EvmProposalsActionDialog"
import { useTimelineForProposals } from "services/wagmi/etherlink/hooks/useProposalTimeline"
import { IEvmProposal } from "modules/etherlink/types"
import { toDisplayStatus } from "modules/etherlink/status"
import { EvmProposalsShell } from "modules/etherlink/components/EvmProposalsShell"
import { TabPanel } from "modules/explorer/components/TabPanel"
import { FilterProposalsDialog } from "modules/explorer/components/FiltersDialog"
import { Filters } from "modules/explorer/pages/User/components/UserMovements"
import { useQuerySyncedFilters } from "modules/etherlink/explorer/filters/useQuerySyncedFilters"
import { displayStatusFromKey, PTypeKey } from "modules/etherlink/explorer/filters/queryFilters"
import { isFeatureEnabled } from "utils/features"

export const EvmProposalsPage = () => {
  const { filters: qFilters, setFilters: setQFilters } = useQuerySyncedFilters()
  const { daoProposals, daoSelected, isProposalDialogOpen, setIsProposalDialogOpen } = useContext(EtherlinkContext)
  const processedProposals = useTimelineForProposals<IEvmProposal>(
    daoProposals as unknown as IEvmProposal[],
    daoSelected as any
  )
  const offchainEnabled = isFeatureEnabled("etherlink-offchain-debate")
  const selectedTab = qFilters.type === "active" ? 2 : offchainEnabled && qFilters.type === "offchain" ? 1 : 0
  const [openFiltersDialog, setOpenFiltersDialog] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [debouncedSearchText, setDebouncedSearchText] = useState("")
  useEffect(() => {
    if (!offchainEnabled && qFilters.type === "offchain") {
      setQFilters({ type: "onchain" })
    }
  }, [offchainEnabled, qFilters.type, setQFilters])
  const onChangeTab = useCallback(
    (idx: number) => {
      if (!offchainEnabled && idx === 1) return
      const type = idx === 2 ? "active" : idx === 1 ? "offchain" : "onchain"
      setQFilters({ type: type as any })
    },
    [offchainEnabled, setQFilters]
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchText])

  const matchesOnchainStatusFromQuery = (p: any) => {
    // status array comes normalized (hyphenated keys); empty or ['all'] means no filter
    const statusKeys = Array.isArray(qFilters.status) ? (qFilters.status as string[]) : []
    const filtered = (statusKeys || []).filter(s => s !== "all")
    if (filtered.length === 0) return true
    const ds = (p as any).effectiveDisplayStatus || (p as any).displayStatus
    const disp = (ds as any) || toDisplayStatus((p as any).status)
    const allowed = filtered.map(k => displayStatusFromKey(k as any)).filter(Boolean)
    return allowed.includes(disp as any)
  }

  const resolveDisplayStatus = (p: any) => toDisplayStatus(p.effectiveDisplayStatus || p.displayStatus || p.status)

  const isProposalActive = (p: any) => {
    const disp = resolveDisplayStatus(p)
    return disp === "Active" || disp === "Pending"
  }

  // Alias for backwards compatibility
  const isOffchainActive = isProposalActive

  const offchainStatusKeyForProposal = (p: any): "active" | "closed" | "no-quorum" => {
    const disp = resolveDisplayStatus(p)
    if (disp === "NoQuorum") return "no-quorum"
    return isOffchainActive(p) ? "active" : "closed"
  }

  const matchesPtypeKey = (p: any, key: PTypeKey) => {
    const t = String(p?.type || "").toLowerCase()
    if (key === "mint") return t.startsWith("mint")
    if (key === "burn") return t.startsWith("burn")
    if (key === "registry") return t.includes("registry")
    if (key === "transfer") return t.includes("transfer")
    if (key === "batch") return t.includes("batch")
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
    } else if (selectedTab === 1 && offchainEnabled) {
      // off-chain
      base = base.filter(p => p.type === "offchain")
      const offStatuses = ((qFilters.status || []) as string[]).filter(s => s !== "all")
      if (offStatuses.length > 0) {
        base = base.filter(p => offStatuses.includes(offchainStatusKeyForProposal(p)))
      }
    } else if (selectedTab === 2) {
      // Active tab - show all active/pending proposals (both on-chain and off-chain)
      base = base.filter(p => isProposalActive(p))
    }

    if (debouncedSearchText) {
      base = base.filter((p: any) => (p.title || "").toLowerCase().includes(debouncedSearchText.toLowerCase()))
    }

    return base
  }, [
    processedProposals,
    qFilters.author,
    qFilters.status,
    qFilters.ptype,
    selectedTab,
    offchainEnabled,
    debouncedSearchText
  ])

  // Determine whether any filters are active for current tab to highlight the Filters pill
  const isFiltered = useMemo(() => {
    const hasAuthor = !!(qFilters.author && qFilters.author !== "all")
    const statuses = (qFilters.status || []) as string[]
    const hasOnchainStatus = selectedTab === 0 && statuses.some(s => s !== "all")
    const hasPtype = selectedTab === 0 && (qFilters.ptype?.length || 0) > 0
    const hasOffchainStatus =
      offchainEnabled && selectedTab === 1 && statuses.some(s => s === "active" || s === "closed" || s === "no-quorum")
    return hasAuthor || hasOnchainStatus || hasPtype || hasOffchainStatus
  }, [qFilters.author, qFilters.status, qFilters.ptype, selectedTab, offchainEnabled])

  return (
    <>
      <EvmProposalsShell
        selectedTab={selectedTab}
        onChangeTab={onChangeTab}
        onOpenFilters={() => setOpenFiltersDialog(true)}
        onSearch={setSearchText}
        isFiltered={isFiltered}
        showOffchainTab={offchainEnabled}
        proposalCount={filteredProposals.length}
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
          {offchainEnabled ? (
            <TabPanel value={selectedTab} index={1}>
              <EvmDaoProposalList proposals={(filteredProposals || []).filter(p => p.type === "offchain")} />
            </TabPanel>
          ) : null}
          <TabPanel value={selectedTab} index={2}>
            <EvmDaoProposalList proposals={filteredProposals || []} />
          </TabPanel>
        </Grid>
      </EvmProposalsShell>
      <EvmProposalsActionDialog open={isProposalDialogOpen} handleClose={() => setIsProposalDialogOpen(false)} />
      <FilterProposalsDialog
        open={openFiltersDialog}
        handleClose={() => setOpenFiltersDialog(false)}
        selectedTab={selectedTab}
        showEvmType
        offchainEnabled={offchainEnabled}
        saveFilters={(f: Filters) => {
          // Map dialog choices to query params
          const type = f?.evmType === "offchain" ? "offchain" : "onchain"
          const onchainStatusLabels = (f?.onchainStatus || []).map(s => String(s.label).toLowerCase())
          // Convert dialog labels to canonical status keys
          const statusFromDialog = onchainStatusLabels
            .map(l => l.replace(/\s+/g, " ")) // normalize spaces
            .map(l =>
              l === "passed"
                ? "succeeded"
                : l === "failed"
                ? "defeated"
                : l === "no quorum"
                ? "no-quorum"
                : l === "dropped"
                ? "defeated"
                : l
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
            else if (evmType === "batch") ptype = ["batch"]
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
