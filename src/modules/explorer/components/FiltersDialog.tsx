import React, { useEffect, useState } from "react"
import { ResponsiveDialog } from "./ResponsiveDialog"
import { Grid, styled } from "@material-ui/core"
import { Typography } from "@mui/material"
import { ProposalStatus } from "services/services/dao/mappers/proposal/types"
import { SmallButton } from "modules/common/SmallButton"
import { Order, ProposalType } from "../types.d"
import { Filters } from "../pages/User/components/UserMovements"

interface Props {
  open: boolean
  handleClose: () => void
  selectedTab: number
  saveFilters: (filters: Filters) => void
  // When true, show Etherlink EVM proposal type section
  showEvmType?: boolean
  // Toggles Off-Chain-specific options; defaults to true
  offchainEnabled?: boolean
}

const SectionTitle = styled(Typography)({
  fontSize: "18px !important",
  fontWeight: 600
})

const Container = styled(Grid)({
  marginTop: 6,
  gap: 24
})

const StatusButton = styled(Grid)(({ theme }) => ({
  "background": theme.palette.primary.main,
  "padding": "8px 16px",
  "borderRadius": 50,
  "marginRight": 16,
  "marginBottom": 16,
  "cursor": "pointer",
  "textTransform": "capitalize",
  "&:hover": {
    background: "rgba(129, 254, 183, .4)"
  }
}))

interface StatusOption {
  label: string
  selected: boolean
}

export enum OffchainStatus {
  ACTIVE = "active",
  CLOSED = "closed",
  NO_QUORUM = "no-quorum",
  ALL = "all"
}

