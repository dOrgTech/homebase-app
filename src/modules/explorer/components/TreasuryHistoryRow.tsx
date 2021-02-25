import React from "react";
import { Grid, Paper, styled, Typography, withTheme } from "@material-ui/core";
import dayjs from "dayjs";

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

const Cursor = styled(Typography)({
  cursor: "default",
  textTransform: "uppercase",
});

export const TreasuryHistoryRow: React.FC<any> = ({
  name,
  amount,
  recipient,
  date,
}) => {
  const localizedFormat = require("dayjs/plugin/localizedFormat");
  dayjs.extend(localizedFormat);
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
      <Grid item xs={2}>
        <Typography variant="subtitle1" color="textSecondary" align="right">
          {dayjs(date).format("ll")}
        </Typography>
      </Grid>
      <Grid xs={3} item>
        <Grid container direction="row" justify="center" alignItems="center">
          <TokenName>
            {" "}
            <Cursor variant="subtitle1" color="textSecondary">
              {recipient.slice(0, 6)}...
              {recipient.slice(recipient.length - 4, recipient.length)}
            </Cursor>
          </TokenName>
        </Grid>
      </Grid>
      <Grid item xs={1}>
        <Cursor variant="subtitle1" color="textSecondary" align="right">
          {amount}
        </Cursor>
      </Grid>
    </Container>
  );
};
