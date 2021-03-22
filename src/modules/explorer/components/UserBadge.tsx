import { Grid, Typography } from "@material-ui/core";
import { Blockie } from "modules/common/Blockie";
import React from "react";
import { toShortAddress } from "services/contracts/utils";
import { HighlightedBadge } from "./styled/HighlightedBadge";

export const UserBadge: React.FC<{ address: string }> = ({ address }) => {
  return (
    <HighlightedBadge
      justify="center"
      alignItems="center"
      direction="row"
      container
    >
      <Grid item>
        <Blockie address={address} size={23} />
      </Grid>
      <Grid item>
        <Typography
          variant="body1"
          color="textSecondary"
          style={{ paddingLeft: 8 }}
        >
          {toShortAddress(address)}
        </Typography>
      </Grid>
    </HighlightedBadge>
  );
};
