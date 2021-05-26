import React from "react";
import {
  Grid,
  Link,
  Paper,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
  withTheme,
} from "@material-ui/core";
import dayjs from "dayjs";
import { toShortAddress } from "services/contracts/utils";

const Container = styled(Grid)(({ theme }) => ({
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  padding: 2,
  height: 83,
  [theme.breakpoints.down("sm")]: {
    minHeight: 183,
    marginBottom: 16,
    borderBottom: `unset`,
    "& > div": {
      paddingBottom: 16,
    },
  },
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
  width: "100%",
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
});

export const RegistryHistoryRow: React.FC<any> = ({ name, address, date, id }) => {
  const localizedFormat = require("dayjs/plugin/localizedFormat");
  dayjs.extend(localizedFormat);
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Link href="https://better-call.dev/" target="_blank">
      <Container
        container
        direction="row"
        alignItems="center"
        justify="space-between"
      >
        <Grid
          item
          xs={isMobileSmall ? 12 : 4}
          container
          alignItems="center"
          justify={isMobileSmall ? "space-evenly" : "flex-start"}
        >
          <TokenName>
            {" "}
            <Cursor variant="subtitle1" color="textSecondary">
              {name.length > 15 ? `${name.slice(0, 15)}...` : name}
            </Cursor>
          </TokenName>
        </Grid>
        <Grid
          item
          xs={isMobileSmall ? 12 : 3}
          container
          alignItems="center"
          justify={isMobileSmall ? "space-evenly" : "flex-start"}
        >
          <DescriptionText
            variant="subtitle1"
            color="textSecondary"
            align={isMobileSmall ? "center" : "left"}
          >
            Proposal {toShortAddress(id)}
          </DescriptionText>
        </Grid>
        <Grid item xs={isMobileSmall ? 12 : 3}>
          <Grid
            container
            direction="row"
            xs={12}
            item
            justify={isMobileSmall ? "space-evenly" : "flex-end"}
            alignItems="center"
          >
            <DescriptionText
              variant="subtitle1"
              color="textSecondary"
              align={isMobileSmall ? "center" : "left"}
            >
              {isMobileSmall ? (
                <span style={{ fontWeight: "bold" }}>DATE:</span>
              ) : null}{" "}
              {dayjs(date).format("ll")}
            </DescriptionText>
          </Grid>
        </Grid>
        <Grid
          item
          xs={isMobileSmall ? 12 : 2}
          container
          alignItems="center"
          justify={isMobileSmall ? "center" : "flex-start"}
        >
          <Grid
            container
            direction="row"
            xs={12}
            alignItems="center"
            justify={isMobileSmall ? "center" : "flex-start"}
          >
            {isMobileSmall ? (
              <Typography
                variant="subtitle1"
                color="textSecondary"
                style={{ paddingRight: 12, fontWeight: "bold" }}
              >
                PROPOSAL:
              </Typography>
            ) : null}
            <TokenName>
              <Cursor variant="subtitle1" color="textSecondary">
                {address.slice(0, 6)}...
                {address.slice(address.length - 4, address.length)}
              </Cursor>
            </TokenName>
          </Grid>
        </Grid>
      </Container>
    </Link>
  );
};
