import React, { useCallback, useState, useContext, useEffect } from "react"
import { Button, Grid, styled, Theme, Typography, useMediaQuery, useTheme } from "@mui/material"

import { useDAO } from "services/services/dao/hooks/useDAO"
import { useProposals } from "services/services/dao/hooks/useProposals"
import { useDAOID } from "../DAO/router"

import { ReactComponent as LinkActive } from "assets/img/link_active.svg"
import { ReactComponent as LinkInactive } from "assets/img/link_inactive.svg"
import { ReactComponent as UnlinkActive } from "assets/img/unlink_active.svg"
import { ReactComponent as UnlinkInactive } from "assets/img/unlink_inactive.svg"

import { SmallButton } from "modules/common/SmallButton"
import { ProposalActionsDialog } from "modules/explorer/components/ProposalActionsDialog"
import { TabPanel } from "modules/explorer/components/TabPanel"
import { usePolls } from "modules/lite/explorer/hooks/usePolls"
import { ProposalsList } from "modules/explorer/components/ProposalsList"
import { useFlush } from "services/contracts/baseDAO/hooks/useFlush"
import { useDropAllExpired } from "services/contracts/baseDAO/hooks/useDropAllExpired"
import { ProposalStatus } from "services/services/dao/mappers/proposal/types"
import NewReleasesIcon from "@mui/icons-material/NewReleases"
import DeleteIcon from "@mui/icons-material/Delete"
import FilterAltIcon from "@mui/icons-material/FilterAlt"
import { FilterProposalsDialog } from "modules/explorer/components/FiltersDialog"
import { Filters } from "../User/components/UserMovements"
import { EvmProposalsPage } from "modules/etherlink/explorer/EtherlinkDAO/EvmProposalsPage"

const FiltersContainer = styled(Grid)({
  marginTop: 45,
  gap: 8,
  cursor: "pointer"
})

const TabsContainer = styled(Grid)({
  borderRadius: 8,
  gap: 16
})

const StyledTab = styled(({ isSelected, ...other }: any) => <Button {...other} />)(
  ({ theme, isSelected }: { theme: Theme; isSelected: boolean }) => ({
    "fontSize": 18,
    "height": 40,
    "fontWeight": 400,
    "paddingLeft": 20,
    "paddingRight": 20,
    "paddingTop": 0,
    "paddingBottom": 0,
    "borderRadius": 8,
    "backgroundColor": isSelected ? "#2B3036" : "inherit",
    "color": isSelected ? theme.palette.secondary.main : "#fff",
    "&:hover": {
      backgroundColor: isSelected ? "#24282D" : theme.palette.secondary.dark,
      borderRadius: 8,
      borderTopLeftRadius: "8px !important",
      borderTopRightRadius: "8px !important",
      borderBottomLeftRadius: "8px !important",
      borderBottomRightRadius: "8px !important"
    }
  })
)

const TabsBox = styled(Grid)(({ theme }) => ({
  background: "#24282D",
  borderRadius: 8,
  padding: "40px 56px",
  minHeight: 300,
  width: "100%",
  [theme.breakpoints.down("lg")]: {
    padding: "30px 36px"
  }
}))

const ProposalsFooter = styled(Grid)({
  padding: "16px 46px",
  minHeight: 34
})

const NotContainedButton = styled(Button)({
  fontSize: "18px"
})

export const DropButton = styled(Button)({
  verticalAlign: "text-bottom",
  fontSize: "16px"
})

