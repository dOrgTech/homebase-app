import React from "react"
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom"
import { Deployment } from "."
import { ConfigContract } from "./steps/Config"
import { ContractDistribution } from "./steps/Distribution"
import { ContractSummary } from "./steps/Summary"
import { Ownership } from "./steps/Ownership"

export const TokenDeploymentRouter = (): JSX.Element => {
  const match = useRouteMatch()

  return (
    <Switch>
      <Route path={`${match.url}/deployment`}>
        <Deployment />
      </Route>
      <Route path={`${match.url}/ownership`}>
        <Ownership />
      </Route>
      <Route path={`${match.url}/config`}>
        <ConfigContract />
      </Route>
      <Route path={`${match.url}/distribution`}>
        <ContractDistribution />
      </Route>
      <Route path={`${match.url}/summary`}>
        <ContractSummary />
      </Route>
      <Redirect to={`${match.url}/ownership`} />
    </Switch>
  )
}
