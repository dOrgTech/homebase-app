import { Box, Grid, IconButton, styled, Typography } from "@material-ui/core";
import React from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import HouseIcon from "../../../assets/logos/house.svg";
import VotingIcon from "../../../assets/logos/voting.svg";
import VotingPeriodIcon from "../../../assets/logos/votingPeriod.svg";
import VoteTimeIcon from "../../../assets/logos/voteTime.svg";
import {
  ProposalTableRow,
  ProposalTableRowData,
} from "../components/ProposalTableRow";

const SideBar = styled(Grid)({
  width: 102,
  borderRight: "2px solid #3D3D3D",
});

const MainContainer = styled(Grid)({
  minHeight: 325,
  padding: "40px 112px",
  borderBottom: "2px solid #3D3D3D",
});

const SidebarButton = styled(IconButton)({
  paddingTop: 32,
  width: "100%",
});

const PageLayout = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.main,
  minHeight: "calc(100vh - 102px)",
}));

const DAOInfoTitleAndDesc = styled(Grid)({
  maxWidth: 600,
  marginBottom: 40,
});

const DAOInfoVotingPeriod = styled(Grid)({
  minWidth: 320,
});

const BigIconContainer = styled(Box)({
  width: 112,

  "& > img": {
    display: "block",
    margin: "auto",
  },
});

const StatsContainer = styled(Grid)({
  height: 175,
  borderBottom: "2px solid #3D3D3D",
});

const StatsBox = styled(Grid)({
  borderRight: "2px solid #3D3D3D",
  width: "unset",
});

const TokensLocked = styled(StatsBox)({
  padding: "0 50px 0 112px",
});

const VotingAddresses = styled(StatsBox)({
  minWidth: 250,
});

const ActiveProposals = styled(StatsBox)({
  paddingLeft: "42px",
});

const LockedTokensBar = styled(LinearProgress)({
  width: "100%",
  "&.MuiLinearProgress-colorSecondary": {
    background: "#3D3D3D",
  },
});

const TableContainer = styled(Box)({
  width: "100%",
  padding: "72px 112px",
  boxSizing: "border-box",
});

const TableHeader = styled(Grid)({
  borderBottom: "2px solid #3D3D3D",
  paddingBottom: 20,
});

const ProposalTableHeadText: React.FC = ({ children }) => (
  <Typography variant="subtitle1" color="textSecondary">
    {children}
  </Typography>
);

const proposals: ProposalTableRowData[] = [
  {
    title: "Contribute to the fund",
    number: 43,
    date: "11/06/2020",
    cycle: 7,
    support: 65,
    color: "success",
  },
  {
    title: "Contribute to the fund",
    number: 42,
    date: "11/06/2020",
    cycle: 7,
    support: 65,
    color: "warning",
  },
  {
    title: "Contribute to the fund",
    number: 41,
    date: "11/06/2020",
    cycle: 7,
    support: 65,
    color: "danger",
  },
];

export const DAO = (): JSX.Element => (
  <PageLayout container wrap="nowrap">
    <SideBar item>
      <SidebarButton>
        <img src={HouseIcon} />
      </SidebarButton>
      <SidebarButton>
        <img src={VotingIcon} />
      </SidebarButton>
    </SideBar>
    <Grid item xs>
      <MainContainer container justify="space-between">
        <DAOInfoTitleAndDesc item>
          <Box>
            <Typography variant="subtitle2" color="secondary">
              TEZDAO
            </Typography>
          </Box>
          <Box paddingBottom="20px">
            <Typography variant="h1" color="textSecondary">
              TezDAO
            </Typography>
          </Box>
          <Box>
            <Typography variant="body1" color="textSecondary">
              The TezDAO was founded as a partnership between some of the most
              known Tezos Influencers. The purpose of this DAO is to manage a
              treasury of funds to further the organization’s goals.
            </Typography>
          </Box>
        </DAOInfoTitleAndDesc>
        <DAOInfoVotingPeriod item>
          <Box paddingBottom="32px">
            <Grid container>
              <Grid item>
                <BigIconContainer>
                  <img src={VotingPeriodIcon} />
                </BigIconContainer>
              </Grid>
              <Grid item>
                <Box paddingLeft="35px">
                  <Box>
                    <Typography variant="subtitle2" color="secondary">
                      PERIOD
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h3" color="textSecondary">
                      Voting
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Box paddingBottom="32px">
            <Grid container>
              <Grid item>
                <BigIconContainer>
                  <img src={VoteTimeIcon} />
                </BigIconContainer>
              </Grid>
              <Grid item>
                <Box paddingLeft="35px">
                  <Box>
                    <Typography variant="subtitle2" color="secondary">
                      TIME LEFT TO VOTE
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h3" color="textSecondary">
                      5d 2m 3h
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DAOInfoVotingPeriod>
      </MainContainer>
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
                  MGTO Locked
                </Typography>
              </Box>
              <Box padding="12px 0">
                <Typography variant="h3" color="textSecondary">
                  21,202
                </Typography>
              </Box>
            </Grid>
            <Grid item>
              <Typography variant="subtitle2" color="secondary">
                View
              </Typography>
            </Grid>
          </Grid>
          <LockedTokensBar variant="determinate" value={60} color="secondary" />
        </TokensLocked>
        <VotingAddresses
          item
          container
          direction="column"
          alignItems="center"
          justify="center"
        >
          <Box>
            <Typography variant="subtitle2" color="secondary">
              Voting Addresses
            </Typography>
            <Typography variant="h3" color="textSecondary">
              215
            </Typography>
          </Box>
        </VotingAddresses>
        <ActiveProposals item xs container direction="column" justify="center">
          <Box>
            <Typography variant="subtitle2" color="secondary">
              Active Proposals
            </Typography>
            <Typography variant="h3" color="textSecondary">
              5
            </Typography>
          </Box>
        </ActiveProposals>
      </StatsContainer>
      <TableContainer>
        <TableHeader container wrap="nowrap">
          <Grid item xs={5}>
            <ProposalTableHeadText>ACTIVE PROPOSALS</ProposalTableHeadText>
          </Grid>
          <Grid item xs={2}>
            <ProposalTableHeadText>CYCLE</ProposalTableHeadText>
          </Grid>
          <Grid item xs={5}>
            <ProposalTableHeadText>STATUS</ProposalTableHeadText>
          </Grid>
        </TableHeader>
        {proposals.map((proposal, i) => (
          <ProposalTableRow key={`proposal-${i}`} {...proposal} />
        ))}
      </TableContainer>
    </Grid>
  </PageLayout>
);
