import {
  Box,
  Grid,
  Paper,
  styled,
  Typography,
  withTheme,
  Button,
  IconButton,
  LinearProgress,
} from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import { Header } from "../components/Header";
import { NewProposalDialog } from "../components/NewProposalDialog";
import {
  ProposalTableRowData,
  ProposalTableRow,
} from "../components/ProposalTableRow";
import { SideBar } from "../components/SideBar";

const StyledContainer = styled(withTheme(Grid))((props) => ({
  background: props.theme.palette.primary.main,
  height: 184,
  paddingLeft: "6%",
  paddingRight: "6%",
  paddingTop: "4%",
  boxSizing: "border-box",
}));

const JustifyEndGrid = styled(withTheme(Grid))((props) => ({
  textAlign: "end",
}));

const PageLayout = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.main,
  minHeight: "calc(100vh - 102px)",
}));

const MainContainer = styled(Grid)({
  paddingBottom: 0,
  padding: "40px 112px",
  borderBottom: "2px solid #3D3D3D",
});

const StatsBox = styled(Grid)({
  borderRight: "2px solid #3D3D3D",
  width: "unset",
});

const StatsContainer = styled(Grid)({
  height: 175,
  borderBottom: "2px solid #3D3D3D",
});

const TokensLocked = styled(StatsBox)({
  padding: "0 50px 0 112px",
});

const LockedTokensBar = styled(LinearProgress)({
  width: "100%",
  "&.MuiLinearProgress-colorSecondary": {
    background: "#3D3D3D",
  },
});

const VotingAddresses = styled(StatsBox)({
  minWidth: 250,
});

const ActiveProposals = styled(StatsBox)({
  paddingLeft: "42px",
});

const TableContainer = styled(Box)({
  width: "100%",
  padding: "72px 112px",
  paddingBottom: 30,
  boxSizing: "border-box",
});

const TableHeader = styled(Grid)({
  borderBottom: "2px solid #3D3D3D",
  paddingBottom: 20,
});

const ProposalsContainer = styled(Grid)({
  paddingBottom: 72,
});

const UnderlineText = styled(Typography)({
  textDecoration: "underline",
  cursor: "pointer",
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

export const Proposals: React.FC = () => {
  const history = useHistory<any>();

  return (
    <>
      <PageLayout container wrap="nowrap">
        <SideBar />
        <Grid item xs>
          <MainContainer>
            <StyledContainer container direction="row">
              <Grid item xs={6}>
                <Typography variant="subtitle1" color="secondary">
                  MY GREAT TOKEN
                </Typography>
                <Typography variant="h5" color="textSecondary">
                  Proposals
                </Typography>
              </Grid>
              <JustifyEndGrid item xs={6}>
                <NewProposalDialog />
              </JustifyEndGrid>
            </StyledContainer>
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
              <LockedTokensBar
                variant="determinate"
                value={60}
                color="secondary"
              />
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
            <ActiveProposals
              item
              xs
              container
              direction="column"
              justify="center"
            >
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
                <ProposalTableHeadText>{""}</ProposalTableHeadText>
              </Grid>
            </TableHeader>
            {proposals.map((proposal, i) => (
              <ProposalTableRow key={`proposal-${i}`} {...proposal} />
            ))}
          </TableContainer>
          <ProposalsContainer
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <UnderlineText
              color="textSecondary"
              variant="subtitle1"
              align="center"
            >
              LOAD MORE
            </UnderlineText>
          </ProposalsContainer>
        </Grid>
      </PageLayout>
    </>
  );
};
