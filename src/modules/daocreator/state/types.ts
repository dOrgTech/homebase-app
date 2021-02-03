import {
  MemberSettings,
  MigrationParams,
  OrgSettings,
  VotingSettings,
} from "../../../services/contracts/baseDAO/types";

export interface NavigationBarProps {
  back?: {
    text: string;
    handler: () => void;
  };
  next?: {
    text: string;
    handler: () => void;
  };
}

type DeploymentStatus = {
  deploying: boolean;
  contract?: string;
};

export type CreatorState = {
  activeStep: number;
  governanceStep: number;
  data: MigrationParams;
  deploymentStatus: DeploymentStatus;
} & NavigationBarProps;

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

function updateNavigationBar(props: NavigationBarProps) {
  return <const>{
    type: ActionTypes.UPDATE_NAVIGATION_BAR,
    ...props,
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

function updateOrgSettings(org: OrgSettings) {
  return <const>{
    type: ActionTypes.UPDATE_ORGANIZATION_SETTINGS,
    org,
  };
}

function updateVotingSettings(voting: VotingSettings) {
  return <const>{
    type: ActionTypes.UPDATE_VOTING_SETTINGS,
    voting,
  };
}

function updateMemberSettings(members: MemberSettings) {
  return <const>{
    type: ActionTypes.UPDATE_MEMBERS_SETTINGS,
    members,
  };
}

function updateDeploymentStatus({ deploying, contract }: DeploymentStatus) {
  return <const>{
    type: ActionTypes.UPDATE_DEPLOYMENT_STATUS,
    status: { deploying, contract },
  };
}

export type CreatorAction = ReturnType<
  | typeof updateActiveStep
  | typeof updateGovernanceStep
  | typeof updateNavigationBar
  | typeof updateOrgSettings
  | typeof updateVotingSettings
  | typeof updateMemberSettings
  | typeof updateDeploymentStatus
>;

export enum ActionTypes {
  UPDATE_NAVIGATION_BAR = "UPDATE_NAVIGATION_BAR",
  UPDATE_STEP = "UPDATE_STEP",
  UPDATE_GOVERNANCE_STEP = "UPDATE_GOVERNANCE_STEP",
  UPDATE_VOTING_SETTINGS = "UPDATE_VOTING_SETTINGS",
  UPDATE_MEMBERS_SETTINGS = "UPDATE_MEMBERS_SETTINGS",
  UPDATE_ORGANIZATION_SETTINGS = "UPDATE_ORGANIZATION_SETTINGS",
  UPDATE_DEPLOYMENT_STATUS = "UPDATE_DEPLOYMENT_STATUS",
}
export interface TokenHolder {
  address: string;
  balance: number;
}
