import React, { useCallback, useMemo } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  styled,
  Typography,
  useTheme,
  Tooltip,
  useMediaQuery,
} from "@material-ui/core";
import Timer from "react-compound-timer";
import { useHistory, useParams } from "react-router-dom";

import VotingPeriodIcon from "assets/logos/votingPeriod.svg";
import { ProposalTableRow } from "modules/explorer/components/ProposalTableRow";
import { TopHoldersTableRow } from "modules/explorer/components/TokenHolders";
import ProgressBar from "react-customizable-progressbar";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import { useProposals } from "services/contracts/baseDAO/hooks/useProposals";
import { ProposalStatus } from "services/bakingBad/proposals/types";
import { useCycleInfo } from "services/contracts/baseDAO/hooks/useCycleInfo";
import { useTokenHoldersWithVotes } from "services/contracts/baseDAO/hooks/useTokenHoldersWithVotes";
import { connectIfNotConnected } from "services/contracts/utils";
import { useFlush } from "services/contracts/baseDAO/hooks/useFlush";
import { Info } from "@material-ui/icons";
import { useTezos } from "services/beacon/hooks/useTezos";
import { CopyAddress } from "modules/common/CopyAddress";
import { ResponsiveTableContainer } from "../components/ResponsiveTable";
import { DAOStatsRow } from "../components/DAOStatsRow";

const MainContainer = styled(Grid)(({ theme }) => ({
  minHeight: 325,
  padding: "40px 8%",
  borderBottom: `2px solid ${theme.palette.primary.light}`,
}));

const LoaderContainer = styled(Grid)({
  paddingTop: 40,
  paddingBottom: 40,
});

const DAOInfoTitleAndDesc = styled(Grid)({
  maxWidth: 600,
  marginBottom: 40,
});

const DAOInfoVotingPeriod = styled(Grid)(({ theme }) => ({
  minWidth: 320,
  [theme.breakpoints.down("sm")]: {
    minWidth: "unset",
  },
}));

const BigIconContainer = styled(Box)({
  width: 112,

  "& > img": {
    display: "block",
    margin: "auto",
  },
});

const TableHeader = styled(Grid)(({ theme }) => ({
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  paddingBottom: 20,
}));

const UnderlineText = styled(Typography)(({ theme }) => ({
  textDecoration: "underline",
  cursor: "pointer",
  marginBottom: 28,
  [theme.breakpoints.down("sm")]: {
    marginTop: 28,
  },
}));

const CustomH1 = styled(Typography)(({ theme }) => ({
  fontSize: 55,
  lineHeight: "92px",
  textDecoration: "underline",
  fontWeight: 400,
  [theme.breakpoints.down("sm")]: {
    fontSize: 38,
    lineHeight: "68px",
    paddingRight: "5vw",
  },
}));

const NoProposals = styled(Typography)({
  marginTop: 20,
  marginBottom: 20,
});

const ProposalTableHeadItem = styled(Typography)({
  fontWeight: "bold",
});

const StyledButton = styled(Button)(({ theme }) => ({
  height: 53,
  color: theme.palette.text.secondary,
  borderColor: theme.palette.secondary.main,
  minWidth: 171,
}));

const ProposalTableHeadText: React.FC = ({ children }) => (
  <Typography variant="subtitle1" color="textSecondary">
    {children}
  </Typography>
);

const InfoIconInput = styled(Info)({
  cursor: "default",
  top: 0,
  fontSize: 20,
  marginLeft: 6,
});

const FlushContainer = styled(Grid)({
  display: "flex",
  paddingTop: 15,
});

