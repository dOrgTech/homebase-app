import React from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { DAOsList } from "modules/explorer/pages/List";
import { DAORouter } from "./daoRouter";

export const DAOExplorerRouter = (): JSX.Element => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.url}/daos`}>
        <DAOsList />
      </Route>
      <Route path={`${match.url}/dao/:id`}>
        <DAORouter />
      </Route>
      <Redirect to={`${match.url}/daos`} />
    </Switch>
  );
};
