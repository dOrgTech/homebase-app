import { Route, Switch, useRouteMatch } from "react-router-dom";
import React from "react";

import { DAO } from "modules/explorer/pages/DAO";
import { Holdings } from "modules/explorer/Treasury/pages/Holdings";
import { Proposals } from "modules/explorer/pages/Proposals";
import { Voting as TreasuryVoting } from "modules/explorer/Treasury/pages/Voting";
import { Voting as RegistryVoting } from "modules/explorer/Registry/pages/Voting";
import { Registry } from "./Registry/pages/Registry";
import { Grid, styled, useMediaQuery, useTheme } from "@material-ui/core";
import { SideBar } from "./components";

const PageLayout = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.main,
  minHeight: "calc(100vh - 102px)",
}));

export const DAORouter = (): JSX.Element => {
  const match = useRouteMatch();
  const theme = useTheme();
  const isMobileExtraSmall = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <PageLayout
      container
      wrap="nowrap"
      direction={isMobileExtraSmall ? "column" : "row"}
    >
      <Switch>
        <Route path={`${match.url}/:id/proposal/treasury/:proposalId`}>
          <SideBar />
          <TreasuryVoting />
        </Route>
        <Route path={`${match.url}/:id/proposal/registry/:proposalId`}>
          <SideBar />
          <RegistryVoting />
        </Route>
        <Route path={`${match.url}/:id/proposals`}>
          <SideBar />
          <Proposals />
        </Route>
        <Route path={`${match.url}/:id/treasury`}>
          <SideBar />
          <Holdings />
        </Route>
        <Route path={`${match.url}/:id/registry`}>
          <SideBar />
          <Registry />
        </Route>
        <Route path={`${match.url}/:id`}>
          <SideBar />
          <DAO />
        </Route>
      </Switch>
    </PageLayout>
  );
};