export const DAO: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading: isDaoLoading } = useDAO(id);
  const { data: members } = useTokenHoldersWithVotes(id);
  const { mutate } = useFlush();
  const { tezos, connect } = useTezos();

  const name = data && data.metadata.unfrozenToken.name;
  const description = data && data.metadata.description;
  const symbol = data && data.metadata.unfrozenToken.symbol.toUpperCase();
  const template = data && data.template;

  const votingPeriod = data && data.storage.votingPeriod;
  const originationTime = data && data.originationTime;
  const cycleInfo = useCycleInfo(originationTime, votingPeriod);
  const time = cycleInfo && cycleInfo.time;
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const { data: proposals, isLoading: isProposalsLoading } = useProposals(
    data ? data.address : ""
  );
  const {
    data: activeProposals,
    isLoading: isActiveProposalsLoading,
  } = useProposals(data ? data.address : "", ProposalStatus.ACTIVE);
  const isLoading =
    isDaoLoading || isProposalsLoading || isActiveProposalsLoading;

  const formattedMembers = useMemo(() => {
    if (!members) {
      return [];
    }
    return members
      .map((member) => {
        return {
          username: member.address,
          weight: member.balances[0].toString(),
          votes: member.votes.toString(),
          proposals_voted: member.proposalsVoted,
        };
      })
      .sort((a, b) => Number(b.weight) - Number(a.weight));
  }, [members]);

  const onFlush = useCallback(async () => {
    await connectIfNotConnected(tezos, connect);
    // @TODO: we need to add an atribute to the proposals
    // type in order to know if it was flushed or not
    if (proposals && proposals.length && data) {
      mutate({
        dao: data,
        numOfProposalsToFlush: proposals.length + 1,
      });
      return;
    }
  }, [connect, data, mutate, proposals, tezos]);

  return (
    <>
      {!isLoading ? (
        <Grid item xs>
          <MainContainer container justify="space-between">
            <DAOInfoTitleAndDesc item>
              <Box>
                <Typography variant="subtitle2" color="secondary">
                  {symbol}
                  {` > `}
                  {template === "registry" ? "REGISTRY" : "TREASURY"}
                </Typography>
              </Box>
              <Grid container style={{ height: "100%" }}>
                <Grid item>
                  <Box paddingBottom="10px">
                    <CustomH1 color="textSecondary">{name}</CustomH1>
                  </Box>
                  <Box>
                    <Typography variant="body1" color="textSecondary">
                      {description}
                    </Typography>
                  </Box>

                  {data && <CopyAddress address={data.address} />}

                  <FlushContainer item>
                    <StyledButton
                      variant="outlined"
                      onClick={onFlush}
                      disabled={!data}
                    >
                      FLUSH
                    </StyledButton>
                    <Tooltip title="Execute all passed proposals and drop all expired or rejected">
                      <InfoIconInput color="secondary" />
                    </Tooltip>
                  </FlushContainer>
                </Grid>
              </Grid>
            </DAOInfoTitleAndDesc>
            <DAOInfoVotingPeriod item>
              <Box paddingBottom="32px">
                <Grid container>
                  {!isMobileSmall && (
                    <Grid item>
                      <BigIconContainer>
                        <img src={VotingPeriodIcon} />
                      </BigIconContainer>
                    </Grid>
                  )}

                  <Grid item>
                    <Box paddingLeft={!isMobileSmall ? "35px" : 0}>
                      <Box>
                        <Typography variant="subtitle2" color="secondary">
                          CURRENT CYCLE
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="h3" color="textSecondary">
                          {cycleInfo?.current}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <Box paddingBottom="32px">
                <Grid container>
                  {!isMobileSmall && (
                    <Grid item>
                      <BigIconContainer
                        width={80}
                        height={80}
                        marginTop={"-21px"}
                      >
                        <ProgressBar
                          progress={
                            data
                              ? ((time || 0) / data.storage.votingPeriod) * 100
                              : 100
                          }
                          radius={35}
                          strokeWidth={7}
                          strokeColor={theme.palette.secondary.main}
                          trackStrokeWidth={4}
                          trackStrokeColor={theme.palette.primary.light}
                        />
                      </BigIconContainer>
                    </Grid>
                  )}
                  <Grid item>
                    <Box paddingLeft={!isMobileSmall ? "35px" : 0}>
                      <Box>
                        <Typography variant="subtitle2" color="secondary">
                          TIME LEFT TO VOTE
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="h3" color="textSecondary">
                          {time ? (
                            <Timer
                              initialTime={time * 1000}
                              direction="backward"
                            >
                              {({ reset }: { reset: () => void }) => {
                                if (time * 1000 < 1) {
                                  reset();
                                }

                                return (
                                  <React.Fragment>
                                    <Box>
                                      <Timer.Days />d <Timer.Hours />h{" "}
                                      <Timer.Minutes />m <Timer.Seconds />s
                                    </Box>
                                  </React.Fragment>
                                );
                              }}
                            </Timer>
                          ) : null}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </DAOInfoVotingPeriod>
          </MainContainer>
          <DAOStatsRow />
          <ResponsiveTableContainer>
            <TableHeader container wrap="nowrap">
              <Grid item xs={4}>
                <ProposalTableHeadText>ACTIVE PROPOSALS</ProposalTableHeadText>
              </Grid>
              <Grid item xs={2}>
                <ProposalTableHeadItem color="textSecondary" align="center">
                  CYCLE
                </ProposalTableHeadItem>
              </Grid>
              <Grid item xs={3}>
                {/* <ProposalTableHeadText>STATUS</ProposalTableHeadText> */}
              </Grid>
              <Grid item xs={3}>
                <ProposalTableHeadText>THRESHOLD %</ProposalTableHeadText>
              </Grid>
            </TableHeader>
            {activeProposals.length > 0 &&
              activeProposals.map((proposal, i) => (
                <ProposalTableRow
                  key={`proposal-${i}`}
                  {...proposal}
                  daoId={data?.address}
                  quorumTreshold={data?.storage.quorumTreshold || 0}
                />
              ))}
            {activeProposals.length === 0 ? (
              <NoProposals variant="subtitle1" color="textSecondary">
                No active proposals
              </NoProposals>
            ) : null}
          </ResponsiveTableContainer>
          <Grid container direction="row" justify="center">
            <UnderlineText
              variant="subtitle1"
              color="secondary"
              onClick={() => history.push(`/explorer/proposals/${id}`)}
            >
              VIEW ALL PROPOSALS
            </UnderlineText>
          </Grid>

          <ResponsiveTableContainer>
            <TableHeader container wrap="nowrap">
              <Grid item xs={5}>
                <ProposalTableHeadText>
                  TOP TOKEN HOLDERS BY ADDRESS
                </ProposalTableHeadText>
              </Grid>
              <Grid item xs={3}>
                <ProposalTableHeadText>VOTES</ProposalTableHeadText>
              </Grid>
              <Grid item xs={2}>
                <ProposalTableHeadText>WEIGHT</ProposalTableHeadText>
              </Grid>
              <Grid item xs={2}>
                <ProposalTableHeadText>PROPOSALS VOTED</ProposalTableHeadText>
              </Grid>
            </TableHeader>
            {formattedMembers.map((holder, i) => (
              <TopHoldersTableRow key={`holder-${i}`} {...holder} index={i} />
            ))}
          </ResponsiveTableContainer>
        </Grid>
      ) : (
        <LoaderContainer container direction="row" justify="center">
          <CircularProgress color="secondary" />
        </LoaderContainer>
      )}
    </>
  );
};
