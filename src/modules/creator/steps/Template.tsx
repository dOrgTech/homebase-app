import {
  Grid,
  styled,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
  makeStyles,
} from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { useHistory, withRouter } from "react-router";

import { AccountBalance, FormatListBulleted } from "@material-ui/icons";
import {
  ActionTypes,
  CreatorContext,
  DAOTemplate,
} from "modules/creator/state";
import { TitleBlock } from "modules/common/TitleBlock";
import { useRouteMatch } from "react-router-dom";

const CustomBox = styled(Grid)(({ theme }) => ({
  height: 273,
  background: "#2F3438",
  borderRadius: 8,
  maxWidth: 320,
  width: "-webkit-fill-available",
  padding: "40px 50px",
  textAlign: "start",
  cursor: "pointer",
  paddingBottom: 0,
  "&:hover": {
    border: "3px solid rgba(129, 254, 183, 0.4)",
    padding: "37px 47px",
  },
  ["@media (max-width:1167px)"]: {
    marginBottom: 20,
  },
}));

const styles = makeStyles({
  selected: {
    border: "3px solid rgba(129, 254, 183, 0.4)",
    padding: "37px 47px",
  },
});

const ErrorText = styled(Typography)({
  display: "block",
  fontSize: 14,
  color: "red",
  marginTop: 8,
});

const CustomBalance = styled(AccountBalance)(({ theme }) => ({
  width: 64,
  height: 64,
  color: theme.palette.secondary.light,
  marginBottom: 16,
}));

const CustomList = styled(FormatListBulleted)(({ theme }) => ({
  width: 64,
  height: 64,
  color: theme.palette.secondary.light,
  marginBottom: 16,
}));

const BoxTitle = styled(Typography)({
  fontSize: 18,
  fontWeight: 500,
  fontFamily: "Roboto Mono",
  marginBottom: 10,
});

const BoxDescription = styled(Typography)({
  fontWeight: 400,
  fontSize: 16,
});

export const Template = (): JSX.Element => {
  const { state, dispatch, updateCache } = useContext(CreatorContext);
  const { template } = state.data;

  const history = useHistory();

  const match = useRouteMatch();

  const theme = useTheme();
  const style = styles();

  const isMobileSmall = useMediaQuery(theme.breakpoints.down("xs"));

  const [selectedTemplate, setTemplate] = useState<DAOTemplate>(template);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    dispatch({
      type: ActionTypes.UPDATE_NAVIGATION_BAR,
      next: {
        handler: () => {
          if (!selectedTemplate) {
            return setError(true);
          }
          dispatch({
            type: ActionTypes.UPDATE_TEMPLATE,
            template: selectedTemplate,
          });
          return history.push(`dao`);
        },
        text: "Continue",
      },
      back: {
        handler: () => history.push("/explorer"),
        text: "Back",
      },
    });
  }, [dispatch, history, match.path, match.url, selectedTemplate]);

  const update = (templateValue: DAOTemplate) => {
    setError(false);
    setTemplate(templateValue);
  };

  return (
    <Box>
      <TitleBlock
        title={"DAO Creator"}
        description={"Create an organization by picking a template below."}
      />
      <Grid
        container
        justifyContent={isMobileSmall ? "center" : "space-between"}
        direction="row"
      >
        <CustomBox
          item
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
          xs={isMobileSmall ? 12 : 6}
          onClick={() => update("treasury")}
          className={selectedTemplate === "treasury" ? style.selected : ""}
        >
          <CustomBalance />
          <BoxTitle color="textSecondary">Treasury</BoxTitle>
          <BoxDescription color="textSecondary">
            Manage resources (tez, FA2, NFT) collectively
          </BoxDescription>
        </CustomBox>
        <CustomBox
          item
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
          xs={isMobileSmall ? 12 : 6}
          onClick={() => update("registry")}
          className={selectedTemplate === "registry" ? style.selected : ""}
        >
          <CustomList />
          <BoxTitle color="textSecondary">Registry</BoxTitle>
          <BoxDescription color="textSecondary">
            Govern arbitrary smart contracts, curate marketplaces, and more
          </BoxDescription>
        </CustomBox>{" "}
      </Grid>
      {error ? (
        <ErrorText>{"Must select a template in order to continue"}</ErrorText>
      ) : null}
    </Box>
  );
};
