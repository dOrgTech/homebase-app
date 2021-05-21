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
import { TemplateTableRowContainer } from "modules/explorer/components/TemplateTableRowContainer";

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

export const TreasuryTableRow: React.FC<{
  symbol: string;
  balance: string;
  decimals: number;
}> = ({ symbol, balance }) => {
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <TemplateTableRowContainer
      container
      direction={isMobileSmall ? "column" : "row"}
      alignItems="center"
    >
      <Grid item sm={7}>
        <TokenName>
          {" "}
          <Cursor variant="subtitle1" color="textSecondary">
            {symbol}
          </Cursor>
        </TokenName>
      </Grid>
      <Grid
        item
        sm={5}
        container
        direction="row"
        alignItems="center"
        justify={isMobileSmall ? "space-evenly" : "flex-end"}
      >
        {isMobileSmall ? (
          <Typography variant="subtitle1" color="textSecondary">
            BALANCE{" "}
          </Typography>
        ) : null}
        <Cursor variant="subtitle1" color="textSecondary" align="right">
          {balance}
        </Cursor>
      </Grid>
    </TemplateTableRowContainer>
  );
};
