import { Grid, styled, Typography } from "@material-ui/core";
import React from "react";

const MobileHeader = styled(Grid)(({ theme }) => ({
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  borderTop: `2px solid ${theme.palette.primary.light}`,
  minHeight: 48,
  padding: "0 20px",
}));

export const MobileFixedTableHeader: React.FC<{ headerText: string }> = ({
  headerText,
}) => {
  return (
    <MobileHeader container justify="space-between" alignItems="center">
      <Typography variant="body1" color="textSecondary">
        {headerText.toUpperCase()}
      </Typography>
    </MobileHeader>
  );
};
