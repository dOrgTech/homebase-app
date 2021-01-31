import {
  Box,
  Grid,
  styled,
  Typography,
  withTheme,
  LinearProgress,
} from "@material-ui/core";
import React from "react";
import { SideBar } from "../components/SideBar";
import { VoteAgainstDialog } from "../components/VoteAgainstDialog";
import { VoteForDialog } from "../components/VoteForDialog";

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

const MainContainer = styled(Grid)({
  padding: "40px 112px",
  borderBottom: "2px solid #3D3D3D",
  paddingBottom: "4vh",
});

const DetailsContainer = styled(Grid)({
  paddingBottom: 0,
  padding: "40px 112px",
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

const LockedTokensAgainstBar = styled(LinearProgress)({
  width: "100%",
  "&.MuiLinearProgress-colorSecondary": {
    background: "#3D3D3D",
    color: "#ED254E",
    "& .MuiLinearProgress-bar": {
      backgroundColor: "#ED254E !important",
    },
  },
  "& .MuiLinearProgress-bar": {
    backgroundColor: "#ED254E !important",
  },
});

const TextAgainst = styled(Typography)({
  color: "#ED254E !important",
});

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

const BoxItem = styled(Grid)({
  paddingBottom: 24,
  borderBottom: "2px solid #3D3D3D",
});

const Detail = styled(Grid)({
  height: 93,
  display: "flex",
  alignItems: "center",
  paddingBottom: 0,
  borderBottom: "2px solid #3D3D3D",
});

const MetaData = styled(Grid)({
  height: 70,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 20,
});

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

const HistoryBadge = styled(Grid)({
  borderRadius: 4,
  textAlign: "center",
});

const styles = {
  blue: {
    background: "#3866F9",
    color: "white",
    padding: 2,
  },
  yellow: {
    background: "#DBDE39",
    color: "#1C1F23",
    padding: 2,
  },
};

const Details = [
  {
    message: "Reduces DAO’s Treasury by 50ETH",
  },
  {
    message: "Increases 0x89878 wallet by 50ETH",
  },
  {
    message: "Reduces DAO’s Treasury by 50ETH",
  },
];

const History = [
  {
    date: "December 19th, 2020. 11:09:21 AM",
    status: "created",
  },
  {
    date: "December 20th, 2020. 11:09:21 AM",
    status: "active",
  },
  {
    date: "December 21st, 2020. 11:09:21 AM",
    status: "passed",
  },
];

export const Voting: React.FC = () => {
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
                      87,202
                    </Typography>
                  </Box>
                </Grid>
                <Grid item>
                  <TextAgainst variant="subtitle2" color="secondary">
                    VIEW ADDRESSES
                  </TextAgainst>
                </Grid>
              </Grid>
              <Grid container direction="row" alignItems="center">
                <Grid item xs={10}>
                  <LockedTokensAgainstBar variant="determinate" value={60} />
                </Grid>
                <Grid item xs={2}>
                  <Typography color="textSecondary" align="right">
                    60%
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

                {Details.map((item: any, index: any) => {
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
                            {item.message}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Detail>
                  );
                })}

                <MetaData item xs={12}>
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    align="center"
                  >
                    Proposal Metadata & #
                  </Typography>
                </MetaData>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Grid container direction="row">
                <HistoryContent item xs={12}>
                  <Typography variant="subtitle1" color="textSecondary">
                    HISTORY
                  </Typography>
                </HistoryContent>
                {History.map((item: any, index: any) => {
                  return (
                    <HistoryItem container direction="row" key={index}>
                      <HistoryBadge
                        item
                        lg={2}
                        md={6}
                        sm={6}
                        style={
                          item.status === "active" ? styles.yellow : styles.blue
                        }
                      >
                        <Typography> {item.status.toUpperCase()} </Typography>
                      </HistoryBadge>
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
