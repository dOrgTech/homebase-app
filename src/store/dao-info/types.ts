export interface DaoInformation {
  proposal_days: number;
  proposal_hours: number;
  proposal_minutes: number;
  voting_days: number;
  voting_hours: number;
  voting_minutes: number;
  min_stake: number;
  min_support: number;
  stake_returned: number;
}

export interface TokenHolders {
  token_holder: string;
  balance: number;
}
