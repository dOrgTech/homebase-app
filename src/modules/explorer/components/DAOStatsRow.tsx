import React, { useMemo } from "react"
import { ReactComponent as VotingPeriodIcon } from "assets/logos/votingPeriod.svg"
import ProgressBar from "react-customizable-progressbar"
import {
  Box,
  Grid,
  styled,
  SvgIcon,
  LinearProgress,
  useTheme,
  Typography,
  useMediaQuery,
  Paper
} from "@material-ui/core"
import { ContentContainer } from "./ContentContainer"
import { CycleDescription } from "./CycleDescription"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { useProposals } from "services/services/dao/hooks/useProposals"
import BigNumber from "bignumber.js"
import { ProposalStatus } from "services/services/dao/mappers/proposal/types"
import { useDAOID } from "../pages/DAO/router"
import { useTimeLeftInCycle } from "../hooks/useTimeLeftInCycle"
import { usePolls } from "modules/lite/explorer/hooks/usePolls"
import dayjs from "dayjs"
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"
import FiberSmartRecordIcon from "@mui/icons-material/FiberSmartRecord"
import LockIcon from "@mui/icons-material/Lock"
import HowToVoteIcon from "@mui/icons-material/HowToVote"
import PaletteIcon from "@mui/icons-material/Palette"
import { ReactComponent as TzIcon } from "assets/img/tz_circle.svg"
import { formatNumber } from "../utils/FormatNumber"
import { useDAOHoldings } from "services/contracts/baseDAO/hooks/useDAOHoldings"

const StatsContainer = styled(ContentContainer)(({ theme }) => ({
  padding: "38px 38px",
  maxHeight: "310px",

  ["@media (max-width:1030px)"]: {
    maxHeight: "303px"
  },

  ["@media (max-width:831px)"]: {
    minWidth: "99%"
  },

  ["@media (max-width:390px)"]: {
    maxHeight: "340px"
  }
}))

const LockedTokensBar = styled(LinearProgress)(({ theme }) => ({
  "width": "100%",
  "height": "8px",
  "marginTop": "15px",
  "marginBottom": "43px",
  "&.MuiLinearProgress-colorSecondary": {
    background: theme.palette.primary.light
  },

  ["@media (max-width:1030px)"]: {
    marginTop: "13px",
    marginBottom: "40px"
  }
}))

const IconContainer = styled(SvgIcon)({
  width: "auto",
  height: 64
})

const ProgressContainer = styled(Box)({
  marginLeft: "-18px",
  marginTop: "-20px",
  marginBottom: "-5px"

  // ["@media (max-width:1030px)"]: {
  //   marginBottom: "-7px"
  // },
})

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

const LargeNumber = styled(Typography)(({ theme }) => ({
  fontSize: "36px",
  fontWeight: 300,
  color: theme.palette.text.primary,
  marginTop: "7px",

  ["@media (max-width:1030px)"]: {
    fontSize: "30px"
  }
}))

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

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
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

const ItemTitle = styled(Typography)({
  fontSize: 18,
  fontWeight: 600
})

const ItemValue = styled(Typography)({
  fontSize: 36,
  fontWeight: 300
})

const Percentage = styled(Typography)({
  fontSize: 18,
  fontWeight: 300,
  marginLeft: 78,
  marginTop: 20,
  position: "absolute"
})

