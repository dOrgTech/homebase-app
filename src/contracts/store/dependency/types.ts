export interface MigrationParams {
  // DAO Settings
  orgName: string;
  orgSymbol: string;
  description: string;

  // Voting Settings
  proposalDays: number;
  proposalHours: number;
  proposalMinutes: number;
  votingDays: number;
  votingHours: number;
  votingMinutes: number;

  proposeStakeMygt: number;
  proposeStakePercentage: number;
  voteStakeMygt: number;
  voteStakePercentage: number;
  minStake: number;

  // Member Settings
  tokenHolders: TokenHolder[];
  maxAgent: number;
  administrator: string;
}

export interface TokenHolder {
  address: string;
  balance: number;
}

export const INITIAL_MIGRATION_STATE = {
  // DAO Settings
  orgName: "",
  orgSymbol: "",
  description: "",

  // Voting Settings
  proposalDays: 0,
  proposalHours: 0,
  proposalMinutes: 0,
  votingDays: 0,
  votingHours: 0,
  votingMinutes: 0,

  proposeStakeMygt: 0,
  proposeStakePercentage: 0,
  voteStakeMygt: 0,
  voteStakePercentage: 0,
  minStake: 0,

  // Member Settings
  tokenHolders: [],
  maxAgent: 0,
  administrator: "",
};
