import React, { useMemo } from "react";
import { SelectTemplate } from "./SelectTemplate";
import { Summary } from "./Summary";
import { StepInfo, StepperIndex } from "../state/types";
import { DaoSettings } from "./DaoSettings";
import { Governance } from "./Governance";
import { Review } from "./Review";
import { TokenSettings } from "./TokenSettings";
import { Route, Switch, useLocation } from "react-router";
import { Redirect, useRouteMatch } from "react-router-dom";

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
  token: 1,
  summary: 2,
  review: 3,
};

export const CurrentStep: React.FC = () => {
  const match = useRouteMatch();

  return (
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
      <Route path={`${match.url}/token`}>
        <TokenSettings />
      </Route>
      <Route path={`${match.url}/summary`}>
        <Summary />
      </Route>
      <Route path={`${match.url}/review`}>
        <Review />
      </Route>
      <Redirect to={`${match.url}/templates`} />
    </Switch>
  );
};

export const useStepNumber = (): number => {
  const { pathname } = useLocation();

  return useMemo(() => {
    const extracted = pathname.endsWith("/")
      ? pathname.split("/").slice(-2)[0]
      : pathname.split("/").slice(-1)[0];

    return urlToStepMap[extracted];
  }, [pathname]);
};
