import React, { useCallback, useContext } from "react";
import {
  Grid,
  Paper,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
  withTheme,
} from "@material-ui/core";
import { ActionTypes, ModalsContext } from "modules/explorer/ModalsContext";
import dayjs from "dayjs";
import { useParams } from "react-router";
import { SettingsIcon } from "modules/explorer/components/SettingsIcon";
import { TemplateTableRowContainer } from "modules/explorer/components/TemplateTableRowContainer";

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

const ValueContainer = styled(Grid)({
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

export const RegistryTableRow: React.FC<{
  name: string;
  value: string;
  lastUpdated: string;
}> = ({ name, value, lastUpdated }) => {
  const { id } = useParams<{ id: string }>();
  const { dispatch } = useContext(ModalsContext);
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const onClickRow = useCallback(() => {
    dispatch({
      type: ActionTypes.OPEN_REGISTRY_ITEM,
      payload: {
        key: name,
        value,
      },
    });
  }, [dispatch, name, value]);

  return (
    <TemplateTableRowContainer
      container
      direction="row"
      alignItems="center"
      justify={isMobileSmall ? "center" : "space-between"}
      onClick={onClickRow}
    >
      <Grid
        xs={isMobileSmall ? 12 : 3}
        container
        direction="row"
        alignItems="center"
        justify={isMobileSmall ? "space-evenly" : "flex-start"}
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
        xs={isMobileSmall ? 12 : 4}
        container
        direction="row"
        alignItems="center"
        justify={isMobileSmall ? "space-evenly" : "flex-start"}
      >
        <ValueContainer
          container
          direction="row"
          alignItems="center"
          justify={isMobileSmall ? "space-evenly" : "flex-start"}
        >
          {isMobileSmall ? (
            <Typography
              variant="subtitle1"
              color="textSecondary"
              style={{ fontWeight: "bold" }}
            >
              VALUE:
            </Typography>
          ) : null}
          <Cursor variant="subtitle1" color="textSecondary">
            {value}
          </Cursor>
        </ValueContainer>
      </Grid>
      <Grid
        item
        xs={isMobileSmall ? 12 : 3}
        container
        direction="row"
        alignItems="center"
        justify={isMobileSmall ? "space-evenly" : "flex-start"}
      >
        <Grid
          container
          direction="row"
          alignItems="center"
          justify={isMobileSmall ? "space-evenly" : "flex-start"}
        >
          {isMobileSmall ? (
            <Typography
              variant="subtitle1"
              color="textSecondary"
              style={{ fontWeight: "bold" }}
            >
              LAST UPDATED:
            </Typography>
          ) : null}
          <Cursor variant="subtitle1" color="textSecondary">
            {dayjs(lastUpdated).format("LLL")}
          </Cursor>
        </Grid>
      </Grid>
      <Grid xs={2} item>
        <Grid container direction="row" justify="flex-end" alignItems="center">
          <SettingsIcon
            onClick={(e) => {
              e.stopPropagation();
              dispatch({
                type: ActionTypes.OPEN_REGISTRY_PROPOSAL,
                payload: {
                  isUpdate: true,
                  itemToUpdate: { key: name, value },
                  daoAddress: id,
                },
              });
            }}
          />
        </Grid>
      </Grid>
    </TemplateTableRowContainer>
  );
};
