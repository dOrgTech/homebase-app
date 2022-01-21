import { Grid, GridProps, styled, Typography } from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { HighlightedBadge } from "modules/explorer/components/styled/HighlightedBadge";
import { UserBadge } from "modules/explorer/components/UserBadge";
import React from "react";

const ArrowContainer = styled(Grid)(({ theme }) => ({
  color: theme.palette.text.primary,
}));

interface Props extends GridProps {
  address: string;
}

export const GuardianTransferBadge: React.FC<Props> = ({ address, ...props }) => {
  return (
    <HighlightedBadge
      alignItems='center'
      direction='row'
      container
      style={{ gap: 20, width: "100%" }}
      {...props}>
      <Grid item>
        <Typography variant={"body1"} color={"textPrimary"}>
          Update guardian
        </Typography>
      </Grid>
      <ArrowContainer item>
        <ArrowForwardIcon color='inherit' />
      </ArrowContainer>
      <Grid item>
        <UserBadge address={address} />
      </Grid>
    </HighlightedBadge>
  );
};
