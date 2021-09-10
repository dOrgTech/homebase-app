import React, { useCallback, useMemo } from "react";
import {
  Box,
  Grid,
  styled,
  Typography,
  useTheme,
  Tooltip,
  useMediaQuery,
  Button,
  SvgIcon,
  LinearProgress,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { ReactComponent as VotingPeriodIcon } from "assets/logos/votingPeriod.svg";
import ProgressBar from "react-customizable-progressbar";
import { useFlush } from "services/contracts/baseDAO/hooks/useFlush";
import { CopyAddress } from "modules/common/CopyAddress";
import { useDAO } from "services/indexer/dao/hooks/useDAO";
import { useProposals } from "services/indexer/dao/hooks/useProposals";
import { useDAOID } from "./router";
import { FreezeDialog } from "modules/explorer/components/FreezeDialog";
import { ProposalsTable } from "modules/explorer/components/ProposalsTable";
import { InfoIcon } from "modules/explorer/components/styled/InfoIcon";
import { MobileHeader } from "modules/explorer/components/styled/MobileHeader";
import { RectangleContainer } from "modules/explorer/components/styled/RectangleHeader";
import { PeriodLabel } from "modules/explorer/components/styled/VotingLabel";
import { TopHoldersTable } from "modules/explorer/components/TopHoldersTable";
import { ProposalStatus } from "services/indexer/dao/mappers/proposal/types";
import { DAOStatsRow } from "modules/explorer/components/DAOStatsRow";
import BigNumber from "bignumber.js";
import { ProposalItem } from "modules/explorer/pages/User";

const IconContainer = styled(SvgIcon)({
  width: 58,
  height: 64,
});

const ProgressContainer = styled(Box)({
  marginLeft: "-18px",
});

const Container = styled(Grid)(({ theme }) => ({
  borderRadius: 8,
  background: theme.palette.primary.main,
}));

const HeroContainer = styled(Container)({
  padding: "38px 55px",
});

const TitleText = styled(Typography)({
  fontSize: 64,
  fontWeight: 500,
});

const SubtitleText = styled(Typography)({
  fontWeight: 400,
});

const ExecuteButton = styled(Button)({
  marginTop: "-35px",
});

const StatsContainer = styled(Container)({
  padding: "42px 55px",
});

const LockedTokensBar = styled(LinearProgress)(({ theme }) => ({
  width: "100%",
  "&.MuiLinearProgress-colorSecondary": {
    background: theme.palette.primary.light,
  },
}));

const TableContainer = styled(Container)({
  width: "100%",
});

const TableHeader = styled(Grid)({
  minHeight: 76,
  padding: "24px 54px",
});

export const DAO: React.FC = () => {
  const history = useHistory();
  const daoId = useDAOID();
  const { data, isLoading: isDaoLoading, cycleInfo, ledger } = useDAO(daoId);
  const { mutate } = useFlush();

  const name = data && data.data.name;
  const description = data && data.data.description;
  const symbol = data && data.data.token.symbol.toUpperCase();
  const blocksLeft = cycleInfo && cycleInfo.blocksLeft;
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("xs"));
  const { data: proposals, isLoading: isProposalsLoading } =
    useProposals(daoId);
  const { data: activeProposals, isLoading: isActiveProposalsLoading } =
    useProposals(daoId, ProposalStatus.ACTIVE);
  const isLoading = isDaoLoading || isProposalsLoading;

  const onFlush = useCallback(async () => {
    if (proposals && proposals.length && data) {
      mutate({
        dao: data,
        numOfProposalsToFlush: proposals.length + 1,
      });
      return;
    }
  }, [data, mutate, proposals]);

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
    <Grid container direction="column" style={{ gap: 42 }}>
      <HeroContainer item>
        <Grid container direction="column" style={{ gap: 36 }}>
          <Grid item>
            <Grid container style={{ gap: 20 }} alignItems="baseline">
              <Grid item>
                <TitleText color="textPrimary">{name}</TitleText>
              </Grid>
              <Grid item>
                <ExecuteButton
                  variant="contained"
                  color="secondary"
                  onClick={onFlush}
                >
                  Execute
                </ExecuteButton>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <SubtitleText variant="body1" color="textPrimary">
              {description}
            </SubtitleText>
          </Grid>
        </Grid>
      </HeroContainer>
      <Grid item>
        <Grid container style={{ gap: 47 }}>
          <StatsContainer item>
            <Grid container direction="column" style={{ gap: 32 }}>
              <Grid item>
                <Grid container style={{ gap: 16 }} wrap="nowrap">
                  <Grid item>
                    <ProgressContainer>
                      <ProgressBar
                        progress={
                          data
                            ? ((blocksLeft || 0) / Number(data.data.period)) *
                              100
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
                    <Typography color="textPrimary" variant="subtitle1">
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
                      Levels Left In Cycle
                    </Typography>
                    <Typography color="textPrimary" variant="subtitle1">
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
                    <Typography variant="h3" color="textPrimary">
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
                <Grid container style={{ gap: 80 }}>
                  <Grid item>
                    <Typography color="secondary" variant="body1">
                      Voting Addresses
                    </Typography>
                    <Typography variant="h1" color="textPrimary">
                      {data?.data.ledger.length || "-"}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography color="secondary" variant="body1">
                      Active Proposals
                    </Typography>
                    <Typography variant="h1" color="textPrimary">
                      {activeProposals?.length}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </StatsContainer>
        </Grid>
      </Grid>
      <TableContainer item>
        <Grid container direction="column">
          <TableHeader item>
            <Typography variant="body1" color="textPrimary">
              Active Proposals
            </Typography>
          </TableHeader>
          <Grid item>
            <Grid container>
              {cycleInfo &&
                proposals?.map((p, i) => (
                  <Grid item key={`proposal-${i}`} xs={12}>
                    <ProposalItem
                      proposal={p}
                      status={p.getStatus(cycleInfo.currentLevel).status}
                    />
                  </Grid>
                ))}
            </Grid>
          </Grid>
          <Grid item>
            <TableHeader item>
              <Typography variant="body1" color="textPrimary">
                Top Adresses
              </Typography>
            </TableHeader>
          </Grid>
        </Grid>
      </TableContainer>
      <TableContainer item>
        <Grid container direction="column">
          <TableHeader item>
            <Typography variant="body1" color="textPrimary">
              Top Adresses
            </Typography>
          </TableHeader>
          <Grid item>
            <Grid container>
              {cycleInfo &&
                proposals?.map((p, i) => (
                  <Grid item key={`proposal-${i}`} xs={12}>
                    <ProposalItem
                      proposal={p}
                      status={p.getStatus(cycleInfo.currentLevel).status}
                    />
                  </Grid>
                ))}
            </Grid>
          </Grid>
        </Grid>
      </TableContainer>
    </Grid>
  );
};
