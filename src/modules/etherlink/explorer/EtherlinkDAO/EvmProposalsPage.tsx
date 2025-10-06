import React, { useMemo, useState, useCallback } from "react"
import { useContext } from "react"
import { EtherlinkContext } from "services/wagmi/context"
import { Grid } from "components/ui"
import { SmallButton } from "modules/common/SmallButton"
import { EvmDaoProposalList } from "modules/etherlink/components/EvmDaoProposalList"
import { ProposalActionsDialog } from "modules/explorer/components/ProposalActionsDialog"
import { useQueryParam } from "modules/home/hooks/useQueryParam"
import { useTimelineForProposals } from "services/wagmi/etherlink/hooks/useProposalTimeline"
import { IEvmProposal } from "modules/etherlink/types"
import { parseStatusQuery, toDisplayStatus } from "modules/etherlink/status"
import { ProposalsShell } from "components/ui/ProposalsShell"
import { TabPanel } from "modules/explorer/components/TabPanel"
import { FilterProposalsDialog } from "modules/explorer/components/FiltersDialog"
import { Filters } from "modules/explorer/pages/User/components/UserMovements"

export const EvmProposalsPage = () => {
  const [proposalType, setProposalType] = useQueryParam("type")
  const [proposalStatus, setProposalStatus] = useQueryParam("status")
  const [proposalAuthor] = useQueryParam("author")
  const { daoProposals, daoSelected, isProposalDialogOpen, setIsProposalDialogOpen } = useContext(EtherlinkContext)
  const processedProposals = useTimelineForProposals<IEvmProposal>(
    daoProposals as unknown as IEvmProposal[],
    daoSelected as any
  )
  const [selectedTab, setSelectedTab] = useState(0)
  const [openFiltersDialog, setOpenFiltersDialog] = useState(false)
  const [filters, setFilters] = useState<Filters>()

  const onChangeTab = useCallback((idx: number) => {
    setSelectedTab(idx)
    setFilters(undefined)
  }, [])

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

  const matchesOnchainFilter = (p: any) => {
    if (!filters || !filters.onchainStatus || filters.onchainStatus.length === 0) return true
    const disp = toDisplayStatus(p.displayStatus || p.status)
    const labels = filters.onchainStatus.map(s => tezosToDisplay[String(s.label).toLowerCase()] || "")
    return labels.includes(disp || "")
  }

  const isOffchainActive = (p: any) => {
    const disp = toDisplayStatus(p.displayStatus || p.status)
    return disp === "Active" || disp === "Pending"
  }

  const matchesEvmType = (p: any, kind?: string) => {
    if (!kind || kind === "all") return true
    const t = String(p?.type || "").toLowerCase()
    const isToken = t.startsWith("mint") || t.startsWith("burn") || t === "token"
    switch (kind) {
      case "offchain":
        return t === "offchain"
      case "token":
        return isToken
      case "registry":
        return t.includes("registry")
      case "transfer":
        return t.includes("transfer")
      case "contract call":
        return t.includes("contract call") || t.includes("contract_call") || t.includes("arbitrary")
      case "voting delay":
        return t.includes("voting delay")
      case "voting period":
        return t.includes("voting period")
      case "proposal threshold":
        return t.includes("proposal threshold")
      default:
        return true
    }
  }

  const filteredProposals = useMemo(() => {
    let base = processedProposals || []

    // query param compatibility for type/status/author
    if (!filters) {
      if (
        (proposalType === "all" && proposalStatus === "all") ||
        (!proposalType && !proposalStatus) ||
        (proposalType === "all" && !proposalStatus)
      ) {
        base = processedProposals || []
      } else {
        base = (processedProposals || []).filter((proposal: any) => {
          if (proposalAuthor && proposalAuthor !== "all" && proposal.author === proposalAuthor) return true
          if (proposalType && proposalType !== "all" && proposal.type === proposalType) return true
          if (proposalStatus && proposalStatus !== "all") {
            const desired = parseStatusQuery(proposalStatus)
            if (desired) {
              if (proposal.displayStatus === desired) return true
              if (toDisplayStatus(proposal.status) === desired) return true
            }
          }
          if (
            proposalType === "token" &&
            (proposal.type?.toLowerCase().startsWith("mint") || proposal.type?.toLowerCase().startsWith("burn"))
          )
            return true
          return false
        })
      }
    }

    // apply unified filters when present
    if (filters) {
      if (selectedTab === 0) {
        base = (processedProposals || [])
          .filter(p => p.type !== "offchain")
          .filter(matchesOnchainFilter)
          .filter(p => matchesEvmType(p, filters.evmType))
      } else {
        base = (processedProposals || [])
          .filter(p => p.type === "offchain")
          .filter(p => {
            if (!filters) return true
            if (filters.offchainStatus === "all") return true
            if (filters.offchainStatus === "active") return isOffchainActive(p)
            if (filters.offchainStatus === "closed") return !isOffchainActive(p)
            return true
          })
      }
    }
    return base
  }, [processedProposals, proposalType, proposalStatus, proposalAuthor, filters, selectedTab])

  return (
    <>
      <ProposalsShell
        selectedTab={selectedTab}
        onChangeTab={onChangeTab}
        onOpenFilters={() => setOpenFiltersDialog(true)}
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
          // Align tab with type selection for better UX
          if (f?.evmType === "offchain") setSelectedTab(1)
          if (f?.evmType && f.evmType !== "offchain" && selectedTab === 1) setSelectedTab(0)
          setFilters(f)
        }}
      />
    </>
  )
}
