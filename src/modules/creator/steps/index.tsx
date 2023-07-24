import React, { useEffect, useMemo } from "react"
import { Route, Switch, useLocation } from "react-router"
import { Redirect, useRouteMatch } from "react-router-dom"

import { StepInfo } from "modules/creator/state"
import { Summary, DaoSettings, Governance, Review } from "modules/creator/steps"

import { ProtectedRoute } from "modules/creator/components/ProtectedRoute"
import { Quorum } from "./Quorum"
import mixpanel from "mixpanel-browser"
import { Template } from "./Template"
import { DeploymentType } from "./DeploymentType"

export const STEPS: StepInfo[] = [
  { title: "DAO Template", index: 0, path: "template" },
  { title: "DAO Basics", index: 1, path: "dao" },
  { title: "Proposals & Voting", index: 2, path: "voting" },
  { title: "Quorum", index: 3, path: "quorum" },
  { title: "Review Information", index: 4, path: "summary" },
  { title: "Deployment Type", index: 5, path: "type" }
]

export const urlToStepMap: Record<string, number> = {
  template: 0,
  dao: 1,
  voting: 2,
  quorum: 3,
  summary: 4,
  type: 5,
  review: 6
}

const AnalyticsWrappedStep: React.FC<{ name: string; index: number }> = ({ name, index, children }) => {
  useEffect(() => {
    mixpanel.track("Visited Creator Step", {
      stepName: name,
      stepIndex: index
    })
  }, [index, name])

  return <>{children}</>
}

export const StepRouter: React.FC = () => {
  const match = useRouteMatch()

  return (
    <ProtectedRoute>
      <Switch>
        <Route path={`${match.url}/template`}>
          <AnalyticsWrappedStep name="Select Template" index={0}>
            <Template />
          </AnalyticsWrappedStep>
        </Route>
        <Route path={`${match.url}/dao`}>
          <AnalyticsWrappedStep name="DAO Settings" index={1}>
            <DaoSettings />
          </AnalyticsWrappedStep>
        </Route>
        <Route path={`${match.url}/voting`}>
          <AnalyticsWrappedStep name="Governance" index={2}>
            <Governance />
          </AnalyticsWrappedStep>
        </Route>
        <Route path={`${match.url}/quorum`}>
          <AnalyticsWrappedStep name="Quorum" index={3}>
            <Quorum />
          </AnalyticsWrappedStep>
        </Route>
        <Route path={`${match.url}/summary`}>
          <AnalyticsWrappedStep name="Summary" index={4}>
            <Summary />
          </AnalyticsWrappedStep>
        </Route>
        <Route path={`${match.url}/type`}>
          <AnalyticsWrappedStep name="Deployment Type" index={5}>
            <DeploymentType />
          </AnalyticsWrappedStep>
        </Route>
        <Route path={`${match.url}/review`}>
          <AnalyticsWrappedStep name="Deployment" index={6}>
            <Review />
          </AnalyticsWrappedStep>
        </Route>
        <Redirect to={`${match.url}/template`} />
      </Switch>
    </ProtectedRoute>
  )
}

type CreatorRouteNames = keyof typeof urlToStepMap

export const useStepNumber = (): number => {
  const { pathname } = useLocation()

  return useMemo(() => {
    const extracted: CreatorRouteNames = pathname.endsWith("/")
      ? pathname.split("/").slice(-2)[0]
      : pathname.split("/").slice(-1)[0]

    return urlToStepMap[extracted]
  }, [pathname])
}

export { Summary } from "modules/creator/steps/Summary"
export { Template } from "modules/creator/steps/Template"
export { DaoSettings } from "modules/creator/steps/DaoSettings"
export { Governance } from "modules/creator/steps/Governance"
export { Review } from "modules/creator/steps/Review"
export { DeploymentType } from "modules/creator/steps/DeploymentType"
