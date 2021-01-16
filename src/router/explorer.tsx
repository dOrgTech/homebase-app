import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import React from "react";
import { DAOsList } from "../pages/daoexplorer/List";
import { DAO } from "../pages/daoexplorer/DAO";

export const DAOExplorerRouter = () => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.url}/daos`}>
        <DAOsList />
      </Route>
      <Route path={`${match.url}/daos/:id`}>
        <DAO />
      </Route>
      <Redirect to={`${match.url}/daos`} />
    </Switch>
  );
};
