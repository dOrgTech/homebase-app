import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import React from "react";

import { DAOsList } from "../modules/daoexplorer/pages/List";
import { DAO } from "../modules/daoexplorer/pages/DAO";
import { Treasury } from "../modules/daoexplorer/pages/Treasury";
import { Proposals } from "../modules/daoexplorer/pages/Proposals";
import { Voting } from "../modules/daoexplorer/pages/Voting";

export const DAOExplorerRouter = (): JSX.Element => {
  const match = useRouteMatch();
  return (
    <Switch>
      <Route path={`${match.url}/daos`}>
        <DAOsList />
      </Route>
      <Route path={`${match.url}/dao/:id`}>
        <Proposals />
      </Route>
      <Route path={`${match.url}/treasury/:id`}>
        <Treasury />
      </Route>
      <Route path={`${match.url}/voting`}>
        <Voting />
      </Route>
      <Redirect to={`${match.url}/daos`} />
    </Switch>
  );
};
