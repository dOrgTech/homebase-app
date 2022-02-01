import { Grid, Typography } from "@material-ui/core";
import React from "react";

interface Props {
  days: number | string;
  hours: number | string;
  minutes: number | string;
}

export const EstimatedTime: React.FC<Props> = ({
  hours, days,
  minutes
}) => {
  return (
    <Grid container style={{ gap: 32}} wrap='nowrap'>
      <Grid item>
        <Typography color='secondary' variant='subtitle1'>
          Estimated time
        </Typography>
        <Grid style={{ display: "flex", marginTop: 2 }} wrap='nowrap'>
          <Typography color='textSecondary' variant='subtitle2' style={{ marginRight: 8 }}>
            {days}d
          </Typography>
          <Typography color='textSecondary' variant='subtitle2' style={{ marginRight: 8 }}>
            {hours}h
          </Typography>
          <Typography color='textSecondary' variant='subtitle2' style={{ marginRight: 8 }}>
            {minutes}m
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};
