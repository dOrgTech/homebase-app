import React, { useCallback, useEffect, useState } from "react"
import {
  Box,
  Button,
  Grid,
  makeStyles,
  styled,
  SvgIcon,
  Theme,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from "@material-ui/core"

import { useDAO } from "services/services/dao/hooks/useDAO"
import { useProposals } from "services/services/dao/hooks/useProposals"
import { useDAOID } from "../DAO/router"

import { ProposalSelectionMenuLambda } from "modules/explorer/components/ProposalSelectionMenuLambda"
import { useTezos } from "services/beacon/hooks/useTezos"
import { useUnstakeFromAllProposals } from "services/contracts/baseDAO/hooks/useUnstakeFromAllProposals"
import { ProposalStatus } from "services/services/dao/mappers/proposal/types"
import { MainButton } from "../../../common/MainButton"

import { ContentContainer } from "../../components/ContentContainer"
import { AllProposalsList } from "modules/explorer/components/AllProposalsList"
import { SmallButton } from "modules/common/SmallButton"
import { ProposalActionsDialog } from "modules/explorer/components/ProposalActionsDialog"
import { useFlush } from "services/contracts/baseDAO/hooks/useFlush"
import { useDropAllExpired } from "services/contracts/baseDAO/hooks/useDropAllExpired"
import { InfoIcon } from "modules/explorer/components/styled/InfoIcon"
import ProgressBar from "react-customizable-progressbar"
import { useTimeLeftInCycle } from "modules/explorer/hooks/useTimeLeftInCycle"

import { ReactComponent as ListIcon } from "assets/img/list-icon.svg"
import { ReactComponent as TezosIcon } from "assets/img/tezos-icon.svg"
import { ReactComponent as CycleIcon } from "assets/img/cycle-icon.svg"
import { ReactComponent as ChartIcon } from "assets/img/chart-icon.svg"
import { useIsProposalButtonDisabled } from "services/contracts/baseDAO/hooks/useCycleInfo"
import { ProposalList } from "modules/lite/explorer/components/ProposalList"
import { usePolls } from "modules/lite/explorer/hooks/usePolls"
import dayjs from "dayjs"

const ProposalInfoTitle = styled(Typography)({
  fontSize: "18px",
  fontWeight: 300,

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
  fontSize: "18px",

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

const LargeNumber = styled(Typography)(({ theme }) => ({
  fontSize: "36px",
  fontWeight: 300,
  color: theme.palette.text.primary,
  marginTop: "7px",

  ["@media (max-width:1030px)"]: {
    fontSize: "30px"
  }
}))

const ProgressContainer = styled(Box)({
  marginLeft: "-18px",
  marginBottom: "-5px",
  width: 80
})

const HeroContainer = styled(ContentContainer)(({ theme }) => ({
  padding: "38px 48px 38px 48px",
  display: "inline-flex",
  alignItems: "center",
  [theme.breakpoints.down("xs")]: {
    maxHeight: "fit-content"
  }
}))

const IconContainer = styled(SvgIcon)({
  width: "auto",
  height: 45,
  marginLeft: 48
})

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

const SubtitleText = styled(Grid)({
  marginTop: 40,
  marginBottom: -12
})

const ItemBox = styled(Grid)(({ theme }) => ({
  gap: 24,
  alignItems: "center",
  marginBottom: 16,
  [theme.breakpoints.down("sm")]: {
    justifyContent: "center",
    height: 150,
    textAlign: "center"
  }
}))

const styles = makeStyles((theme: Theme) => ({
  circleWidth: {
    "& .RCP": {
      width: "50px !important"
    },
    "& svg": {
      width: "60px !important",
      [theme.breakpoints.down("sm")]: {
        marginTop: -26
      }
    }
  },
  progressText: {
    [theme.breakpoints.down("sm")]: {
      marginTop: -40
    }
  }
}))

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
  const { hours, minutes, days } = useTimeLeftInCycle()

  const style = styles()

  const shouldDisable = useIsProposalButtonDisabled(daoId)

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

  const polls = usePolls(data?.liteDAOData?._id)
  const id = data?.liteDAOData?._id

  const activeLiteProposals = polls?.filter(p => Number(p.endTime) > dayjs().valueOf())

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
                      <InfoIcon style={{ height: 16 }} color="secondary" />
                    </Tooltip>
                  </Grid>

                  <Grid>
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
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                item
                container
                direction="row"
                alignItems="center"
                style={{ marginTop: 40 }}
                spacing={isMobileSmall ? 2 : 1}
              >
                <ItemBox item container xs={isMobileSmall ? 6 : 4}>
                  <ListIcon />
                  <Grid item>
                    <ProposalInfoTitle color="textPrimary">Cycle Status</ProposalInfoTitle>
                    <CycleTime color="secondary">{shouldDisable ? "Voting" : "Creating"} </CycleTime>
                  </Grid>
                </ItemBox>
                <ItemBox item container xs={isMobileSmall ? 6 : 4}>
                  <CycleIcon />
                  <Grid item>
                    <ProposalInfoTitle color="textPrimary">Current Cycle</ProposalInfoTitle>
                    <CycleTime color="secondary">{cycleInfo?.currentCycle}</CycleTime>
                  </Grid>
                </ItemBox>
                <ItemBox item container xs={isMobileSmall ? 6 : 4} className={style.circleWidth}>
                  <ProgressBar
                    progress={data ? ((blocksLeft || 0) / Number(data.data.period)) * 100 : 100}
                    radius={25}
                    strokeWidth={3}
                    strokeColor={theme.palette.secondary.main}
                    trackStrokeWidth={5}
                    trackStrokeColor={"rgba(125,140,139, 0.2)"}
                  />
                  <Grid item className={style.progressText}>
                    <ProposalInfoTitle color="textPrimary">Time Left in Cycle</ProposalInfoTitle>
                    <CycleTime color="secondary">
                      {" "}
                      {days}d {hours}h {minutes}m{" "}
                    </CycleTime>
                  </Grid>
                </ItemBox>
                <ItemBox item container xs={isMobileSmall ? 6 : 4}>
                  <TezosIcon />
                  <Grid item>
                    <ProposalInfoTitle color="textPrimary">Voting Addresses</ProposalInfoTitle>
                    <CycleTime color="secondary">{data?.data.ledger.length || "-"}</CycleTime>
                  </Grid>
                </ItemBox>
                <ItemBox item container xs={isMobileSmall ? 6 : 4}>
                  <ChartIcon />
                  <Grid item>
                    <ProposalInfoTitle color="textPrimary">Active Proposals</ProposalInfoTitle>
                    <CycleTime color="secondary">
                      {" "}
                      {Number(activeLiteProposals?.length) + Number(activeProposals?.length)}
                    </CycleTime>
                  </Grid>
                </ItemBox>
              </Grid>
            </Grid>
          </Grid>
        </HeroContainer>

        {data && cycleInfo && proposals && (
          <AllProposalsList title={"On-Chain"} currentLevel={cycleInfo.currentLevel} proposals={proposals} />
        )}
        <ProposalActionsDialog open={openDialog} handleClose={handleCloseModal} />
        {polls.length > 0 ? <ProposalList polls={polls} id={id} /> : null}

        {proposals?.length === 0 && polls?.length === 0 ? (
          <Typography style={{ width: "inherit" }} color="textPrimary">
            0 proposals found
          </Typography>
        ) : null}
      </Grid>
    </>
  )
}
