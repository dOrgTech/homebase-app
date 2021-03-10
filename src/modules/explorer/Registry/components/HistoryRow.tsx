import React from "react";
import {
  Grid,
  Link,
  Paper,
  styled,
  Typography,
  withTheme,
} from "@material-ui/core";
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
  width: "100%",
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
});

export const RegistryHistoryRow: React.FC<any> = ({
  name,
  address,
  date,
  id,
}) => {
  const localizedFormat = require("dayjs/plugin/localizedFormat");
  dayjs.extend(localizedFormat);
  return (
    <Link href="https://better-call.dev/" target="_blank">
      <Container
        container
        direction="row"
        alignItems="center"
        justify="space-between"
      >
        <Grid item xs={4}>
          <TokenName>
            {" "}
            <Cursor variant="subtitle1" color="textSecondary">
              {name.length > 15 ? `${name.slice(0, 15)}...` : name}
            </Cursor>
          </TokenName>
        </Grid>
        <Grid item xs={3}>
          <DescriptionText
            variant="subtitle1"
            color="textSecondary"
            align="left"
          >
            Proposal title
          </DescriptionText>
        </Grid>
        <Grid xs={3} item>
          <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="center"
          >
            {" "}
            <DescriptionText
              variant="subtitle1"
              color="textSecondary"
              align="left"
            >
              <Cursor variant="subtitle1" color="textSecondary">
                {dayjs(date).format("ll")}
              </Cursor>
            </DescriptionText>
          </Grid>
        </Grid>
        <Grid item xs={2}>
          <Grid container direction="row">
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
