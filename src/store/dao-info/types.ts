export interface DaoInformation {
  proposal_days: number;
  proposal_hours: number;
  proposal_minutes: number;
  voting_days: number;
  voting_hours: number;
  voting_minutes: number;
  min_stake: number;
  propose_stake_mygt: number;
  propose_stake_percentage: number;
  vote_stake_mygt: number;
  vote_stake_percentage: number;
}

export interface TokenHolders {
  token_holder: string;
  balance: number;
}
