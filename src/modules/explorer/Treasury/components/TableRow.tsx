import React, { useContext } from "react";
import {
  Grid,
  Paper,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
  withTheme,
} from "@material-ui/core";
import { SettingsIcon } from "modules/explorer/components/SettingsIcon";
import { ActionTypes, ModalsContext } from "modules/explorer/ModalsContext";
import { useParams } from "react-router-dom";

const Container = styled(Grid)(({ theme }) => ({
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  padding: 2,
  minHeight: 83,
  [theme.breakpoints.down("sm")]: {
    "& > div": {
      paddingBottom: 24,
    },
  },
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
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const { dispatch } = useContext(ModalsContext);
  const { id } = useParams<{ id: string }>();

  return (
    <Container
      container
      direction={isMobileSmall ? "column" : "row"}
      alignItems="center"
    >
      <Grid item sm={5}>
        <TokenName>
          {" "}
          <Cursor variant="subtitle1" color="textSecondary">
            {name}
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
      <Grid sm={2} item>
        <Grid container direction="row" justify="flex-end" alignItems="center">
          <SettingsIcon
            onClick={(e) => {
              e.stopPropagation();
              dispatch({
                type: ActionTypes.OPEN_TREASURY_PROPOSAL,
                payload: {
                  daoAddress: id,
                },
              });
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
};
