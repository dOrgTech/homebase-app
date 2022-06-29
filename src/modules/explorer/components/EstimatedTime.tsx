import { Grid, styled, Typography } from "@material-ui/core";
import React from "react";

const EstimatedTimeContainer = styled(Grid)({
  boxSizing: "border-box",
  padding: "15px 0px",
});

interface Props {
  days: number | string;
  hours: number | string;
  minutes: number | string;
}

export const EstimatedTime: React.FC<Props> = ({ hours, days, minutes }) => {
  return (
    <EstimatedTimeContainer>
      <Grid item>
        <Typography color='secondary' variant='subtitle1'>
          Estimated time
        </Typography>
        <Grid container style={{ gap: 10 }} wrap='nowrap'>
          <Typography color='textSecondary' variant='subtitle2'>
            {days}d
          </Typography>
          <Typography color='textSecondary' variant='subtitle2'>
            {hours}h
          </Typography>
          <Typography color='textSecondary' variant='subtitle2'>
            {minutes}m
          </Typography>
        </Grid>
      </Grid>
    </EstimatedTimeContainer>
  );
};
