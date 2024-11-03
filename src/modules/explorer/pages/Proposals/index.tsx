import React, { useCallback, useEffect, useState } from "react"
import { Button, Grid, styled, Theme, Typography, useMediaQuery, useTheme } from "@material-ui/core"

import { useDAO } from "services/services/dao/hooks/useDAO"
import { useProposals } from "services/services/dao/hooks/useProposals"
import { useDAOID } from "../DAO/router"

import { ReactComponent as LinkActive } from "assets/img/link_active.svg"
import { ReactComponent as LinkInactive } from "assets/img/link_inactive.svg"
import { ReactComponent as UnlinkActive } from "assets/img/unlink_active.svg"
import { ReactComponent as UnlinkInactive } from "assets/img/unlink_inactive.svg"

import { ContentContainer } from "../../components/ContentContainer"
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

const FiltersContainer = styled(Grid)({
  marginTop: 45,
  gap: 8,
  cursor: "pointer"
})

const TabsContainer = styled(Grid)({
  borderRadius: 8,
  gap: 16
})

const HeroContainer = styled(ContentContainer)(({ theme }) => ({
  background: "inherit !important",
  paddingTop: 0,
  padding: "0px",
  display: "inline-flex",
  alignItems: "center",
  [theme.breakpoints.down("xs")]: {
    maxHeight: "fit-content"
  }
}))

const TitleText = styled(Typography)({
  fontSize: 36,
  fontWeight: 500,
  lineHeight: 0.9,

  ["@media (max-width:1030px)"]: {
    fontSize: 26
  }
})

const StyledTab = styled(Button)(({ theme, isSelected }: { theme: Theme; isSelected: boolean }) => ({
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
}))

const TabsBox = styled(Grid)(({ theme }) => ({
  background: "#24282D",
  borderRadius: 8,
  padding: "40px 56px",
  minHeight: 300,
  width: "100%",
  [theme.breakpoints.down("sm")]: {
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

export const Proposals: React.FC = () => {
  const daoId = useDAOID()
  const { data, cycleInfo } = useDAO(daoId)
  const [selectedTab, setSelectedTab] = React.useState(0)

  const { data: proposals } = useProposals(daoId)
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("xs"))
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
        <HeroContainer item xs={12}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item container direction="row">
              <Grid
                container
                style={{ gap: 20 }}
                alignItems={isMobileSmall ? "baseline" : "center"}
                direction={isMobileSmall ? "column" : "row"}
              >
                <Grid item xs={isMobileSmall ? undefined : 4}>
                  <TitleText color="textPrimary">Proposals</TitleText>
                </Grid>
                <Grid
                  item
                  container
                  justifyContent="flex-end"
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
                  {/* <Grid>
                    <Tooltip placement="bottom" title="Execute all passed proposals and drop all expired or rejected">
                      <InfoIcon style={{ height: 16 }} color="secondary" />
                    </Tooltip>
                  </Grid> */}

                  {/* <Grid>

                    <Tooltip placement="bottom" title="Drop all expired proposals">
                      <InfoIcon style={{ height: 16 }} color="secondary" />
                    </Tooltip>
                  </Grid> */}
                </Grid>
                <Grid container direction="row">
                  <Typography variant="body1" style={{ color: theme.palette.primary.light }}>
                    Create, view, and vote on On-Chain and Off-Chain proposals
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </HeroContainer>

        <TabsBox item>
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

        <ProposalActionsDialog open={openDialog} handleClose={handleCloseModal} queryType={proposalTypeQuery} />

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