const TezosProposals = () => {
  const daoId = useDAOID()
  const { data, cycleInfo } = useDAO(daoId)
  const [selectedTab, setSelectedTab] = React.useState(0)

  const { data: proposals } = useProposals(daoId)
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("md"))
  const proposalTypeQuery = new URLSearchParams(window.location.search).get("type")
  const [openDialog, setOpenDialog] = useState(false)
  const [openFiltersDialog, setOpenFiltersDialog] = useState(false)

  const { mutate } = useFlush()
  const { mutate: dropAllExpired } = useDropAllExpired()
  const { data: expiredProposals } = useProposals(daoId, ProposalStatus.EXPIRED)
  const { data: executableProposals } = useProposals(daoId, ProposalStatus.EXECUTABLE)
  const [filters, setFilters] = useState<Filters>()

  const handleCloseModal = () => {
    setOpenDialog(false)
  }

  const handleCloseFiltersModal = () => {
    setOpenFiltersDialog(false)
  }

  const onFlush = useCallback(async () => {
    if (executableProposals && expiredProposals && executableProposals.length && data) {
      mutate({
        dao: data,
        numOfProposalsToFlush: executableProposals.length,
        expiredProposalIds: expiredProposals.map(p => p.id)
      })
      return
    }
  }, [data, mutate, executableProposals, expiredProposals])

  const onDropAllExpired = useCallback(async () => {
    if (expiredProposals && expiredProposals.length && data) {
      dropAllExpired({
        dao: data,
        expiredProposalIds: expiredProposals.map(p => p.id)
      })
      return
    }
  }, [data, dropAllExpired, expiredProposals])

  const { data: polls } = usePolls(data?.liteDAOData?._id)

  const handleChangeTab = (newValue: number) => {
    setSelectedTab(newValue)
    setFilters(undefined)
  }

  const handleFilters = (filters: Filters) => {
    setFilters(filters)
  }

  useEffect(() => {
    if (proposalTypeQuery === "add-function") {
      setOpenDialog(true)
    }
  }, [proposalTypeQuery])

  return (
    <>
      <Grid container direction="column" style={{ gap: 42 }}>
        <TabsBox item>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            direction={isMobileSmall ? "column" : "row"}
            style={{ gap: 15 }}
          >
            <Grid item>
              <TabsContainer container>
                <Grid item>
                  <StyledTab
                    startIcon={selectedTab === 0 ? <LinkActive /> : <LinkInactive />}
                    variant="contained"
                    disableElevation={true}
                    onClick={() => handleChangeTab(0)}
                    isSelected={selectedTab === 0}
                  >
                    On-Chain
                  </StyledTab>
                </Grid>
                <Grid item>
                  <StyledTab
                    startIcon={selectedTab === 1 ? <UnlinkActive /> : <UnlinkInactive />}
                    disableElevation={true}
                    variant="contained"
                    onClick={() => handleChangeTab(1)}
                    isSelected={selectedTab === 1}
                  >
                    Off-Chain
                  </StyledTab>
                </Grid>
              </TabsContainer>
            </Grid>
            <Grid
              item
              container
              justifyContent="flex-end"
              alignItems="center"
              style={{ gap: 15 }}
              direction={isMobileSmall ? "column" : "row"}
              xs={isMobileSmall ? undefined : true}
            >
              <NotContainedButton
                color="secondary"
                onClick={onFlush}
                disabled={!executableProposals || !executableProposals.length}
              >
                <NewReleasesIcon style={{ marginRight: 8, fontSize: 20 }} />
                Execute
              </NotContainedButton>
              <NotContainedButton
                color="secondary"
                onClick={onDropAllExpired}
                disabled={!expiredProposals || !expiredProposals.length}
              >
                <DeleteIcon style={{ marginRight: 4, fontSize: 20 }} />
                Drop Expired
              </NotContainedButton>
              <SmallButton variant="contained" color="secondary" onClick={() => setOpenDialog(true)}>
                New Proposal
              </SmallButton>
            </Grid>
          </Grid>

          <FiltersContainer
            onClick={() => setOpenFiltersDialog(true)}
            xs={isMobileSmall ? 12 : 2}
            item
            container
            direction="row"
            alignItems="center"
          >
            <FilterAltIcon style={{ color: theme.palette.secondary.main, marginRight: 6 }} fontSize="small" />
            <Typography color="secondary">Filter & Sort</Typography>
          </FiltersContainer>

          <TabPanel value={selectedTab} index={0}>
            <Grid item xs={12} style={{ marginTop: 38, gap: 16 }}>
              {proposals && cycleInfo && (
                <ProposalsList
                  proposalStyle={{ marginBottom: 32 }}
                  currentLevel={cycleInfo.currentLevel}
                  proposals={proposals}
                  liteProposals={undefined}
                  filters={filters}
                />
              )}
              {!(proposals && proposals.length > 0) ? (
                <ProposalsFooter item container direction="column" justifyContent="center">
                  <Grid item>
                    <Typography color="textPrimary" align="center">
                      No items
                    </Typography>
                  </Grid>
                </ProposalsFooter>
              ) : null}
            </Grid>
          </TabPanel>

          <TabPanel value={selectedTab} index={1}>
            <Grid item style={{ marginTop: 38, gap: 16 }}>
              {proposals && cycleInfo && (
                <ProposalsList
                  proposalStyle={{ marginBottom: 32 }}
                  currentLevel={cycleInfo.currentLevel}
                  proposals={undefined}
                  liteProposals={polls}
                  filters={filters}
                  daoId={daoId}
                />
              )}
              {!(polls && polls.length > 0) ? (
                <ProposalsFooter item container direction="column" justifyContent="center">
                  <Grid item>
                    <Typography color="textPrimary" align="center">
                      No items
                    </Typography>
                  </Grid>
                </ProposalsFooter>
              ) : null}
            </Grid>
          </TabPanel>
        </TabsBox>

        <ProposalActionsDialog open={openDialog} handleClose={handleCloseModal} queryType={proposalTypeQuery || ""} />

        {/* Keeping this component here as it is inhe master branch */}
        <FilterProposalsDialog
          saveFilters={handleFilters}
          open={openFiltersDialog}
          handleClose={handleCloseFiltersModal}
          selectedTab={selectedTab}
        />
      </Grid>
    </>
  )
}

export const EtherlinkProposals = () => {}

export const Proposals: React.FC = () => {
  const daoId = useDAOID()
  const { data } = useDAO(daoId)
  return data?.data.network.startsWith("etherlink") ? <EvmProposalsPage /> : <TezosProposals />
}
