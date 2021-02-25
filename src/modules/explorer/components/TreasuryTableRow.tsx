import React from "react";
import { Grid, Paper, styled, Typography, withTheme } from "@material-ui/core";
import { TokenHolder } from "modules/creator/state";
import { MoreHorizOutlined } from "@material-ui/icons";

const Container = styled(Grid)({
  borderBottom: "2px solid #3D3D3D",
  padding: 2,
  height: 83,
});

const TokenName = styled(withTheme(Paper))((props) => ({
  border: "2px solid rgba(255, 255, 255, 0.2)",
  borderRadius: 4,
  boxShadow: "none",
  width: 119,
  textAlign: "center",
  background: props.theme.palette.primary.main,
  color: props.theme.palette.text.secondary,
  padding: 6,
}));

const CustomIcon = styled(MoreHorizOutlined)({
  background: "#3866F9",
  borderRadius: 4,
  paddingLeft: 4,
  paddingRight: 4,
  color: "#fff",
  maxHeight: 22,
  cursor: "pointer",
  fill: "#fff",
});

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
      <Grid item xs={5}>
        <Cursor variant="subtitle1" color="textSecondary" align="right">
          {balance}
        </Cursor>
      </Grid>
      <Grid xs={1} item>
        <Grid container direction="row" justify="center" alignItems="center">
          <CustomIcon />
        </Grid>
      </Grid>
    </Container>
  );
};
