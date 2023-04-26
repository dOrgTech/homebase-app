import React, { useCallback, useState } from "react"
import { Box, Button, Grid, makeStyles, styled, Tooltip, Typography, useMediaQuery, useTheme } from "@material-ui/core"

import { useDAO } from "services/indexer/dao/hooks/useDAO"
import { useProposals } from "services/indexer/dao/hooks/useProposals"
import { useDAOID } from "../DAO/router"

import { ProposalStatus } from "services/indexer/dao/mappers/proposal/types"
import { ContentContainer } from "../../components/ContentContainer"
import { AllProposalsList } from "modules/explorer/components/AllProposalsList"
import { SmallButton } from "modules/common/SmallButton"
import { ProposalActionsDialog } from "modules/explorer/components/ProposalActionsDialog"
import { useFlush } from "services/contracts/baseDAO/hooks/useFlush"
import { useDropAllExpired } from "services/contracts/baseDAO/hooks/useDropAllExpired"
import { InfoIcon } from "modules/explorer/components/styled/InfoIcon"
import ProgressBar from "react-customizable-progressbar"

const ProposalInfoTitle = styled(Typography)({
  fontSize: "18px",

  ["@media (max-width:1155px)"]: {
    whiteSpace: "nowrap"
  },

  ["@media (max-width:1030px)"]: {
    fontSize: "16.3px",
    whiteSpace: "initial"
  },

  ["@media (max-width:830.99px)"]: {
    fontSize: "18px"
  },

  ["@media (max-width:409.99px)"]: {
    fontSize: "16px"
  }
})

const CycleTime = styled(Typography)(({ theme }) => ({
  fontWeight: 300,
  color: theme.palette.text.primary,
  fontSize: "20px",

  ["@media (max-width:1030px)"]: {
    fontSize: "16px"
  },

  ["@media (max-width:830.99px)"]: {
    fontSize: "20px"
  },

  ["@media (max-width:434px)"]: {
    fontSize: "18px"
  },

  ["@media (max-width:409.99px)"]: {
    fontSize: "15px"
  }
}))

const ProgressContainer = styled(Box)({
  marginLeft: "-18px",
  marginBottom: "-5px"
})

const HeroContainer = styled(ContentContainer)(({ theme }) => ({
  padding: "38px 0px 38px 38px",
  display: "inline-flex",
  alignItems: "center",
  [theme.breakpoints.down("xs")]: {
    maxHeight: "fit-content"
  }
}))

const TitleText = styled(Typography)({
  fontSize: 30,
  fontWeight: 500,
  lineHeight: 0.9,

  ["@media (max-width:1030px)"]: {
    fontSize: 25
  }
})

export const DropButton = styled(Button)({
  verticalAlign: "text-bottom",
  fontSize: "16px"
})

const styles = makeStyles({
  circleWidth: {
    "& .RCP": {
      width: 60
    },
    "& *": {
      width: 60
    }
  }
})

export const Proposals: React.FC = () => {
  const daoId = useDAOID()
  const { data, cycleInfo } = useDAO(daoId)
  const blocksLeft = cycleInfo && cycleInfo.blocksLeft

  const { data: proposals } = useProposals(daoId)
  const { data: activeProposals } = useProposals(daoId, ProposalStatus.ACTIVE)
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("xs"))
  const [openDialog, setOpenDialog] = useState(false)

  const { mutate } = useFlush()
  const { mutate: dropAllExpired } = useDropAllExpired()
  const { data: executableProposals } = useProposals(daoId, ProposalStatus.EXECUTABLE)
  const { data: expiredProposals } = useProposals(daoId, ProposalStatus.EXPIRED)

  const style = styles()

  const handleCloseModal = () => {
    setOpenDialog(false)
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
                  style={{ gap: 15 }}
                  direction={isMobileSmall ? "column" : "row"}
                  xs={isMobileSmall ? undefined : true}
                >
                  <SmallButton variant="contained" color="secondary" onClick={() => setOpenDialog(true)}>
                    New Proposal
                  </SmallButton>
                  <Grid>
                    <SmallButton
                      variant="contained"
                      color="secondary"
                      onClick={onFlush}
                      disabled={!executableProposals || !executableProposals.length}
                    >
                      Execute
                    </SmallButton>
                    <Tooltip placement="bottom" title="Execute all passed proposals and drop all expired or rejected">
                      <InfoIcon style={{ height: 18 }} color="secondary" />
                    </Tooltip>
                  </Grid>

                  <Grid>
                    <DropButton
                      variant="contained"
                      color="secondary"
                      onClick={onDropAllExpired}
                      disabled={!expiredProposals || !expiredProposals.length}
                    >
                      Drop All Expired
                    </DropButton>
                    <Tooltip placement="bottom" title="Drop all expired proposals">
                      <InfoIcon style={{ height: 18 }} color="secondary" />
                    </Tooltip>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item container direction="row">
              <Grid container wrap="nowrap">
                <Grid item>
                  <ProgressContainer>
                    <ProgressBar
                      progress={data ? ((blocksLeft || 0) / Number(data.data.period)) * 100 : 100}
                      radius={35}
                      strokeWidth={6}
                      strokeColor={theme.palette.secondary.main}
                      trackStrokeWidth={5}
                      trackStrokeColor={"rgba(125,140,139, 0.2)"}
                      className={style.circleWidth}
                    />
                  </ProgressContainer>
                </Grid>
                <Grid item>
                  <ProposalInfoTitle color="secondary">Current Cycle</ProposalInfoTitle>
                  <CycleTime color="textPrimary">{cycleInfo?.currentCycle}</CycleTime>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </HeroContainer>

        {data && cycleInfo && proposals && (
          <AllProposalsList title={"Proposals"} currentLevel={cycleInfo.currentLevel} proposals={proposals} />
        )}

        <ProposalActionsDialog open={openDialog} handleClose={handleCloseModal} />
      </Grid>
    </>
  )
}
