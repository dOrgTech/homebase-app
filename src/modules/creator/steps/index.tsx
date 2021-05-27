import React, { useMemo } from "react";
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

export const StepRouter: React.FC = () => {
  const match = useRouteMatch();

  return (
    <ProtectedRoute>
      <Switch>
        <Route path={`${match.url}/templates`}>
          <SelectTemplate />
        </Route>
        <Route path={`${match.url}/dao`}>
          <DaoSettings />
        </Route>
        <Route path={`${match.url}/voting`}>
          <Governance />
        </Route>
        <Route path={`${match.url}/quorum`}>
          <Quorum />
        </Route>
        <Route path={`${match.url}/summary`}>
          <Summary />
        </Route>
        <Route path={`${match.url}/review`}>
          <Review />
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
