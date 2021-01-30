export type CreatorState = {
  activeStep: number;
  governanceStep: number;
  onNextStep: () => undefined;
};

export enum StepperIndex {
  SELECT_TEMPLATE,
  CONFIGURE_TEMPLATE,
  REVIEW_INFORMATION,
  LAUNCH_ORGANIZATION,
}

export interface StepInfo {
  title: string;
  index: number;
}

function updateHandler(handler: any) {
  return <const>{
    type: ActionTypes.UPDATE_HANDLER,
    handler,
  };
}

function updateActiveStep(step: number) {
  return <const>{
    type: ActionTypes.UPDATE_STEP,
    step,
  };
}

function updateGovernanceStep(step: number) {
  return <const>{
    type: ActionTypes.UPDATE_GOVERNANCE_STEP,
    step,
  };
}

export type CreatorAction = ReturnType<
  typeof updateActiveStep | typeof updateGovernanceStep | typeof updateHandler
>;

export enum ActionTypes {
  UPDATE_HANDLER = "UPDATE_HANDLER",
  UPDATE_STEP = "UPDATE_STEP",
  UPDATE_GOVERNANCE_STEP = "UPDATE_GOVERNANCE_STEP",
}
