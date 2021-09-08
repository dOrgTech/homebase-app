import React from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { DAOList } from "modules/explorer/v2/pages/DAOList";

export const DAOExplorerRouter = (): JSX.Element => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.url}/daos`}>
        <DAOList />
      </Route>
      <Redirect to={`${match.url}/daos`} />
    </Switch>
  );
};
