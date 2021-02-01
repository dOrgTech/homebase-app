import React from "react";
import { SelectTemplate } from "./SelectTemplate";
import { Summary } from "./Summary";
import { StepInfo, StepperIndex } from "../state/types";
import { DaoSettings } from "./DaoSettings";
import { Governance } from "./Governance";
import { Review } from "./Review";
import { TokenSettings } from "./TokenSettings";

export const STEPS: StepInfo[] = [
  { title: "Select template", index: StepperIndex.SELECT_TEMPLATE },
  { title: "Configure template", index: StepperIndex.CONFIGURE_TEMPLATE },
  { title: "Review information", index: StepperIndex.REVIEW_INFORMATION },
  { title: "Launch organization", index: StepperIndex.LAUNCH_ORGANIZATION },
];

export const CurrentStep: React.FC<{
  activeStep: StepperIndex;
  governanceStep: StepperIndex;
}> = ({ activeStep, governanceStep }) => {
  switch (activeStep) {
    case 0:
      return <SelectTemplate />;
    case 1:
      return governanceStep === 0 ? <DaoSettings /> : <Governance />;
    case 2:
      return <TokenSettings />;
    case 3:
      return <Summary />;
    case 4:
      return <Review />;
    default:
      return <div />;
  }
};
