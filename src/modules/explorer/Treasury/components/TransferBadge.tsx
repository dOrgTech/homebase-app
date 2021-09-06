import { Grid, GridProps, styled, Typography } from "@material-ui/core";
import ArrowForward from "@material-ui/icons/ArrowForward";
import { BigNumber } from "bignumber.js";
import { HighlightedBadge } from "modules/explorer/components/styled/HighlightedBadge";
import { UserBadge } from "modules/explorer/components/UserBadge";
import React from "react";
import { FA2Symbol } from "./FA2Symbol";

const ArrowContainer = styled(Grid)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

interface Props extends GridProps {
  address: string;
  amount: BigNumber;
  currency?: string;
  contract?: string;
  tokenId?: string;
}

export const TransferBadge: React.FC<Props> = ({
  address,
  amount,
  currency,
  contract,
  tokenId,
  ...props
}) => {
  return (
    <HighlightedBadge
      justify="center"
      alignItems="center"
      direction="row"
      container
      style={{ gap: 20 }}
      {...props}
    >
      <Grid item>
        <Typography variant="body1" color="textSecondary">
          {amount.toString()}{" "}
          {contract && tokenId ? (
            <FA2Symbol contractAddress={contract} tokenId={tokenId} />
          ) : (
            currency
          )}
        </Typography>
      </Grid>
      <ArrowContainer item>
        <ArrowForward color="inherit" />
      </ArrowContainer>
      <Grid item>
        <UserBadge address={address} />
      </Grid>
    </HighlightedBadge>
  );
};
