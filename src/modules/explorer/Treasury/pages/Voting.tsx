import {
  Box,
  Grid,
  styled,
  Typography,
  useTheme,
  withTheme,
} from "@material-ui/core";
import React, { useMemo } from "react";
import { useParams } from "react-router";
import dayjs from "dayjs";

import { SideBar, ProgressBar as CustomBar } from "modules/explorer/components";
import { UpVotesDialog } from "modules/explorer/components/VotersDialog";
import { VoteDialog } from "modules/explorer/components/VoteDialog";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import { useProposal } from "services/contracts/baseDAO/hooks/useProposal";
import { mutezToXtz, toShortAddress } from "services/contracts/utils";
import { StatusBadge } from "../../components/StatusBadge";
import {
  ProposalStatus,
  TreasuryProposalWithStatus,
} from "services/bakingBad/proposals/types";
import { UserBadge } from "../../components/UserBadge";
import ProgressBar from "react-customizable-progressbar";
import { formatNumber } from "modules/explorer/utils/FormatNumber";

const StyledContainer = styled(withTheme(Grid))((props) => ({
  background: props.theme.palette.primary.main,
  minHeight: 184,
  boxSizing: "border-box",
}));

const JustifyEndGrid = styled(Grid)({
  textAlign: "end",
});

const PageLayout = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.main,
  minHeight: "calc(100vh - 102px)",
}));

const MainContainer = styled(Grid)(({ theme }) => ({
  padding: "40px 112px",
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  paddingBottom: "4vh",
}));

const CycleContainer = styled(Grid)(({ theme }) => ({
  padding: "20px 112px",
  borderBottom: `2px solid ${theme.palette.primary.light}`,
}));

const StatsBox = styled(Grid)(({ theme }) => ({
  borderRight: `2px solid ${theme.palette.primary.light}`,
  width: "unset",
  "&:last-child": {
    borderRight: "none",
  },
}));

const StatsContainer = styled(Grid)(({ theme }) => ({
  height: 175,
  borderBottom: `2px solid ${theme.palette.primary.light}`,
}));

const TokensLocked = styled(StatsBox)({
  padding: "0 50px 0 112px",
});

const TextAgainst = styled(Typography)(({ theme }) => ({
  color: `${theme.palette.error.main} !important`,
}));

const Container = styled(Grid)({
  paddingTop: "4%",
});

const Subtitle = styled(Typography)({
  marginTop: 12,
});

const ButtonsContainer = styled(Grid)({
  marginTop: "6%",
});

const Cycle = styled(Typography)({
  opacity: 0.8,
});

const Detail = styled(Grid)(({ theme }) => ({
  height: 93,
  display: "flex",
  alignItems: "center",
  paddingBottom: 0,
  borderBottom: `2px solid ${theme.palette.primary.light}`,
}));

const HistoryContent = styled(Grid)({
  paddingBottom: 24,
  paddingLeft: 53,
});

const HistoryItem = styled(Grid)({
  paddingLeft: 63,
  marginTop: 20,
  paddingBottom: 12,
  display: "flex",
  height: "auto",
});

const DetailsContainer = styled(Grid)({
  paddingBottom: 0,
  padding: "40px 112px",
});

const BoxItem = styled(Grid)(({ theme }) => ({
  paddingBottom: 24,
  borderBottom: `2px solid ${theme.palette.primary.light}`,
}));

const ProgressText = styled(Typography)(
  ({ textColor }: { textColor: string }) => ({
    color: textColor,
    display: "flex",
    alignItems: "center",
    position: "absolute",
    width: "100%",
    height: "100%",
    fontSize: 16,
    userSelect: "none",
    boxShadow: "none",
    background: "inherit",
    fontFamily: "Roboto Mono",
    justifyContent: "center",
    top: 0,
  })
);

