import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import React from "react";

import { DAOsList } from "modules/explorer/pages/List";
import { DAO } from "modules/explorer/pages/DAO";
import { Holdings } from "modules/explorer/Treasury/pages/Holdings";
import { Proposals } from "modules/explorer/pages/Proposals";
import { Voting } from "modules/explorer/pages/Voting";

export const DAOExplorerRouter = (): JSX.Element => {
  const match = useRouteMatch();
  return (
    <Switch>
      <Route path={`${match.url}/daos`}>
        <DAOsList />
      </Route>
      <Route path={`${match.url}/dao/:id/proposal/:proposalId`}>
        <Voting />
      </Route>
      <Route path={`${match.url}/dao/:id`}>
        <DAO />
      </Route>
      <Route path={`${match.url}/proposals/:id`}>
        <Proposals />
      </Route>
      <Route path={`${match.url}/treasury/:id`}>
        <Holdings />
      </Route>
      <Redirect to={`${match.url}/daos`} />
    </Switch>
  );
};
