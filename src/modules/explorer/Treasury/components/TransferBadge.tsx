import { Grid, GridProps, styled, Typography } from "@material-ui/core";
import ArrowForward from "@material-ui/icons/ArrowForward";
import { Blockie } from "modules/common/Blockie";
import { HighlightedBadge } from "modules/explorer/components/styled/HighlightedBadge";
import React from "react";
import { toShortAddress } from "services/contracts/utils";

const ArrowContainer = styled(Grid)(({ theme }) => ({
  color: theme.palette.text.secondary,
  padding: "0 10px",
}));

interface Props extends GridProps {
  address: string;
  amount: string;
  currency: string;
}

export const TransferBadge: React.FC<Props> = ({
  address,
  amount,
  currency,
  ...props
}) => {
  return (
    <HighlightedBadge
      justify="center"
      alignItems="center"
      direction="row"
      container
      {...props}
    >
      <Grid item>
        <Typography variant="body1" color="textSecondary">
          {amount} {currency}
        </Typography>
      </Grid>
      <ArrowContainer item>
        <ArrowForward color="inherit" />
      </ArrowContainer>
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
