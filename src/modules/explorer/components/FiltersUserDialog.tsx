import React, { useEffect, useState } from "react"
import { ResponsiveDialog } from "./ResponsiveDialog"
import { Grid, styled } from "@material-ui/core"
import { Typography } from "@mui/material"
import { Dropdown } from "./Dropdown"
import { ProposalStatus } from "services/services/dao/mappers/proposal/types"
import { SmallButton } from "modules/common/SmallButton"
import { Filters } from "../pages/User/components/UserMovements"
import StatusButton from "components/ui/StatusButton"
import { ProposalType, OffchainStatus, Order, StatusOption } from "../types.d"
import { isFeatureEnabled } from "utils/features"

export interface Props {
  open: boolean
  handleClose: () => void
  saveFilters: (filters: Filters) => void
}

const SectionTitle = styled(Typography)({
  fontSize: "18px !important",
  fontWeight: 600
})

const Container = styled(Grid)({
  marginTop: 6,
  gap: 24
})

export const FilterUserProposalsDialog: React.FC<Props> = ({ open, handleClose, saveFilters }) => {
  const offchainEnabled = isFeatureEnabled("etherlink-offchain-debate")
  const [filters, setFilters] = useState<StatusOption[]>([])
  const [onchainStatus, setOnchainStatus] = useState<StatusOption[]>([])
  const [offchainStatus, setOffchainStatus] = useState<OffchainStatus>(OffchainStatus.ALL)
  const [proposalType, setProposalType] = useState<ProposalType>(ProposalType.ALL)
  const [order, setOrder] = useState<Order>(Order.RECENT)

  const filterProposalByPopularity = (status: string | undefined) => {
    if (status === "popular") {
      setOrder(Order.POPULAR)
    } else {
      setOrder(Order.RECENT)
    }
  }

  const isSelected = (item: StatusOption) => {
    return filters.includes(item) ? true : false
  }

  const saveStatus = (status: StatusOption) => {
    let updated: StatusOption[] = []
    if (filters.includes(status)) {
      updated = filters.filter(item => item.label !== status.label)
    } else {
      updated = filters.slice()
      updated.push(status)
    }
    setFilters(updated)
  }

  const saveType = (status: ProposalType) => {
    if (status === ProposalType.OFF_CHAIN && !offchainEnabled) return
    if (proposalType === status) {
      setProposalType(ProposalType.ALL)
    } else {
      setProposalType(status)
      setFilters([])
      setOffchainStatus(OffchainStatus.ALL)
    }
  }

  const saveOffchainStatus = (status: OffchainStatus) => {
    if (offchainStatus === status) {
      setOffchainStatus(OffchainStatus.ALL)
    } else {
      setOffchainStatus(status)
    }
  }

  const showFilters = () => {
    const effectiveType = offchainEnabled ? proposalType : ProposalType.ON_CHAIN
    const filterObject: Filters = {
      type: effectiveType,
      offchainStatus: offchainEnabled ? offchainStatus : OffchainStatus.ALL,
      onchainStatus: filters,
      order: order
    }
    saveFilters(filterObject)
    handleClose()
  }

  const findStatus = () => {
    const values = Object.values(ProposalStatus)
    for (const item in values) {
      const obj = {
        label: values[item],
        selected: false
      }
      setOnchainStatus(oldArray => [...oldArray, obj])
    }
  }

  useEffect(() => {
    setFilters([])
    setOnchainStatus([])
    findStatus()
    setOffchainStatus(OffchainStatus.ALL)
    if (!offchainEnabled) {
      setProposalType(ProposalType.ON_CHAIN)
    }
  }, [offchainEnabled])

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
              onSelected={value => filterProposalByPopularity(value)}
              isFilter={true}
            />
          </Grid>
        </Container> */}
        <Container container direction="column">
          <Grid item>
            <SectionTitle>Type</SectionTitle>
          </Grid>
          <Grid item container direction="row">
            <StatusButton
              item
              onClick={() => saveType(ProposalType.ON_CHAIN)}
              style={proposalType === ProposalType.ON_CHAIN ? { backgroundColor: "#fff", color: "#1c1f23" } : {}}
            >
              <Typography>On-chain</Typography>
            </StatusButton>
            {offchainEnabled ? (
              <StatusButton
                item
                onClick={() => saveType(ProposalType.OFF_CHAIN)}
                style={proposalType === ProposalType.OFF_CHAIN ? { backgroundColor: "#fff", color: "#1c1f23" } : {}}
              >
                <Typography>Off-chain</Typography>
              </StatusButton>
            ) : null}
          </Grid>
        </Container>

        {proposalType === ProposalType.ON_CHAIN ? (
          <Container container direction="column">
            <Grid item>
              <SectionTitle>On-Chain Proposal Status</SectionTitle>
            </Grid>
            <Grid item container direction="row">
              {onchainStatus.length > 0 &&
                onchainStatus.map((item, index) => {
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
          </Container>
        ) : null}

        {offchainEnabled && proposalType === ProposalType.OFF_CHAIN ? (
          <Container container direction="column">
            <Grid item>
              <SectionTitle>Off-Chain Proposal Status</SectionTitle>
            </Grid>
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
