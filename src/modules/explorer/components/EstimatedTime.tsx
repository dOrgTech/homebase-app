import { Grid, Typography } from "@material-ui/core";
import React from "react";

export const EstimatedTime: React.FC<{ blockTimeAverage: number; blockQty: number }> = ({
  blockTimeAverage,
  blockQty,
}) => {
  return (
    <Grid container style={{ gap: 32, marginTop: 10 }} wrap='nowrap'>
      <Grid item>
        <Typography color='secondary' variant='subtitle1'>
          Estimated time
        </Typography>
        <Grid style={{ display: "flex", marginTop: 2 }} wrap='nowrap'>
          <Typography color='textSecondary' variant='subtitle2' style={{ marginRight: 8 }}>
            {Math.floor((blockTimeAverage * blockQty) / (3600 * 24))}d
          </Typography>
          <Typography color='textSecondary' variant='subtitle2' style={{ marginRight: 8 }}>
            {Math.floor(((blockTimeAverage * blockQty) % (3600 * 24)) / 3600)}h
          </Typography>
          <Typography color='textSecondary' variant='subtitle2' style={{ marginRight: 8 }}>
            {Math.floor(((blockTimeAverage * blockQty) % 3600) / 60)}m
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};
