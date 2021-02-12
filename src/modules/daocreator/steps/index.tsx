import React from "react";
import { SelectTemplate } from "./SelectTemplate";
import { Summary } from "./Summary";
import { StepInfo, StepperIndex } from "../state/types";
import { DaoSettings } from "./DaoSettings";
import { Governance } from "./Governance";
import { Review } from "./Review";
import { TokenSettings } from "./TokenSettings";
import { Route, Switch } from "react-router";
import { useRouteMatch } from "react-router-dom";

export const STEPS: StepInfo[] = [
  { title: "Select template", index: StepperIndex.SELECT_TEMPLATE },
  { title: "Configure template", index: StepperIndex.CONFIGURE_TEMPLATE },
  { title: "Review information", index: StepperIndex.REVIEW_INFORMATION },
  { title: "Launch organization", index: StepperIndex.LAUNCH_ORGANIZATION },
];

export const CurrentStep: React.FC = () => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.url}/templates`}>
        <SelectTemplate />;
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
      <Route path={`${match.url}/`}>
        <SelectTemplate />;
      </Route>
    </Switch>
  );
};
