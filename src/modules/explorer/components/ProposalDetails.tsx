import {
  Box,
  Grid,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
  withTheme,
} from "@material-ui/core";
import React from "react";
import { useParams } from "react-router";

import { ProgressBar as CustomBar } from "modules/explorer/components";
import { UpVotesDialog } from "modules/explorer/components/VotersDialog";
import { VoteDialog } from "modules/explorer/components/VoteDialog";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import { useProposal } from "services/contracts/baseDAO/hooks/useProposal";
import { TreasuryProposalWithStatus } from "services/bakingBad/proposals/types";
import { StatsBox } from "modules/explorer/components/StatsBox";
import { StatusBadge } from "./StatusBadge";
import { ProposalStatusHistory } from "./ProposalStatusHistory";

const StyledContainer = styled(withTheme(Grid))((props) => ({
  background: props.theme.palette.primary.main,
  minHeight: 184,
  boxSizing: "border-box",
}));

const JustifyEndGrid = styled(Grid)({
  textAlign: "end",
});

const MainContainer = styled(Grid)(({ theme }) => ({
  padding: "44px 8%",
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  paddingBottom: "4vh",
}));

const StatsContainer = styled(Grid)(({ theme }) => ({
  minHeight: 175,
  borderBottom: `2px solid ${theme.palette.primary.light}`,
}));

const TokensLocked = styled(StatsBox)(({ theme }) => ({
  padding: "0 50px 0 8%",
  [theme.breakpoints.down("sm")]: {
    padding: "50px 8%",
  },
}));

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
        <MainContainer>
          <Container container direction="row">
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="secondary">
                {daoName} &gt; PROPOSALS
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <StyledContainer container direction="row">
                <Grid item xs={12} sm={6}>
                  <Subtitle variant="h3" color="textSecondary">
                    Proposal Title
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
                <JustifyEndGrid item xs={12} sm={6}>
                  <ButtonsContainer
                    container
                    direction="row"
                    alignItems="center"
                    justify={isMobileSmall ? "flex-start" : "flex-end"}
                  >
                    <VoteDialog />
                  </ButtonsContainer>
                </JustifyEndGrid>
              </StyledContainer>
            </Grid>
          </Container>
        </MainContainer>
        <RectangleHeader container direction="row">
          <Cycle color="textSecondary">CYCLE: {proposalCycle}</Cycle>
        </RectangleHeader>
        <StatsContainer container>
          <TokensLocked
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
          </TokensLocked>

          <TokensLocked
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
          </TokensLocked>
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
