import React, { useState } from "react"
import { Box, Button, Grid, Paper, styled, Theme, Typography, useMediaQuery, useTheme } from "@material-ui/core"

import { useDAO } from "services/services/dao/hooks/useDAO"
import { useProposals } from "services/services/dao/hooks/useProposals"
import { useDAOID } from "../DAO/router"

import { ReactComponent as LinkActive } from "assets/img/link_active.svg"
import { ReactComponent as LinkInactive } from "assets/img/link_inactive.svg"
import { ReactComponent as UnlinkActive } from "assets/img/unlink_active.svg"
import { ReactComponent as UnlinkInactive } from "assets/img/unlink_inactive.svg"

import { ProposalStatus } from "services/services/dao/mappers/proposal/types"

import { ContentContainer } from "../../components/ContentContainer"
import { AllProposalsList } from "modules/explorer/components/AllProposalsList"
import { SmallButton } from "modules/common/SmallButton"
import { ProposalActionsDialog } from "modules/explorer/components/ProposalActionsDialog"
import { useTimeLeftInCycle } from "modules/explorer/hooks/useTimeLeftInCycle"

import { useIsProposalButtonDisabled } from "services/contracts/baseDAO/hooks/useCycleInfo"
import { ProposalList } from "modules/lite/explorer/components/ProposalList"
import { usePolls } from "modules/lite/explorer/hooks/usePolls"
import dayjs from "dayjs"
import { TabPanel } from "modules/explorer/components/TabPanel"

const TabsContainer = styled(Grid)(({ theme }) => ({
  borderRadius: 8,
  gap: 16
}))

const HeroContainer = styled(ContentContainer)(({ theme }) => ({
  padding: "38px 48px 38px 48px",
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
  "color": isSelected ? theme.palette.secondary.main : "#fff",
  "backgroundColor": isSelected ? "rgba(129, 254, 183, 0.20)" : "inherit",
  "&:hover": {
    backgroundColor: isSelected ? "rgba(129, 254, 183, 0.20)" : theme.palette.secondary.dark,
    borderRadius: 8,
    borderTopLeftRadius: "8px !important",
    borderTopRightRadius: "8px !important",
    borderBottomLeftRadius: "8px !important",
    borderBottomRightRadius: "8px !important"
  }
}))

export const DropButton = styled(Button)({
  verticalAlign: "text-bottom",
  fontSize: "16px"
})

const DAOItemGrid = styled(Grid)({
  gap: "30px",
  marginBottom: 40,
  justifyContent: "space-between",
  ["@media (max-width: 1155px)"]: {
    gap: "32px"
  },

  ["@media (max-width:960px)"]: {
    gap: "20px"
  },

  ["@media (max-width:830px)"]: {
    width: "86vw",
    gap: "20px"
  }
})

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  borderRadius: 8,
  color: theme.palette.text.primary,
  height: 84,
  display: "flex",
  padding: "33px 40px 30px 40px",
  flexDirection: "column",
  gap: 8
}))

const ItemContent = styled(Grid)({
  gap: 8
})

const ItemTitle = styled(Typography)(({ theme }) => ({
  fontSize: 18,
  fontWeight: 600,
  [theme.breakpoints.down("md")]: {
    fontSize: 15
  }
}))

const ItemValue = styled(Typography)(({ theme }) => ({
  fontSize: 32,
  fontWeight: 300,
  [theme.breakpoints.down("sm")]: {
    fontSize: 28
  }
}))

