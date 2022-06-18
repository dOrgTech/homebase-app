import { Grid, styled, Typography } from "@material-ui/core";
import React from "react";

const StyledGrid = styled(Grid)({
  height: "fit-content",
  background: "#2F3438",
  borderRadius: 8,
  padding: "30px 40px",
  marginBottom: 42
});

const CustomTypography = styled(Typography)({
  marginTop: 27
});

interface Props {
  title: string;
  description: string;
}

export const TitleBock: React.FC<Props> = ({ title, description }) => {
  return (
    <StyledGrid container direction="row" justify="space-between">
      <Grid item xs={12}>
        <Typography variant="h3" color="textSecondary">
          {title}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <CustomTypography variant="subtitle1" color="textSecondary">
          {description}
        </CustomTypography>
      </Grid>
      <Grid item xs={12}></Grid>
    </StyledGrid>
  );
};