export const FilterProposalsDialog: React.FC<Props> = ({
  open,
  handleClose,
  selectedTab,
  saveFilters,
  showEvmType,
  offchainEnabled = true
}) => {
  const [filters, setFilters] = useState<StatusOption[]>([])
  const [status, setStatus] = useState<StatusOption[]>([])
  const [offchainStatus, setOffchainStatus] = useState<OffchainStatus>(OffchainStatus.ALL)
  const isOffchainTab = offchainEnabled && selectedTab === 1
  const proposalType = isOffchainTab ? ProposalType.OFF_CHAIN : ProposalType.ON_CHAIN
  const [order, setOrder] = useState<Order>(Order.RECENT)
  const [evmType, setEvmType] = useState<string>("all")

  useEffect(() => {
    // Off-chain tab should force the type filter to "offchain" so downstream
    // consumers can reliably detect the scope even when the type section is hidden.
    if (!isOffchainTab) {
      setEvmType(prev => (prev === "offchain" ? "all" : prev))
    } else {
      setEvmType("offchain")
    }
  }, [selectedTab, isOffchainTab])

  const isSelected = (item: StatusOption) => {
    return filters.includes(item) ? true : false
  }

  const saveStatus = (status: StatusOption) => {
    let updated: StatusOption[] = []
    if (filters.includes(status)) {
      status.selected = false
      updated = filters.filter(item => item.label !== status.label)
    } else {
      updated = filters.slice()
      updated.push(status)
    }
    setFilters(updated)
  }

  const findStatus = () => {
    const values = Object.values(ProposalStatus)
    for (const item in values) {
      const raw = values[item] as string
      // For EVM proposals, prefer the term 'defeated' instead of Tezos 'dropped'
      const label = showEvmType && raw === "dropped" ? "defeated" : raw
      const obj = {
        label,
        selected: false
      }
      setStatus(oldArray => [...oldArray, obj])
    }
  }

  useEffect(() => {
    setStatus([])
    findStatus()
  }, [])

  const saveOffchainStatus = (status: OffchainStatus) => {
    if (offchainStatus === status) {
      setOffchainStatus(OffchainStatus.ALL)
    } else {
      setOffchainStatus(status)
    }
  }

  const showFilters = () => {
    const filterObject: Filters = {
      type: proposalType,
      offchainStatus: isOffchainTab ? offchainStatus : OffchainStatus.ALL,
      onchainStatus: filters,
      order: order,
      evmType
    }
    saveFilters(filterObject)
    handleClose()
  }

  return (
    <>
      <ResponsiveDialog open={open} onClose={handleClose} title={"Filter"} template="sm">
        {/* <Container container direction="column">
          <Grid item>
            <SectionTitle>Sort By</SectionTitle>
          </Grid>
          <Grid item>
            <Dropdown
              options={[
                { name: "Newest to Oldest", value: "recent" },
                { name: "Most Popular to Least Popular", value: "popular" }
              ]}
              value={"recent"}
              // onSelected={filterProposalByPopularity}
              isFilter={true}
            />
          </Grid>
        </Container> */}
        <Container container direction="column">
          <Grid item>
            <SectionTitle>Proposal Status</SectionTitle>
          </Grid>
          {!isOffchainTab ? (
            <Grid item container direction="row">
              {status.length > 0 &&
                status.map((item, index) => {
                  return (
                    <StatusButton
                      item
                      key={`status-${index}`}
                      style={isSelected(item) ? { backgroundColor: "#fff", color: "#1c1f23" } : {}}
                    >
                      <Typography onClick={() => saveStatus(item)}>{item.label}</Typography>
                    </StatusButton>
                  )
                })}
            </Grid>
          ) : (
            <Grid item container direction="row">
              <StatusButton
                item
                onClick={() => saveOffchainStatus(OffchainStatus.ACTIVE)}
                style={offchainStatus === OffchainStatus.ACTIVE ? { backgroundColor: "#fff", color: "#1c1f23" } : {}}
              >
                <Typography>Active</Typography>
              </StatusButton>
              <StatusButton
                item
                onClick={() => saveOffchainStatus(OffchainStatus.CLOSED)}
                style={offchainStatus === OffchainStatus.CLOSED ? { backgroundColor: "#fff", color: "#1c1f23" } : {}}
              >
                <Typography>Closed</Typography>
              </StatusButton>
              {showEvmType ? (
                <StatusButton
                  item
                  onClick={() => saveOffchainStatus(OffchainStatus.NO_QUORUM)}
                  style={
                    offchainStatus === OffchainStatus.NO_QUORUM ? { backgroundColor: "#fff", color: "#1c1f23" } : {}
                  }
                >
                  <Typography>No Quorum</Typography>
                </StatusButton>
              ) : null}
            </Grid>
          )}
        </Container>

        {/* Optional Etherlink EVM Type filter */}
        {/** Shown only when consumer requests it via prop */}
        {/** Values mirror the previous Etherlink UI dropdown */}
        {/** "offchain" is available but typically used alongside the Off-Chain tab */}
        {showEvmType && !isOffchainTab ? (
          <Container container direction="column">
            <Grid item>
              <SectionTitle>Type</SectionTitle>
            </Grid>
            <Grid item container direction="row">
              {[
                "all",
                "token",
                "registry",
                "transfer",
                "batch",
                "contract call",
                "voting delay",
                "voting period",
                "proposal threshold"
              ]
                .concat(offchainEnabled ? ["offchain"] : [])
                .map(option => (
                  <StatusButton
                    key={`evm-type-${option}`}
                    item
                    onClick={() => setEvmType(option)}
                    style={evmType === option ? { backgroundColor: "#fff", color: "#1c1f23" } : {}}
                  >
                    <Typography style={{ textTransform: "capitalize" }}>{option}</Typography>
                  </StatusButton>
                ))}
            </Grid>
          </Container>
        ) : null}

        <Container container direction="row" justifyContent="flex-end">
          <SmallButton color="secondary" variant="contained" onClick={showFilters}>
            Apply
          </SmallButton>
        </Container>
      </ResponsiveDialog>
    </>
  )
}
