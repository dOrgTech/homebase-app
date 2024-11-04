import React from "react"
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom"
import { DAOList } from "modules/explorer/pages/DAOList"
import { DAORouter } from "modules/explorer/pages/DAO/router"
import { DAOCreate } from "."
import { TokenDeploymentRouter } from "./token/router"

export const DAOCreatorRouter = (): JSX.Element => {
  const match = useRouteMatch()

  return (
    <Switch>
      <Route path={`${match.url}/build`}>
        <DAOCreate />
      </Route>
      <Route path={`${match.url}`}>
        <TokenDeploymentRouter />
      </Route>
      <Redirect to={`${match.url}/build`} />
    </Switch>
  )
}
