import React from "react";
import { Grid, Paper, styled, Typography, withTheme } from "@material-ui/core";

const Container = styled(Grid)(({ theme }) => ({
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  padding: 2,
  height: 83,
}));

const TokenName = styled(withTheme(Paper))((props) => ({
  border: "2px solid rgba(255, 255, 255, 0.2)",
  borderRadius: 4,
  boxShadow: "none",
  minWidth: 119,
  width: "fit-content",
  textAlign: "center",
  background: props.theme.palette.primary.main,
  color: props.theme.palette.text.secondary,
  padding: 6,
}));

const Cursor = styled(Typography)({
  cursor: "default",
  textTransform: "uppercase",
});

export const TreasuryTableRow: React.FC<any> = ({ name, balance }) => {
  return (
    <Container
      container
      direction="row"
      alignItems="center"
      justify="space-between"
    >
      <Grid item xs={6}>
        <TokenName>
          {" "}
          <Cursor variant="subtitle1" color="textSecondary">
            {name}
          </Cursor>
        </TokenName>
      </Grid>
      <Grid item xs={6}>
        <Cursor variant="subtitle1" color="textSecondary" align="right">
          {balance}
        </Cursor>
      </Grid>
    </Container>
  );
};
