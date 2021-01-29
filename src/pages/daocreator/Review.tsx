import { Grid, Paper, styled, Typography } from "@material-ui/core";
import Rocket from "../../assets/img/rocket.svg";
import React from "react";

const RocketImg = styled("img")({
  marginBottom: 46,
});

const WaitingText = styled(Typography)({
  marginTop: 9,
});

export const Review: React.FC<{ setProgress: any }> = ({ setProgress }) => {
  setProgress(100);
  return (
    <>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
        style={{ height: "fit-content" }}
      >
        <Grid item xs={12}>
          <RocketImg src={Rocket} alt="rocket" />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" color="textSecondary">
            Deploying <strong> My Great Token </strong> to the Tezos Network
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <WaitingText variant="subtitle1" color="textSecondary">
            Waiting for confirmation...
          </WaitingText>
        </Grid>
      </Grid>
    </>
  );
};
