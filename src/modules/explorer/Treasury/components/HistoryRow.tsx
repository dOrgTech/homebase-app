import React from "react";
import {
  Grid,
  Paper,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
  withTheme,
} from "@material-ui/core";
import dayjs from "dayjs";

const Container = styled(Grid)(({ theme }) => ({
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  padding: 2,
  height: 83,
  [theme.breakpoints.down("sm")]: {
    height: 183,
    marginBottom: 16,
  },
}));

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
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Container
      container
      direction="row"
      alignItems="center"
      justify="space-between"
    >
      <Grid
        item
        xs={isMobileSmall ? 12 : 6}
        container
        justify={isMobileSmall ? "center" : "flex-start"}
      >
        <TokenName>
          {" "}
          <Cursor variant="subtitle1" color="textSecondary">
            {name}
          </Cursor>
        </TokenName>
      </Grid>
      <Grid
        item
        xs={isMobileSmall ? 12 : 2}
        container
        justify={isMobileSmall ? "center" : "flex-end"}
      >
        <Typography
          variant="subtitle1"
          color="textSecondary"
          align={isMobileSmall ? "center" : "right"}
        >
          {isMobileSmall ? "DATE " : null} {dayjs(date).format("ll")}
        </Typography>
      </Grid>
      <Grid
        xs={isMobileSmall ? 12 : 3}
        item
        container
        justify={isMobileSmall ? "center" : "flex-end"}
      >
        <Grid container direction="row" justify={"center"} alignItems="center">
          {isMobileSmall ? (
            <Typography
              variant="subtitle1"
              color="textSecondary"
              align={isMobileSmall ? "center" : "right"}
            >
              RECIPIENT{" "}
            </Typography>
          ) : null}
          <TokenName>
            {"  "}
            <Cursor variant="subtitle1" color="textSecondary">
              {recipient.slice(0, 6)}...
              {recipient.slice(recipient.length - 4, recipient.length)}
            </Cursor>
          </TokenName>
        </Grid>
      </Grid>
      <Grid
        item
        xs={isMobileSmall ? 12 : 1}
        container
        justify={isMobileSmall ? "center" : "flex-end"}
      >
        <Cursor variant="subtitle1" color="textSecondary" align="right">
          {isMobileSmall ? "AMOUNT " : null} {amount}
        </Cursor>
      </Grid>
    </Container>
  );
};
