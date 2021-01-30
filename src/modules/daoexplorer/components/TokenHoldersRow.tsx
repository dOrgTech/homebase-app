import { Grid, styled, Typography } from "@material-ui/core";
import React from "react";

export interface TokenHoldersRowData {
  token_holder: string;
  balance: number;
}

const Container = styled(Grid)({
  borderBottom: "1px solid #3D3D3D",
  padding: 2,
});

export const TokenHoldersRow: React.FC<TokenHoldersRowData> = ({
  token_holder,
  balance,
}) => {
  return (
    <Container
      container
      direction="row"
      alignItems="center"
      justify="space-between"
    >
      <Grid item xs={6}>
        <Typography variant="body2" color="textSecondary">
          {token_holder.slice(0, 6)}...
          {token_holder.slice(token_holder.length - 4, token_holder.length)}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="subtitle1" color="textSecondary" align="right">
          {balance} MGT
        </Typography>
      </Grid>
    </Container>
  );
};
