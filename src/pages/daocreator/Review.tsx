import {
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Paper,
  styled,
  Typography,
} from "@material-ui/core";
import React from "react";

const Circle = styled(Paper)({
  background: "#eeeeee",
  height: 186,
  width: 186,
  borderRadius: "50%",
  boxShadow: "none",
  marginBottom: 49,
});

const WaitingText = styled(Typography)({
  marginTop: 9,
});

export const Review: React.FC = () => {
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
          <Circle />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4">
            Deploying <strong> My Great Token </strong> to the Tezos Network
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <WaitingText variant="subtitle1">
            Waiting for confirmation...
          </WaitingText>
        </Grid>
      </Grid>
    </>
  );
};
