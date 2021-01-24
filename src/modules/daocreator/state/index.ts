export const INITIAL_STATE = {
  activeStep: 0,
  governanceStep: 0,
  onNextStep: () => undefined,
};

export type CreatorState = typeof INITIAL_STATE;

export enum StepperIndex {
  SELECT_TEMPLATE = 1,
  CONFIGURE_TEPLATE,
  REVIEW_INFORMATION,
  LAUNCH_ORGANIZATION,
}

export type CreatorAction = ReturnType<
  typeof updateActiveStep | typeof updateGovernanceStep | typeof updateHandler
>;

export enum ActionTypes {
  UPDATE_HANDLER = "UPDATE_HANDLER",
  UPDATE_STEP = "UPDATE_STEP",
  UPDATE_GOVERNANCE_STEP = "UPDATE_GOVERNANCE_STEP",
}

// StepperIndex[StepperIndex.LAUNCH_ORGANIZATION] === "LAUNCH_ORGANIZATION"
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

export interface StepInfo {
  title: string;
  index: number;
}

export const STEPS: StepInfo[] = [
  { title: "Select template", index: StepperIndex.SELECT_TEMPLATE },
  { title: "Configure template", index: StepperIndex.CONFIGURE_TEPLATE },
  { title: "Review information", index: StepperIndex.REVIEW_INFORMATION },
  { title: "Launch organization", index: StepperIndex.LAUNCH_ORGANIZATION },
];