export const Voting: React.FC = () => {
  const { proposalId, id: daoId } = useParams<{
    proposalId: string;
    id: string;
  }>();
  const theme = useTheme();
  const { data: proposalData } = useProposal(daoId, proposalId);
  const proposal = proposalData as TreasuryProposalWithStatus | undefined;
  const { data: dao } = useDAO(daoId);

  const proposalCycle = proposal ? proposal.cycle : "-";
  const upVotes = proposal ? proposal.upVotes : 0;
  const downVotes = proposal ? proposal.downVotes : 0;
  const daoName = dao ? dao.metadata.unfrozenToken.name : "";
  const upVotesPercentage = dao && (upVotes * 100) / dao.storage.quorumTreshold;
  const downVotesPercentage =
    dao && (downVotes * 100) / dao.storage.quorumTreshold;

  const history = useMemo(() => {
    if (!proposal) {
      return [];
    }
    const baseStatuses: {
      date: string;
      status: ProposalStatus | "created";
    }[] = [
      {
        date: dayjs(proposal.startDate).format("LLL"),
        status: "created",
      },
      {
        date: dayjs(proposal.startDate).format("LLL"),
        status: ProposalStatus.ACTIVE,
      },
    ];

    switch (proposal.status) {
      case ProposalStatus.DROPPED:
        baseStatuses.push({
          date: "",
          status: ProposalStatus.DROPPED,
        });
        break;
      case ProposalStatus.REJECTED:
        baseStatuses.push({
          date: "",
          status: ProposalStatus.REJECTED,
        });
        break;
      case ProposalStatus.PASSED:
        baseStatuses.push({
          date: "",
          status: ProposalStatus.PASSED,
        });
        break;
    }

    return baseStatuses;
  }, [proposal]);

  const transfers = useMemo(() => {
    if (!proposal || !proposal.transfers) {
      return [];
    }

    return proposal.transfers.map((transfer) => {
      //TODO: can the from be different?
      const from = "DAO's treasury";

      const to =
        transfer.beneficiary.toLowerCase() === daoId.toLowerCase()
          ? "DAO's treasury"
          : toShortAddress(transfer.beneficiary);

      const currency =
        transfer.currency === "mutez" ? "XTZ" : transfer.currency;

      const value =
        transfer.currency === "mutez"
          ? mutezToXtz(transfer.amount)
          : transfer.amount;

      return `Transfer ${value}${currency} from ${from} to ${to}`;
    });
  }, [proposal, daoId]);

  return (
    <>
      <PageLayout container wrap="nowrap">
        <SideBar dao={daoId} />
        <Grid item xs>
          <MainContainer>
            <Container container direction="row">
              <Grid item xs={12}>
                <Typography variant="subtitle1" color="secondary">
                  {daoName} &gt; PROPOSALS
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <StyledContainer container direction="row">
                  <Grid item xs={6}>
                    <Subtitle variant="h3" color="textSecondary">
                      Proposal Title
                    </Subtitle>
                    <Subtitle color="textSecondary">
                      Proposal Description
                    </Subtitle>
                    {proposal && (
                      <StatusBadge
                        style={{ marginTop: 12 }}
                        lg={2}
                        md={6}
                        sm={6}
                        status={proposal.status}
                        xs={2}
                      />
                    )}
                  </Grid>
                  <JustifyEndGrid item xs={6}>
                    <ButtonsContainer
                      container
                      direction="row"
                      alignItems="center"
                      justify="flex-end"
                    >
                      <VoteDialog />
                    </ButtonsContainer>
                  </JustifyEndGrid>
                </StyledContainer>
              </Grid>
            </Container>
          </MainContainer>
          <CycleContainer container direction="row">
            <Cycle color="textSecondary">CYCLE: {proposalCycle}</Cycle>
          </CycleContainer>
          <StatsContainer container>
            <TokensLocked
              item
              xs={6}
              container
              direction="column"
              alignItems="center"
              justify="center"
            >
              <Grid container justify="space-between" alignItems="center">
                <Grid item>
                  <Box>
                    <Typography variant="subtitle2" color="secondary">
                      FOR
                    </Typography>
                  </Box>
                  <Box padding="12px 0">
                    <Typography variant="h3" color="textSecondary">
                      {upVotes}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item>
                  <UpVotesDialog
                    daoAddress={daoId}
                    proposalAddress={proposalId}
                    favor={true}
                  />
                </Grid>
              </Grid>
              <Grid container direction="row" alignItems="center">
                <Grid item xs={10}>
                  <CustomBar
                    favor={true}
                    variant="determinate"
                    value={upVotesPercentage}
                    color="secondary"
                  />
                </Grid>
                <Grid item xs={2}>
                  <Typography color="textSecondary" align="right">
                    {formatNumber(Number(upVotesPercentage))}%
                  </Typography>
                </Grid>
              </Grid>
            </TokensLocked>

            <TokensLocked
              item
              xs={6}
              container
              direction="column"
              alignItems="center"
              justify="center"
            >
              <Grid container justify="space-between" alignItems="center">
                <Grid item>
                  <Box>
                    <TextAgainst variant="subtitle2">OPPOSE</TextAgainst>
                  </Box>
                  <Box padding="12px 0">
                    <Typography variant="h3" color="textSecondary">
                      {downVotes}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item>
                  <UpVotesDialog
                    daoAddress={daoId}
                    proposalAddress={proposalId}
                    favor={false}
                  />
                </Grid>
              </Grid>
              <Grid container direction="row" alignItems="center">
                <Grid item xs={10}>
                  <CustomBar
                    variant="determinate"
                    value={downVotesPercentage}
                    favor={false}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Typography color="textSecondary" align="right">
                    {formatNumber(Number(downVotesPercentage))}%
                  </Typography>
                </Grid>
              </Grid>
            </TokensLocked>
          </StatsContainer>
          <DetailsContainer container direction="row">
            <Grid item xs={6}>
              <Grid container direction="row">
                <BoxItem item xs={12}>
                  <Typography variant="subtitle1" color="textSecondary">
                    DETAILS
                  </Typography>
                </BoxItem>

                {transfers.map((item, index) => {
                  return (
                    <Detail item xs={12} key={index}>
                      <Grid container direction="row">
                        <Grid item xs={2}>
                          <Typography
                            variant="subtitle1"
                            color="textSecondary"
                            align="center"
                          >
                            {index + 1}
                          </Typography>
                        </Grid>
                        <Grid item xs={10}>
                          <Typography variant="subtitle1" color="textSecondary">
                            {item}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Detail>
                  );
                })}
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Grid container direction="row">
                <HistoryContent item xs={12}>
                  <Typography variant="subtitle1" color="textSecondary">
                    QUORUM THRESHOLD %
                  </Typography>
                </HistoryContent>
                <HistoryContent item xs={12}>
                  <ProgressBar
                    progress={90}
                    radius={50}
                    strokeWidth={7}
                    strokeColor="#3866F9"
                    trackStrokeWidth={4}
                    trackStrokeColor={theme.palette.primary.light}
                  >
                    <div className="indicator">
                      <ProgressText textColor="#3866F9">
                        {formatNumber(90)}%
                      </ProgressText>
                    </div>
                  </ProgressBar>
                </HistoryContent>
              </Grid>
              <Grid container direction="row">
                <HistoryContent item xs={12}>
                  <Typography variant="subtitle1" color="textSecondary">
                    CREATED BY
                  </Typography>
                </HistoryContent>
                {proposal && (
                  <HistoryContent item xs={12}>
                    <UserBadge address={proposal.proposer} />
                  </HistoryContent>
                )}
                <HistoryContent item xs={12}>
                  <Typography variant="subtitle1" color="textSecondary">
                    HISTORY
                  </Typography>
                </HistoryContent>
                {history.map((item, index) => {
                  return (
                    <HistoryItem container direction="row" key={index}>
                      <StatusBadge
                        item
                        lg={2}
                        md={6}
                        sm={6}
                        status={item.status}
                      />
                      <Grid item lg={1} md={1} sm={1}></Grid>
                      <Grid item lg={9} md={12} sm={12}>
                        <Typography color="textSecondary">
                          {item.date}
                        </Typography>
                      </Grid>
                    </HistoryItem>
                  );
                })}
              </Grid>
            </Grid>
          </DetailsContainer>
        </Grid>
      </PageLayout>
    </>
  );
};
