import { createAction } from "@reduxjs/toolkit";

import { TokenHolders } from "./types";

export const saveDaoInformation = createAction<{
  // Step One
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

  // Step two
  max_agent: number;
  administrator: string;
  token_name: string;
  token_symbol: string;
  lock_disabled: boolean;
  description: string;
  token_holders: Array<TokenHolders>;
}>("dao/saveInformation");
