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

import { SideBar } from "../components/SideBar";
import { VoteAgainstDialog } from "../components/VoteAgainstDialog";
import { VoteForDialog } from "../components/VoteForDialog";

const StyledContainer = styled(withTheme(Grid))((props) => ({
  background: props.theme.palette.primary.main,
  height: 184,
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

const CycleContainer = styled(Grid)({
  padding: "20px 112px",
  borderBottom: "2px solid #3D3D3D",
});

const StatsBox = styled(Grid)({
  borderRight: "2px solid #3D3D3D",
  width: "unset",
  "&:last-child": {
    borderRight: "none",
  },
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

const Container = styled(Grid)({
  paddingTop: "4%",
});

const VotingAddresses = styled(StatsBox)({
  minWidth: 250,
});

const ActiveProposals = styled(StatsBox)({
  paddingLeft: "42px",
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

export const Voting: React.FC = () => {
  const history = useHistory<any>();

  return (
    <>
      <PageLayout container wrap="nowrap">
        <SideBar />
        <Grid item xs>
          <MainContainer>
            <Container container direction="row">
              <Grid item xs={12}>
                <Typography variant="subtitle1" color="secondary">
                  MY GREAT TOKEN &gt; PROPOSALS
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <StyledContainer container direction="row">
                  <Grid item xs={6}>
                    <Subtitle variant="h3" color="textSecondary">
                      Should the DAO fund a new project?
                    </Subtitle>
                    <Subtitle color="textSecondary">
                      This Proposal was created to fund a new project as the
                      governing body of such and such and other can go here.
                    </Subtitle>
                  </Grid>
                  <JustifyEndGrid item xs={6}>
                    <ButtonsContainer
                      container
                      direction="row"
                      alignItems="center"
                      justify="flex-end"
                    >
                      <VoteForDialog />
                      <VoteAgainstDialog />
                    </ButtonsContainer>
                  </JustifyEndGrid>
                </StyledContainer>
              </Grid>
            </Container>
          </MainContainer>
          <CycleContainer container direction="row">
            <Cycle color="textSecondary">CYCLE: 14 POSITION: 4</Cycle>
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
                      21,202
                    </Typography>
                  </Box>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle2" color="secondary">
                    VIEW ADDRESSES
                  </Typography>
                </Grid>
              </Grid>
              <Grid container direction="row" alignItems="center">
                <Grid item xs={10}>
                  <LockedTokensBar
                    variant="determinate"
                    value={60}
                    color="secondary"
                  />
                </Grid>
                <Grid item xs={2}>
                  <Typography color="textSecondary" align="right">
                    40%
                  </Typography>
                </Grid>
              </Grid>
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
        </Grid>
      </PageLayout>
    </>
  );
};
