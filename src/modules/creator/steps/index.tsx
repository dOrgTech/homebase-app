import React, { useEffect, useMemo } from "react"
import { Route, Switch, useLocation } from "react-router"
import { Redirect, useRouteMatch } from "react-router-dom"

import { StepInfo } from "modules/creator/state"
import { Summary, DaoSettings, Governance, Review } from "modules/creator/steps"

import { ProtectedRoute } from "modules/creator/components/ProtectedRoute"
import { Quorum } from "./Quorum"
import mixpanel from "mixpanel-browser"
import { Template } from "./Template"

export const STEPS: StepInfo[] = [
  { title: "Configure DAO settings", index: 1, path: "dao" },
  { title: "Configure Proposal & Voting", index: 2, path: "voting" },
  { title: "Adjust Quorum", index: 3, path: "quorum" },
  { title: "Review information", index: 4, path: "summary" }
]

const urlToStepMap: Record<string, number> = {
  dao: 0,
  voting: 1,
  quorum: 2,
  summary: 3,
  review: 4
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
        <Route path={`${match.url}/dao`}>
          <AnalyticsWrappedStep name="DAO Settings" index={0}>
            <DaoSettings />
          </AnalyticsWrappedStep>
        </Route>
        <Route path={`${match.url}/voting`}>
          <AnalyticsWrappedStep name="Governance" index={1}>
            <Governance />
          </AnalyticsWrappedStep>
        </Route>
        <Route path={`${match.url}/quorum`}>
          <AnalyticsWrappedStep name="Quorum" index={2}>
            <Quorum />
          </AnalyticsWrappedStep>
        </Route>
        <Route path={`${match.url}/summary`}>
          <AnalyticsWrappedStep name="Summary" index={3}>
            <Summary />
          </AnalyticsWrappedStep>
        </Route>
        <Route path={`${match.url}/review`}>
          <AnalyticsWrappedStep name="Deployment" index={4}>
            <Review />
          </AnalyticsWrappedStep>
        </Route>
        <Redirect to={`${match.url}/dao`} />
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
