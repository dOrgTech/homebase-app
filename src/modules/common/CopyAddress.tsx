import { Grid, Typography } from "@material-ui/core";
import React from "react";
import { CopyButton } from "./CopyButton";

export const CopyAddress: React.FC<{ address: string }> = ({ address }) => {
  return (
    <Grid container alignItems="center">
      <Grid item>
        <Typography variant="subtitle1" color="textSecondary">
          {address}
        </Typography>
      </Grid>
      <Grid item>
        <CopyButton text={address} />
      </Grid>
    </Grid>
  );
};
