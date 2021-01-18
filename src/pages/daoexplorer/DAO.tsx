import { Box, Grid, styled } from "@material-ui/core";
import React from "react";
import { useRouteMatch } from "react-router-dom";

const SideBar = styled(Box)({
  width: 102,
  borderRight: "2px solid #3D3D3D"
})

export const DAO = () => {
  console.log("HEY")
  const match = useRouteMatch();

  return (
    <Grid container>
      <Grid item>
        <SideBar>

        </SideBar>
      </Grid>
      <Grid item xs></Grid>
    </Grid>
  );
};
