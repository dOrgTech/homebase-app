import React, { useEffect, useMemo } from "react";
import { Route, Switch, useLocation } from "react-router";
import { Redirect, useRouteMatch } from "react-router-dom";

import { StepInfo } from "modules/creator/state";
import {
  SelectTemplate,
  Summary,
  DaoSettings,
  Governance,
  Review,
} from "modules/creator/steps";

import { ProtectedRoute } from "modules/creator/components/ProtectedRoute";
import { Quorum } from "./Quorum";
import mixpanel from "mixpanel-browser";

export const STEPS: StepInfo[] = [
  { title: "Select template", index: 0 },
  { title: "Configure DAO settings", index: 1 },
  { title: "Configure Proposal & Voting", index: 2 },
  { title: "Adjust Quorum", index: 3 },
  { title: "Review information", index: 4 },
];

const urlToStepMap: Record<string, number> = {
  templates: 0,
  dao: 1,
  voting: 2,
  quorum: 3,
  summary: 4,
  review: 5,
};

const AnalyticsWrappedStep: React.FC<{ name: string; index: number }> = ({
  name,
  index,
  children,
}) => {
  useEffect(() => {
    mixpanel.track("Visited Creator Step", {
      stepName: name,
      stepIndex: index,
    });
  }, [index, name]);

  return <>{children}</>;
};

export const StepRouter: React.FC = () => {
  const match = useRouteMatch();

  return (
    <ProtectedRoute>
      <Switch>
        <Route path={`${match.url}/templates`}>
          <AnalyticsWrappedStep name="Select Template" index={1}>
            <SelectTemplate />
          </AnalyticsWrappedStep>
        </Route>
        <Route path={`${match.url}/dao`}>
          <AnalyticsWrappedStep name="DAO Settings" index={2}>
            <DaoSettings />
          </AnalyticsWrappedStep>
        </Route>
        <Route path={`${match.url}/voting`}>
          <AnalyticsWrappedStep name="Governance" index={3}>
            <Governance />
          </AnalyticsWrappedStep>
        </Route>
        <Route path={`${match.url}/quorum`}>
          <AnalyticsWrappedStep name="Quorum" index={4}>
            <Quorum />
          </AnalyticsWrappedStep>
        </Route>
        <Route path={`${match.url}/summary`}>
          <AnalyticsWrappedStep name="Summary" index={5}>
            <Summary />
          </AnalyticsWrappedStep>
        </Route>
        <Route path={`${match.url}/review`}>
          <AnalyticsWrappedStep name="Deployment" index={6}>
            <Review />
          </AnalyticsWrappedStep>
        </Route>
        <Redirect to={`${match.url}/templates`} />
      </Switch>
    </ProtectedRoute>
  );
};

type CreatorRouteNames = keyof typeof urlToStepMap;

export const useStepNumber = (): number => {
  const { pathname } = useLocation();

  return useMemo(() => {
    const extracted: CreatorRouteNames = pathname.endsWith("/")
      ? pathname.split("/").slice(-2)[0]
      : pathname.split("/").slice(-1)[0];

    return urlToStepMap[extracted];
  }, [pathname]);
};

export { SelectTemplate } from "modules/creator/steps/SelectTemplate";
export { Summary } from "modules/creator/steps/Summary";
export { DaoSettings } from "modules/creator/steps/DaoSettings";
export { Governance } from "modules/creator/steps/Governance";
export { Review } from "modules/creator/steps/Review";
