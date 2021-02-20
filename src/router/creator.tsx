import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import React from "react";
import { DAOCreate } from "modules/creator";
import { DaoSettings, Governance, Review, Summary, TokenSettings } from "modules/creator/steps";

export const DAOCreatorRouter = (): JSX.Element => {
  const match = useRouteMatch();
  return (
    <Switch>
      <Route path={`${match.url}`}>
        <DAOCreate />
      </Route>
      <Route path={`${match.url}/creator/settings`}>
        <TokenSettings />
      </Route>
      <Route path={`${match.url}/creator/dao`}>
        <DaoSettings />
      </Route>
      <Route path={`${match.url}/creator/governance`}>
        <Governance />
      </Route>
      <Route path={`${match.url}/creator/review`}>
        <Review />
      </Route>
      <Route path={`${match.url}/creator/summary`}>
        <Summary />
      </Route>
      <Redirect to={`${match.url}/creator`} />
    </Switch>
  );
};
