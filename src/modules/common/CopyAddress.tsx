import { Grid, Typography, useMediaQuery, useTheme } from "@material-ui/core";
import React from "react";
import { toShortAddress } from "services/contracts/utils";
import { CopyButton } from "./CopyButton";

export const CopyAddress: React.FC<{ address: string }> = ({ address }) => {
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Grid container alignItems="center">
      <Grid item>
        <Typography variant="subtitle1" color="textSecondary">
          {isMobileSmall ? toShortAddress(address) : address}
        </Typography>
      </Grid>
      <Grid item>
        <CopyButton text={address} />
      </Grid>
    </Grid>
  );
};
