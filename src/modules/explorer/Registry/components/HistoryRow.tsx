import React from "react";
import { Grid, Paper, styled, Typography, withTheme } from "@material-ui/core";
import dayjs from "dayjs";

const Container = styled(Grid)(({ theme }) => ({
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  padding: 2,
  height: 83,
}));

const TokenName = styled(withTheme(Paper))((props) => ({
  border: "2px solid rgba(255, 255, 255, 0.2)",
  borderRadius: 4,
  boxShadow: "none",
  minWidth: 146,
  width: "fit-content",
  height: 26,
  textAlign: "center",
  background: props.theme.palette.primary.main,
  color: props.theme.palette.text.secondary,
  padding: 6,
}));

const Cursor = styled(Typography)({
  cursor: "default",
  textTransform: "uppercase",
});

const DescriptionText = styled(Typography)({
  maxWidth: 252,
  marginLeft: 44,
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
});

export const RegistryHistoryRow: React.FC<any> = ({
  name,
  description,
  address,
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
        <Grid container direction="row" alignItems="center">
          <TokenName>
            {" "}
            <Cursor variant="subtitle1" color="textSecondary">
              {name}
            </Cursor>
          </TokenName>
          <DescriptionText
            variant="subtitle1"
            color="textSecondary"
            align="left"
          >
            {description}
          </DescriptionText>
        </Grid>
      </Grid>
      <Grid xs={3} item>
        <Grid container direction="row" justify="flex-end" alignItems="center">
          {" "}
          <Cursor variant="subtitle1" color="textSecondary">
            {dayjs(date).format("ll")}
          </Cursor>
        </Grid>
      </Grid>
      <Grid item xs={3}>
        <Grid container direction="row" justify="flex-end">
          <TokenName>
            <Cursor variant="subtitle1" color="textSecondary">
              {address.slice(0, 6)}...
              {address.slice(address.length - 4, address.length)}
            </Cursor>
          </TokenName>
        </Grid>
      </Grid>
    </Container>
  );
};
