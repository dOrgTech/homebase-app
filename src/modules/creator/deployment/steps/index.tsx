import React, { useEffect, useMemo } from "react"
import { Route, Switch, useLocation } from "react-router"
import { Redirect, useRouteMatch } from "react-router-dom"

import { StepInfo } from "modules/creator/state"

import { ProtectedRoute } from "modules/creator/components/ProtectedRoute"
import { ConfigContract } from "./Config"
import { ContractDistribution } from "./Distribution"
import { ContractSummary } from "./Summary"

export const STEPS: StepInfo[] = [
  { title: "Configure Token Contract", index: 0, path: "config" },
  { title: "Token Distribution", index: 1, path: "distribution" },
  { title: "Review Information", index: 2, path: "summary" }
]

const urlToStepMap: Record<string, number> = {
  config: 0,
  distribution: 1,
  summary: 2
}

export const DeploymentStepRouter: React.FC = () => {
  const match = useRouteMatch()

  return (
    <ProtectedRoute>
      <Switch>
        <Route path={`${match.url}/config`}>
          <ConfigContract />
        </Route>
        <Route path={`${match.url}/distribution`}>
          <ContractDistribution />
        </Route>
        <Route path={`${match.url}/summary`}>
          <ContractSummary />
        </Route>
        <Redirect to={`${match.url}/config`} />
      </Switch>
    </ProtectedRoute>
  )
}

type CreatorRouteNames = keyof typeof urlToStepMap

export const useDeploymentStepNumber = (): number => {
  const { pathname } = useLocation()

  return useMemo(() => {
    const extracted: CreatorRouteNames = pathname.endsWith("/")
      ? pathname.split("/").slice(-1)[0]
      : pathname.split("/").slice(-1)[0]

    return urlToStepMap[extracted]
  }, [pathname])
}

export { ConfigContract } from "modules/creator/deployment/steps/Config"
export { ContractDistribution } from "modules/creator/deployment/steps/Distribution"
export { ContractSummary } from "modules/creator/deployment/steps/Summary"
