import React, { useMemo } from "react";
import { ReactComponent as VotingPeriodIcon } from "assets/logos/votingPeriod.svg";
import ProgressBar from "react-customizable-progressbar";
import {
  Box,
  Grid,
  styled,
  SvgIcon,
  LinearProgress,
  useTheme,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { ContentContainer } from "./ContentContainer";
import { CycleDescription } from "./CycleDescription";
import { useDAO } from "services/indexer/dao/hooks/useDAO";
import { useProposals } from "services/indexer/dao/hooks/useProposals";
import BigNumber from "bignumber.js";
import { ProposalStatus } from "services/indexer/dao/mappers/proposal/types";
import { useDAOID } from "../pages/DAO/router";

const StatsContainer = styled(ContentContainer)(({ theme }) => ({
  padding: "42px 55px",
  [theme.breakpoints.down("xs")]: {
    padding: "42px 25px",
    width: "100%"
  },
}));

const LockedTokensBar = styled(LinearProgress)(({ theme }) => ({
  width: "100%",
  "&.MuiLinearProgress-colorSecondary": {
    background: theme.palette.primary.light,
  },
}));

const IconContainer = styled(SvgIcon)({
  width: 58,
  height: 64,
});

const ProgressContainer = styled(Box)({
  marginLeft: "-18px",
});

export const DAOStatsRow: React.FC = () => {
  const daoId = useDAOID();
  const { data, cycleInfo, ledger } = useDAO(daoId);

  const symbol = data && data.data.token.symbol.toUpperCase();
  const blocksLeft = cycleInfo && cycleInfo.blocksLeft;
  const theme = useTheme();
  const isExtraSmall = useMediaQuery(theme.breakpoints.down("xs"));
  const { data: activeProposals } = useProposals(daoId, ProposalStatus.ACTIVE);

  const amountLocked = useMemo(() => {
    if (!ledger) {
      return new BigNumber(0);
    }

    return ledger.reduce((acc, current) => {
      const frozenBalance =
        new BigNumber(current.total_balance) || new BigNumber(0);
      return acc.plus(frozenBalance);
    }, new BigNumber(0));
  }, [ledger]);

  const amountNotLocked = useMemo(() => {
    if (!data) {
      return new BigNumber(0);
    }

    return data.data.token.supply;
  }, [data]);

  const totalTokens = amountLocked.plus(amountNotLocked);

  const amountLockedPercentage = totalTokens
    ? amountLocked.div(totalTokens).multipliedBy(100)
    : new BigNumber(0);

  return (
    <Grid item>
      <Grid container style={{ gap: isExtraSmall? 25: 47 }}>
        <StatsContainer item xs>
          <Grid container direction="column" style={{ gap: 24 }}>
            <Grid item>
              <CycleDescription daoAddress={daoId} />
            </Grid>
            <Grid item>
              <Grid container style={{ gap: 16 }} wrap="nowrap">
                <Grid item>
                  <ProgressContainer>
                    <ProgressBar
                      progress={
                        data
                          ? ((blocksLeft || 0) / Number(data.data.period)) * 100
                          : 100
                      }
                      radius={24}
                      strokeWidth={4.5}
                      strokeColor={theme.palette.secondary.main}
                      trackStrokeWidth={3}
                      trackStrokeColor={theme.palette.primary.light}
                    />
                  </ProgressContainer>
                </Grid>
                <Grid item>
                  <Typography color="secondary" variant="body1">
                    Current Cycle
                  </Typography>
                  <Typography color="textPrimary" variant="h1">
                    {cycleInfo?.currentCycle}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container style={{ gap: 32 }} wrap="nowrap">
                <Grid item>
                  <IconContainer>
                    <VotingPeriodIcon />
                  </IconContainer>
                </Grid>
                <Grid item>
                  <Typography color="secondary" variant="body1">
                    Blocks Left In Cycle
                  </Typography>
                  <Typography color="textPrimary" variant="h1">
                    {cycleInfo?.blocksLeft}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </StatsContainer>
        <StatsContainer item xs>
          <Grid container direction="column" style={{ gap: 37 }}>
            <Grid item>
              <Grid container direction="column" style={{ gap: 10 }}>
                <Grid item>
                  <Typography color="secondary" variant="body1">
                    {symbol} Locked
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h5" color="textPrimary">
                    {amountLocked.dp(10).toString()}
                  </Typography>
                </Grid>
                <Grid item>
                  <LockedTokensBar
                    variant="determinate"
                    value={amountLockedPercentage.toNumber()}
                    color="secondary"
                  />
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
                  <Typography
                    align={isExtraSmall ? "center" : "left"}
                    color="secondary"
                    variant="body1"
                  >
                    Voting Addresses
                  </Typography>
                  <Typography
                    align={isExtraSmall ? "center" : "left"}
                    variant="h5"
                    color="textPrimary"
                  >
                    {data?.data.ledger.length || "-"}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography
                    align={isExtraSmall ? "center" : "left"}
                    color="secondary"
                    variant="body1"
                  >
                    Active Proposals
                  </Typography>
                  <Typography
                    align={isExtraSmall ? "center" : "left"}
                    variant="h5"
                    color="textPrimary"
                  >
                    {activeProposals?.length}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </StatsContainer>
      </Grid>
    </Grid>
  );
};
