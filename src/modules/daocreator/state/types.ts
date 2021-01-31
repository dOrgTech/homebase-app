export type CreatorState = {
  activeStep: number;
  governanceStep: number;
  onNextStep: () => undefined;
  data: MigrationParams;
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

export type CreatorAction = ReturnType<
  | typeof updateActiveStep
  | typeof updateGovernanceStep
  | typeof updateHandler
  | typeof updateOrgSettings
  | typeof updateVotingSettings
  | typeof updateMemberSettings
>;

export enum ActionTypes {
  UPDATE_HANDLER = "UPDATE_HANDLER",
  UPDATE_STEP = "UPDATE_STEP",
  UPDATE_GOVERNANCE_STEP = "UPDATE_GOVERNANCE_STEP",
  UPDATE_VOTING_SETTINGS = "UPDATE_VOTING_SETTINGS",
  UPDATE_MEMBERS_SETTINGS = "UPDATE_MEMBERS_SETTINGS",
  UPDATE_ORGANIZATION_SETTINGS = "UPDATE_ORGANIZATION_SETTINGS",
}

export interface MigrationParams {
  orgSettings: OrgSettings;
  votingSettings: VotingSettings;
  memberSettings: MemberSettings;
}

export interface TokenHolder {
  address: string;
  balance: number;
}

export type OrgSettings = {
  name: string;
  symbol: string;
  description: string;
};

export type VotingSettings = {
  proposalDays: number;
  proposalHours: number;
  proposalMinutes: number;
  votingDays: number;
  votingHours: number;
  votingMinutes: number;
  proposeStakeRequired: number;
  proposeStakePercentage: number;
  voteStakeRequired: number;
  voteStakePercentage: number;
  minStake: number;
};

export type MemberSettings = {
  tokenHolders: TokenHolder[];
  maxAgent: number;
  administrator: string;
};

export type Settings = OrgSettings | VotingSettings | MemberSettings;

export type ErrorValues<T> = Partial<Record<keyof T, string>>;

export const INITIAL_MIGRATION_STATE: MigrationParams = {
  orgSettings: {
    name: "",
    symbol: "",
    description: "",
  },
  votingSettings: {
    proposalDays: 0,
    proposalHours: 0,
    proposalMinutes: 0,
    votingDays: 0,
    votingHours: 0,
    votingMinutes: 0,
    proposeStakeRequired: 0,
    proposeStakePercentage: 0,
    voteStakeRequired: 0,
    voteStakePercentage: 0,
    minStake: 0,
  },
  memberSettings: {
    tokenHolders: [],
    maxAgent: 0,
    administrator: "",
  },
};
