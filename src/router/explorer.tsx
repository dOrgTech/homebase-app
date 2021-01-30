import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import React from "react";
import { DAOsList } from "../pages/daoexplorer/pages/List";
import { DAO } from "../pages/daoexplorer/pages/DAO";
import { Treasury } from "../pages/daoexplorer/pages/Treasury";
import { Proposals } from "../pages/daoexplorer/pages/Proposals";
import { Voting } from "../pages/daoexplorer/pages/Voting";

export const DAOExplorerRouter = () => {
  const match = useRouteMatch();

  console.log(match);

  return (
    <Switch>
      <Route path={`${match.url}/daos`}>
        <DAOsList />
      </Route>
      <Route path={`${match.url}/dao/:id`}>
        <DAO />
      </Route>
      <Route path={`${match.url}/treasury/:id`}>
        <Treasury />
      </Route>
      <Route path={`${match.url}/proposals`}>
        <Proposals />
      </Route>
      <Route path={`${match.url}/voting`}>
        <Voting />
      </Route>
      <Redirect to={`${match.url}/daos`} />
    </Switch>
  );
};
