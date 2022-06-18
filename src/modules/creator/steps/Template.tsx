import { Grid, styled, Typography, Box } from "@material-ui/core";
import React, { useContext, useEffect } from "react";
import { useHistory, withRouter } from "react-router";

import { AccountBalance, FormatListBulleted } from "@material-ui/icons";
import { ActionTypes, CreatorContext } from "modules/creator/state";
import { TitleBock } from "modules/common/TitleBlock";
import { useRouteMatch } from "react-router-dom";

const CustomBox = styled(Grid)(({ theme }) => ({
  height: 273,
  background: "#2F3438",
  borderRadius: 8,
  maxWidth: 330,
  width: "-webkit-fill-available",
  padding: "40px 50px",
  textAlign: "start",
  cursor: "pointer",
  paddingBottom: 0,
  '&:hover': {
    border: "3px solid rgba(129, 254, 183, 0.4)",
    padding: "37px 47px"
  }
}));

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
  const history = useHistory();
  
  const match = useRouteMatch();

  useEffect(() => {
      dispatch({
        type: ActionTypes.UPDATE_NAVIGATION_BAR,
        next: {
          handler: () => {
            history.push(`dao`)
          },
          text: "CONTINUE",
        },
        back: {
          handler: () => history.push("/explorer"),
          text: "BACK",
        },
      });
  }, [dispatch, history, match.path, match.url]);

  return (
    <Box>
      <TitleBock
        title={"DAO Creator"}
        description={"Create an organization by picking a template below."}
      />

      <Grid container justifyContent="space-between" direction="row">
        <CustomBox
          item
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
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
        >
          <CustomList />
          <BoxTitle color="textSecondary">Registry</BoxTitle>
          <BoxDescription color="textSecondary">
            Govern arbitrary smart contracts, curate marketplaces, and more
          </BoxDescription>
        </CustomBox>{" "}
      </Grid>
    </Box>
  );
};
