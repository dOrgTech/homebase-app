import React, { useCallback, useMemo } from "react";
import {
  Box,
  Grid,
  styled,
  Typography,
  useTheme,
  Button,
  SvgIcon,
  LinearProgress,
} from "@material-ui/core";
import { ReactComponent as VotingPeriodIcon } from "assets/logos/votingPeriod.svg";
import ProgressBar from "react-customizable-progressbar";
import { useFlush } from "services/contracts/baseDAO/hooks/useFlush";
import { useDAO } from "services/indexer/dao/hooks/useDAO";
import { useProposals } from "services/indexer/dao/hooks/useProposals";
import { useDAOID } from "./router";
import { ProposalStatus } from "services/indexer/dao/mappers/proposal/types";
import BigNumber from "bignumber.js";
import { ProposalItem } from "modules/explorer/pages/User";
import { CycleDescription } from "../../components/CycleDescription";
import { UserBadge } from "modules/explorer/components/UserBadge";
import { UserBalancesBox } from "../../components/UserBalances";
import { Link } from "react-router-dom";
import { ContentContainer } from "../../components/ContentContainer";

const IconContainer = styled(SvgIcon)({
  width: 58,
  height: 64,
});

const ProgressContainer = styled(Box)({
  marginLeft: "-18px",
});

const HeroContainer = styled(ContentContainer)({
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

const StatsContainer = styled(ContentContainer)({
  padding: "42px 55px",
});

const LockedTokensBar = styled(LinearProgress)(({ theme }) => ({
  width: "100%",
  "&.MuiLinearProgress-colorSecondary": {
    background: theme.palette.primary.light,
  },
}));

const TableContainer = styled(ContentContainer)({
  width: "100%",
});

const TableHeader = styled(Grid)({
  minHeight: 76,
  padding: "24px 54px",
});

const HolderTableItem = styled(Grid)({
  padding: "30px 54px",
  borderTop: `0.3px solid #5E6969`,
});

const TableSubHeader = styled(Grid)({
  padding: "10px 54px",
  borderTop: `0.3px solid #5E6969`,
});

const ProposalsFooter = styled(Grid)({
  borderTop: `0.3px solid #5E6969`,
  minHeight: 60,
});

export const DAO: React.FC = () => {
  const daoId = useDAOID();
  const { data, cycleInfo, ledger } = useDAO(daoId);
  const { mutate } = useFlush();

  console.log(data?.data.address, ledger);

  const name = data && data.data.name;
  const description = data && data.data.description;
  const symbol = data && data.data.token.symbol.toUpperCase();
  const blocksLeft = cycleInfo && cycleInfo.blocksLeft;
  const theme = useTheme();
  const { data: proposals } =
    useProposals(daoId);
  const { data: activeProposals } =
    useProposals(daoId, ProposalStatus.ACTIVE);

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
      <UserBalancesBox daoId={daoId} />
      <Grid item>
        <Grid container style={{ gap: 47 }}>
          <StatsContainer item>
            <Grid container direction="column" style={{ gap: 32 }}>
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
          <Grid item container>
            {cycleInfo &&
              data &&
              proposals?.map((p, i) => (
                <Grid item xs={12} key={`proposal-${i}`}>
                  <Link to={`proposal/${p.id}`}>
                    <ProposalItem
                      proposal={p}
                      status={p.getStatus(cycleInfo.currentLevel).status}
                    />
                  </Link>
                </Grid>
              ))}
          </Grid>
          <ProposalsFooter
            item
            container
            direction="column"
            justifyContent="center"
          >
            <Grid item>
              <Link to="proposals">
                <Typography color="secondary" align="center">
                  View All Proposals
                </Typography>
              </Link>
            </Grid>
          </ProposalsFooter>
        </Grid>
      </TableContainer>
      <TableContainer item container direction="column">
          <TableHeader item>
            <Typography variant="body1" color="textPrimary">
              Top Adresses
            </Typography>
          </TableHeader>

          <TableSubHeader item container justifyContent="space-between">
            <Grid item sm={4}>
              <Typography color="textPrimary">Rank</Typography>
            </Grid>
            <Grid item sm={2}>
              <Typography color="textPrimary">Votes</Typography>
            </Grid>
            <Grid item sm={2}>
              <Typography color="textPrimary">Weight</Typography>
            </Grid>
            <Grid item sm={4}>
              <Typography color="textPrimary">Proposals Voted</Typography>
            </Grid>
          </TableSubHeader>

          <Grid item>
            <Grid container>
              {cycleInfo &&
                ledger &&
                data &&
                ledger
                  ?.sort((a, b) =>
                    b.available_balance.minus(a.available_balance).toNumber()
                  )
                  .map((p, i) => (
                    <Grid item key={`holder-${i}`} xs={12}>
                      <HolderTableItem container>
                        <Grid item sm={4}>
                          <Grid
                            container
                            alignItems="center"
                            style={{ gap: 21 }}
                            wrap="nowrap"
                          >
                            <Grid item>
                              <Typography color="secondary">{i + 1}</Typography>
                            </Grid>
                            <Grid item>
                              <UserBadge
                                address={p.holder.address}
                                size={44}
                                gap={16}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item sm={2}>
                          <Typography color="textPrimary">
                            {p.holder.votes_cast.toString()}
                          </Typography>
                        </Grid>
                        <Grid item sm={2}>
                          <Typography color="textPrimary">
                            {p.available_balance
                              .multipliedBy(100)
                              .div(data.data.token.supply)
                              .decimalPlaces(2)
                              .toString()}{" "}
                            %
                          </Typography>
                        </Grid>
                        <Grid item sm={4}>
                          <Typography color="textPrimary">
                            {p.holder.proposals_voted.toString()}
                          </Typography>
                        </Grid>
                      </HolderTableItem>
                    </Grid>
                  ))}
            </Grid>
          </Grid>
      </TableContainer>
    </Grid>
  );
};