export const DAOStatsRow: React.FC = () => {
  const daoId = useDAOID()
  const { data, cycleInfo, ledger } = useDAO(daoId)

  const symbol = data && data.data.token.symbol.toUpperCase()
  const blocksLeft = cycleInfo && cycleInfo.blocksLeft
  const theme = useTheme()
  const isExtraSmall = useMediaQuery(theme.breakpoints.down("xs"))
  const { data: activeProposals } = useProposals(daoId, ProposalStatus.ACTIVE)
  const { hours, minutes, days } = useTimeLeftInCycle()
  const { data: polls } = usePolls(data?.liteDAOData?._id)
  const activeLiteProposals = polls?.filter(p => Number(p.endTime) > dayjs().valueOf())
  const { tokenHoldings } = useDAOHoldings(daoId)

  const amountLocked = useMemo(() => {
    if (!ledger) {
      return new BigNumber(0)
    }

    return ledger.reduce((acc, current) => {
      const frozenBalance = new BigNumber(current.total_balance) || new BigNumber(0)
      return acc.plus(frozenBalance)
    }, new BigNumber(0))
  }, [ledger])

  const amountNotLocked = useMemo(() => {
    if (!data) {
      return new BigNumber(0)
    }

    return data.data.token.supply
  }, [data])

  const totalTokens = amountLocked.plus(amountNotLocked)

  const amountLockedPercentage = totalTokens ? amountLocked.div(totalTokens).multipliedBy(100) : new BigNumber(0)

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={4}>
        <Grid item xs={4}>
          <Item>
            <ItemContent item container direction="row" alignItems="center">
              <AccountBalanceWalletIcon color="secondary" />
              <ItemTitle color="textPrimary">Total {symbol}</ItemTitle>
            </ItemContent>
            <Grid item>
              <ItemValue color="textPrimary">{formatNumber(totalTokens)}</ItemValue>
            </Grid>
          </Item>
        </Grid>
        <Grid item xs={4}>
          <Item>
            <ItemContent item container direction="row" alignItems="center">
              <TzIcon color="secondary" />
              <ItemTitle color="textPrimary">Voting Addresses</ItemTitle>
            </ItemContent>
            <Grid item>
              <ItemValue color="textPrimary">{data?.data.ledger.length || "-"}</ItemValue>
            </Grid>
          </Item>
        </Grid>
        <Grid item xs={4}>
          <Item>
            <ItemContent item container direction="row" alignItems="center">
              <FiberSmartRecordIcon color="secondary" style={{ transform: "rotate(180deg)" }} />
              <ItemTitle color="textPrimary">Tokens</ItemTitle>
            </ItemContent>
            <Grid item>
              <ItemValue color="textPrimary">{tokenHoldings.length || "-"}</ItemValue>
            </Grid>
          </Item>
        </Grid>
        <Grid item xs={4}>
          <Item>
            <ItemContent item container direction="row" alignItems="center">
              <LockIcon color="secondary" /> <ItemTitle color="textPrimary">{symbol} Locked</ItemTitle>
            </ItemContent>
            <Grid item container direction="row">
              <ItemValue color="textPrimary">{formatNumber(amountLocked)}</ItemValue>
              <Percentage color="textPrimary">{formatNumber(amountLockedPercentage)}%</Percentage>
            </Grid>
          </Item>
        </Grid>
        <Grid item xs={4}>
          <Item>
            <ItemContent item container direction="row" alignItems="center">
              <HowToVoteIcon color="secondary" />
              <ItemTitle color="textPrimary">Active Proposals</ItemTitle>
            </ItemContent>
            <Grid item>
              <ItemValue color="textPrimary">
                {" "}
                {activeLiteProposals
                  ? Number(activeProposals?.length) + Number(activeLiteProposals?.length)
                  : Number(activeProposals?.length)}
              </ItemValue>
            </Grid>
          </Item>
        </Grid>
        <Grid item xs={4}>
          <Item>
            <ItemContent item container direction="row" alignItems="center">
              <PaletteIcon color="secondary" />
              <ItemTitle color="textPrimary">NFTs</ItemTitle>
            </ItemContent>
            <Grid item>
              <ItemValue color="textPrimary"></ItemValue>
            </Grid>
          </Item>
        </Grid>
        {/* <StatsContainer item xs>
          <Grid container direction="column" style={{ gap: 24, marginTop: "-3px" }}>
            <Grid item>
              <CycleDescription daoAddress={daoId} />
            </Grid>
            <Grid item>
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
                    />
                  </ProgressContainer>
                </Grid>
                <Grid item>
                  <ProposalInfoTitle color="secondary">Current Cycle</ProposalInfoTitle>
                  <CycleTime color="textPrimary">{cycleInfo?.currentCycle}</CycleTime>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container style={{ gap: 28 }} wrap="nowrap">
                <Grid item>
                  <IconContainer>
                    <VotingPeriodIcon />
                  </IconContainer>
                </Grid>
                <Grid item>
                  <ProposalInfoTitle color="secondary" style={{ marginTop: "-6px" }}>
                    Time Left In Cycle
                  </ProposalInfoTitle>
                  <CycleTime>
                    {days}d {hours}h {minutes}m ({cycleInfo?.blocksLeft} blocks)
                  </CycleTime>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </StatsContainer> */}
        {/* <StatsContainer item xs>
          <Grid container direction="column" style={{ marginTop: "-3px" }}>
            <Grid item>
              <Grid container direction="column">
                <Grid item>
                  <ProposalInfoTitle color="secondary">{symbol} Locked</ProposalInfoTitle>
                </Grid>
                <Grid item>
                  <LargeNumber>{amountLocked.dp(10, 1).toString()}</LargeNumber>
                </Grid>
                <Grid item>
                  <LockedTokensBar variant="determinate" value={amountLockedPercentage.toNumber()} color="secondary" />
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid
                container
                style={{ gap: isExtraSmall ? 10 : 50 }}
                wrap="nowrap"
                justifyContent={isExtraSmall ? "space-between" : "flex-start"}
              >
                <Grid item>
                  <ProposalInfoTitle color="secondary">Voting Addresses</ProposalInfoTitle>
                  <LargeNumber>{data?.data.ledger.length || "-"}</LargeNumber>
                </Grid>
                <Grid item>
                  <ProposalInfoTitle color="secondary">Active Proposals</ProposalInfoTitle>
                  <LargeNumber color="textPrimary">
                    {activeLiteProposals
                      ? Number(activeProposals?.length) + Number(activeLiteProposals?.length)
                      : Number(activeProposals?.length)}
                  </LargeNumber>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </StatsContainer> */}
      </Grid>
    </Box>
  )
}
