import {
  Grid,
  Paper,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
  withTheme,
} from "@material-ui/core";
import React from "react";
import { useParams } from "react-router";

import { ProgressBar as CustomBar } from "modules/explorer/components";
import { VoteDialog } from "modules/explorer/components/VoteDialog";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import { useProposal } from "services/contracts/baseDAO/hooks/useProposal";
import { TreasuryProposalWithStatus } from "services/bakingBad/proposals/types";
import { StatusBadge } from "./StatusBadge";
import { ProposalStatusHistory } from "./ProposalStatusHistory";
import { ViewButton } from "./ViewButton";
import { RectangleContainer } from "./styled/RectangleHeader";
import { formatNumber } from "../utils/FormatNumber";

const StyledContainer = styled(withTheme(Grid))((props) => ({
  background: props.theme.palette.primary.main,
  boxSizing: "border-box",
}));

const StatsContainer = styled(Grid)(({ theme }) => ({
  minHeight: 175,
  borderBottom: `2px solid ${theme.palette.primary.light}`,
}));

const TokensLocked = styled(Grid)({
  padding: "35px 8%",
});

const Subtitle = styled(Typography)({
  marginTop: 12,
});

const ButtonsContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    marginTop: 15,
  },
}));

const Cycle = styled(Typography)({
  opacity: 0.8,
});

const DetailsContainer = styled(Grid)(({ theme }) => ({
  paddingBottom: 0,
  padding: "40px 8%",
  [theme.breakpoints.down("sm")]: {
    padding: "40px 0",
  },
}));

const TitleText = styled(Typography)({
  fontWeight: "bold",
});

const DescriptionText = styled(Typography)({
  paddingTop: 28,
  paddingBottom: 10,
});

const RectangleHeader = styled(Grid)(({ theme }) => ({
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  padding: "20px 8%",
}));

const DetailsHeader = styled(RectangleHeader)(({ theme }) => ({
  borderTop: `2px solid ${theme.palette.primary.light}`,
  margin: "20px 0 35px 0",
}));

const GreenDot = styled(Paper)(({ theme }) => ({
  width: 9,
  height: 9,
  marginRight: 9,
  background: theme.palette.secondary.main,
}));

const RedDot = styled(Paper)(({ theme }) => ({
  width: 9,
  height: 9,
  marginRight: 9,
  background: theme.palette.error.main,
}));

const StatusTitle = styled(Typography)({
  fontWeight: "bold",
  marginRight: 12,
});

const ProposalStatusBadge = styled(StatusBadge)(({ theme }) => ({
  marginLeft: 15,
  [theme.breakpoints.down("sm")]: {
    marginTop: 15,
  },
}));

