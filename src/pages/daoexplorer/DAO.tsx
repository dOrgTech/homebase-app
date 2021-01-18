import { Box, Grid, styled, Typography } from "@material-ui/core";
import React from "react";
import { useRouteMatch } from "react-router-dom";

const SideBar = styled(Box)({
  width: 102,
  borderRight: "2px solid #3D3D3D",
});

const MainContainer = styled(Grid)({
  height: 325,
  padding: "40px 0 40px 112px",
});

export const DAO = () => {
  const match = useRouteMatch();

  return (
    <Grid container>
      <Grid item>
        <SideBar>Box</SideBar>
      </Grid>
      <Grid item xs>
        <MainContainer container>
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="subtitle2">TEZDAO</Typography>
            </Box>
            <Box>
              <Typography variant="h1" color="textSecondary">
                TezDAO
              </Typography>
            </Box>
            <Box padding="20px 0 35px 0">
              <Typography variant="body1" color="textSecondary">
                The TezDAO was founded as a partnership between some of the most
                known Tezos Influencers. The purpose of this DAO is to manage a
                treasury of funds to further the organization’s goals.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box>
              <Grid container>
                <Grid item></Grid>
                <Grid item>
                  <Box>
                    <Typography variant="subtitle2">PERIOD</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h3">Voting</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Box>
              <Grid container>
                <Grid item>TIME LEFT TO VOTE</Grid>
                <Grid item>5d 2m 3h</Grid>
              </Grid>
            </Box>
          </Grid>
        </MainContainer>
      </Grid>
    </Grid>
  );
};
