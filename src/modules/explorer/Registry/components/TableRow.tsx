import React, { useCallback, useContext } from "react";
import { Grid, Paper, styled, Typography, withTheme } from "@material-ui/core";
import { MoreHorizOutlined } from "@material-ui/icons";
import { ActionTypes, ModalsContext } from "modules/explorer/ModalsContext";
import dayjs from "dayjs";
import { useParams } from "react-router";

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

const CustomIcon = styled(MoreHorizOutlined)({
  background: "#3866F9",
  borderRadius: 4,
  paddingLeft: 4,
  paddingRight: 4,
  color: "#fff",
  maxHeight: 22,
  cursor: "pointer",
  fill: "#fff",
  width: 41,
});

const Cursor = styled(Typography)({
  cursor: "default",
  textTransform: "uppercase",
});

export const RegistryTableRow: React.FC<{
  name: string;
  value: string;
  lastUpdated: string;
}> = ({ name, value, lastUpdated }) => {
  const { id } = useParams<{ id: string }>();
  const { dispatch } = useContext(ModalsContext);

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
    <Container
      container
      direction="row"
      alignItems="center"
      justify="space-between"
      onClick={onClickRow}
    >
      <Grid item xs={3}>
        <TokenName>
          {" "}
          <Cursor variant="subtitle1" color="textSecondary">
            {name}
          </Cursor>
        </TokenName>
      </Grid>
      <Grid item xs={4}>
        <Grid container direction="row" justify="center">
          <Cursor variant="subtitle1" color="textSecondary">
            {value}
          </Cursor>
        </Grid>
      </Grid>
      <Grid item xs={3}>
        <Grid container direction="row" justify="center">
          <Cursor variant="subtitle1" color="textSecondary">
            {dayjs(lastUpdated).format("LLL")}
          </Cursor>
        </Grid>
      </Grid>
      <Grid xs={2} item>
        <Grid container direction="row" justify="flex-end" alignItems="center">
          <CustomIcon
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
    </Container>
  );
};