export const Proposals: React.FC = () => {
  const daoId = useDAOID()
  const { data, cycleInfo } = useDAO(daoId)
  const [selectedTab, setSelectedTab] = React.useState(0)

  const { data: proposals } = useProposals(daoId)
  const { data: activeProposals } = useProposals(daoId, ProposalStatus.ACTIVE)
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("xs"))
  const [openDialog, setOpenDialog] = useState(false)

  // const { mutate } = useFlush()
  // const { mutate: dropAllExpired } = useDropAllExpired()
  const { data: executableProposals } = useProposals(daoId, ProposalStatus.EXECUTABLE)
  // const { data: expiredProposals } = useProposals(daoId, ProposalStatus.EXPIRED)
  const { hours, minutes, days } = useTimeLeftInCycle()

  const shouldDisable = useIsProposalButtonDisabled(daoId)

  const handleCloseModal = () => {
    setOpenDialog(false)
  }

  // const onFlush = useCallback(async () => {
  //   if (executableProposals && expiredProposals && executableProposals.length && data) {
  //     mutate({
  //       dao: data,
  //       numOfProposalsToFlush: executableProposals.length,
  //       expiredProposalIds: expiredProposals.map(p => p.id)
  //     })
  //     return
  //   }
  // }, [data, mutate, executableProposals, expiredProposals])

  // const onDropAllExpired = useCallback(async () => {
  //   if (expiredProposals && expiredProposals.length && data) {
  //     dropAllExpired({
  //       dao: data,
  //       expiredProposalIds: expiredProposals.map(p => p.id)
  //     })
  //     return
  //   }
  // }, [data, dropAllExpired, expiredProposals])

  const { data: polls } = usePolls(data?.liteDAOData?._id)
  const id = data?.liteDAOData?._id

  const activeLiteProposals = polls?.filter(p => Number(p.endTime) > dayjs().valueOf())

  const handleChangeTab = (newValue: number) => {
    setSelectedTab(newValue)
  }

  return (
    <>
      <Grid container direction="column" style={{ gap: 42 }}>
        <HeroContainer item>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item container direction="row">
              <Grid
                container
                style={{ gap: 20 }}
                alignItems={isMobileSmall ? "baseline" : "center"}
                direction={isMobileSmall ? "column" : "row"}
              >
                <Grid item xs={isMobileSmall ? undefined : 5}>
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
                  <SmallButton variant="contained" color="secondary" onClick={() => setOpenDialog(true)}>
                    New Proposal
                  </SmallButton>
                  {/* <Grid>
                    <SmallButton
                      variant="contained"
                      color="secondary"
                      onClick={onFlush}
                      disabled={!executableProposals || !executableProposals.length}
                    >
                      Execute
                    </SmallButton>
                    <Tooltip placement="bottom" title="Execute all passed proposals and drop all expired or rejected">
                      <InfoIcon style={{ height: 16 }} color="secondary" />
                    </Tooltip>
                  </Grid> */}

                  {/* <Grid>
                    <DropButton
                      variant="contained"
                      color="secondary"
                      onClick={onDropAllExpired}
                      disabled={!expiredProposals || !expiredProposals.length}
                    >
                      Drop Expired
                    </DropButton>
                    <Tooltip placement="bottom" title="Drop all expired proposals">
                      <InfoIcon style={{ height: 16 }} color="secondary" />
                    </Tooltip>
                  </Grid> */}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </HeroContainer>

        <Grid item>
          <Grid container>
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
          </Grid>
        </Grid>

        <Grid item>
          <TabPanel value={selectedTab} index={0}>
            <DAOItemGrid container justifyContent={isMobileSmall ? "center" : "flex-start"}>
              <Box sx={{ flexGrow: 1, width: "inherit" }}>
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Item>
                      <ItemContent item container direction="row" alignItems="center">
                        <ItemTitle color="textPrimary">Cycle Status</ItemTitle>
                      </ItemContent>
                      <Grid item>
                        <ItemValue color="textPrimary">{shouldDisable ? "Voting" : "Creating"}</ItemValue>
                      </Grid>
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Item>
                      <ItemContent item container direction="row" alignItems="center">
                        <ItemTitle color="textPrimary">Current Cycle</ItemTitle>
                      </ItemContent>
                      <Grid item>
                        <ItemValue color="textPrimary">{cycleInfo?.currentCycle}</ItemValue>
                      </Grid>
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Item>
                      <ItemContent item container direction="row" alignItems="center">
                        <ItemTitle color="textPrimary">Time Left in Cycle</ItemTitle>
                      </ItemContent>
                      <Grid item>
                        <ItemValue color="textPrimary">
                          {" "}
                          {days}d {hours}h {minutes}m{" "}
                        </ItemValue>
                      </Grid>
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Item>
                      <ItemContent item container direction="row" alignItems="center">
                        <ItemTitle color="textPrimary">Voting Addresses</ItemTitle>
                      </ItemContent>
                      <Grid item>
                        <ItemValue color="textPrimary">{data?.data.ledger.length || "-"}</ItemValue>
                      </Grid>
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Item>
                      <ItemContent item container direction="row" alignItems="center">
                        <ItemTitle color="textPrimary">Active Proposals</ItemTitle>
                      </ItemContent>
                      <Grid item>
                        <ItemValue color="textPrimary"> {Number(activeProposals?.length)}</ItemValue>
                      </Grid>
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Item>
                      <ItemContent item container direction="row" alignItems="center">
                        <ItemTitle color="textPrimary">Executable Proposals</ItemTitle>
                      </ItemContent>
                      <Grid item>
                        <ItemValue color="textPrimary">{executableProposals?.length}</ItemValue>
                      </Grid>
                    </Item>
                  </Grid>
                </Grid>
              </Box>
            </DAOItemGrid>

            {data && cycleInfo && proposals && (
              <AllProposalsList title={"On-Chain"} currentLevel={cycleInfo.currentLevel} proposals={proposals} />
            )}
          </TabPanel>
          <TabPanel value={selectedTab} index={1}>
            <DAOItemGrid container justifyContent={isMobileSmall ? "center" : "flex-start"}>
              <DAOItemGrid container justifyContent={isMobileSmall ? "center" : "flex-start"}>
                <Box sx={{ flexGrow: 1, width: "inherit" }}>
                  <Grid container spacing={4}>
                    <Grid item xs={12} sm={6} md={4}>
                      <Item>
                        <ItemContent item container direction="row" alignItems="center">
                          <ItemTitle color="textPrimary">Active Proposals</ItemTitle>
                        </ItemContent>
                        <Grid item>
                          <ItemValue color="textPrimary">
                            {activeLiteProposals ? activeLiteProposals?.length : 0}
                          </ItemValue>
                        </Grid>
                      </Item>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Item>
                        <ItemContent item container direction="row" alignItems="center">
                          <ItemTitle color="textPrimary">Total Addresses</ItemTitle>
                        </ItemContent>
                        <Grid item>
                          <ItemValue color="textPrimary">{data?.liteDAOData?.votingAddressesCount}</ItemValue>
                        </Grid>
                      </Item>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Item>
                        <ItemContent item container direction="row" alignItems="center">
                          <ItemTitle color="textPrimary">Delegates</ItemTitle>
                        </ItemContent>
                        <Grid item>
                          <ItemValue color="textPrimary"> {0}</ItemValue>
                        </Grid>
                      </Item>
                    </Grid>
                  </Grid>
                </Box>
              </DAOItemGrid>
            </DAOItemGrid>
            {polls && polls.length > 0 ? <ProposalList polls={polls} id={id} daoId={daoId} /> : null}
          </TabPanel>
        </Grid>

        <ProposalActionsDialog open={openDialog} handleClose={handleCloseModal} />
        {proposals?.length === 0 && polls?.length === 0 ? (
          <Typography style={{ width: "inherit" }} color="textPrimary">
            0 proposals found
          </Typography>
        ) : null}
      </Grid>
    </>
  )
}