export const ProposalDetails: React.FC = ({ children }) => {
  const { proposalId, id: daoId } = useParams<{
    proposalId: string;
    id: string;
  }>();
  const theme = useTheme();
  const { data: proposalData } = useProposal(daoId, proposalId);
  const proposal = proposalData as TreasuryProposalWithStatus | undefined;
  const { data: dao } = useDAO(daoId);
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const proposalCycle = proposal ? proposal.cycle : "-";
  const upVotes = proposal ? proposal.upVotes : 0;
  const downVotes = proposal ? proposal.downVotes : 0;
  const daoName = dao ? dao.metadata.unfrozenToken.name : "";
  const upVotesPercentage = dao && (upVotes * 100) / dao.storage.quorumTreshold;
  const downVotesPercentage =
    dao && (downVotes * 100) / dao.storage.quorumTreshold;

  return (
    <>
      <Grid item xs>
        <RectangleContainer>
          <Grid
            container
            direction={isMobileSmall ? "column" : "row"}
            alignItems="center"
          >
            <Grid item>
              <Typography
                variant="subtitle1"
                color="secondary"
                align={isMobileSmall ? "center" : "left"}
              >
                {daoName} &gt; PROPOSALS
              </Typography>
            </Grid>
            <Grid item>
              {proposal && <ProposalStatusBadge status={proposal.status} />}
            </Grid>
            <Grid item xs={12}>
              <StyledContainer container direction="row">
                <Grid item xs={12} md={6}>
                  <Subtitle
                    variant="h3"
                    color="textSecondary"
                    align={isMobileSmall ? "center" : "left"}
                  >
                    Proposal Title
                  </Subtitle>
                </Grid>
                <Grid item xs={12} md={6}>
                  <ButtonsContainer
                    container
                    direction="row"
                    alignItems="center"
                    wrap="nowrap"
                    justify={isMobileSmall ? "center" : "flex-end"}
                  >
                    <VoteDialog />
                  </ButtonsContainer>
                </Grid>
              </StyledContainer>
            </Grid>
          </Grid>
        </RectangleContainer>
        <RectangleHeader container direction="row">
          <Cycle color="textSecondary">CYCLE: {proposalCycle}</Cycle>
        </RectangleHeader>
        <StatsContainer container>
          <TokensLocked container direction="row" alignItems="center">
            <Grid item xs={12}>
              <Typography color="secondary">VOTES</Typography>
            </Grid>
            <Grid item xs={12} container direction="row" alignItems="center">
              <Grid item xs={8} container direction="row" alignItems="center">
                <Grid
                  item
                  xs={isMobileSmall ? 12 : 4}
                  container
                  direction="row"
                  alignItems="center"
                >
                  <GreenDot />
                  <StatusTitle color="textSecondary">SUPPORT: </StatusTitle>
                  <Typography color="textSecondary">
                    {upVotes} ({ upVotesPercentage && upVotesPercentage > 100 ? 100 : formatNumber(Number(upVotesPercentage))}%){" "}
                  </Typography>
                </Grid>

                <Grid
                  xs={isMobileSmall ? 12 : 4}
                  container
                  direction="row"
                  alignItems="center"
                >
                  <RedDot />
                  <StatusTitle color="textSecondary">OPPOSE: </StatusTitle>
                  <Typography color="textSecondary">
                    {downVotes} ({downVotesPercentage && downVotesPercentage > 100 ? 100 : formatNumber(Number(downVotesPercentage))}%){" "}
                  </Typography>
                </Grid>
              </Grid>

              <Grid
                xs={4}
                container
                direction="row"
                alignItems="center"
                justify="flex-end"
              >
                <ViewButton variant="outlined">VIEW</ViewButton>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <CustomBar
                favor={true}
                variant="determinate"
                value={upVotesPercentage}
                color="secondary"
              />
            </Grid>
          </TokensLocked>
          {/* <TokensLocked
            item
            xs={12}
            sm={6}
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
                  {upVotesPercentage}%
                </Typography>
              </Grid>
            </Grid>
          </TokensLocked> */}

          {/* <TokensLocked
            item
            xs={12}
            sm={6}
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
                  {downVotesPercentage}%
                </Typography>
              </Grid>
            </Grid>
          </TokensLocked> */}
        </StatsContainer>
        <DetailsContainer container direction="row">
          <Grid item xs={12} md={7} style={{ paddingBottom: 40 }}>
            <Grid container direction="row" alignItems="center">
              <Grid item xs={12}>
                <TitleText
                  variant="subtitle1"
                  color="textSecondary"
                  align={isMobileSmall ? "center" : "left"}
                >
                  Proposal
                </TitleText>
                <DescriptionText
                  variant="subtitle1"
                  color="textSecondary"
                  align={isMobileSmall ? "center" : "left"}
                >
                  Proposal Description
                </DescriptionText>
              </Grid>
              {children}
            </Grid>
          </Grid>
          {isMobileSmall && (
            <DetailsHeader xs={12} alignItems="center" container>
              <TitleText variant="subtitle1" color="textSecondary">
                DETAILS
              </TitleText>
            </DetailsHeader>
          )}
          <ProposalStatusHistory />
        </DetailsContainer>
      </Grid>
    </>
  );
};
