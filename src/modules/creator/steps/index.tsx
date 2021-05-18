import React, { useMemo } from "react";
import { Route, Switch, useLocation } from "react-router";
import { Redirect, useRouteMatch } from "react-router-dom";

import { StepInfo, StepperIndex } from "modules/creator/state";
import {
  SelectTemplate,
  Summary,
  DaoSettings,
  Governance,
  Review,
} from "modules/creator/steps";

import { ProtectedRoute } from "modules/creator/components/ProtectedRoute";

export const STEPS: StepInfo[] = [
  { title: "Select template", index: StepperIndex.SELECT_TEMPLATE },
  { title: "Configure template", index: StepperIndex.CONFIGURE_TEMPLATE },
  { title: "Review information", index: StepperIndex.REVIEW_INFORMATION },
  { title: "Launch organization", index: StepperIndex.LAUNCH_ORGANIZATION },
];

const urlToStepMap: Record<string, number> = {
  templates: 0,
  dao: 1,
  voting: 1,
  summary: 2,
  review: 4,
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

    console.log(extracted)
    return urlToStepMap[extracted];
  }, [pathname]);
};

export { SelectTemplate } from "modules/creator/steps/SelectTemplate";
export { Summary } from "modules/creator/steps/Summary";
export { DaoSettings } from "modules/creator/steps/DaoSettings";
export { Governance } from "modules/creator/steps/Governance";
export { Review } from "modules/creator/steps/Review";
