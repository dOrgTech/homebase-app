import React from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { DAOList } from "modules/explorer/pages/DAOList";
import { DAORouter } from "modules/explorer/pages/DAO/router";
import { useTezos } from "services/beacon/hooks/useTezos";

export const DAOExplorerRouter = (): JSX.Element => {
  const match = useRouteMatch();
  const { network } = useTezos();

  return (
    <Switch>
      <Route path={`${match.url}/daos/:network`}>
        <DAOList />
      </Route>
      <Route path={`${match.url}/dao/:network/:id`}>
        <DAORouter />
      </Route>
      <Redirect to={`${match.url}/daos/${network}`} />
    </Switch>
  );
};
