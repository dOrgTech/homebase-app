import { createAction } from "@reduxjs/toolkit";

import { TokenHolders } from "./types";

export const saveDaoInformation = createAction<{
  proposal_days: number;
  proposal_hours: number;
  proposal_minutes: number;
  voting_days: number;
  voting_hours: number;
  voting_minutes: number;
  min_stake: number;
  min_support: number;
  stake_returned: number;
  max_agent: number;
  administrator: string;
  token_name: string;
  token_symbol: string;
  lock_disabled: boolean;
  description: string;
  min_stake_percentage: boolean;
  stake_returned_percentage: boolean;
  token_holders: Array<TokenHolders>;
}>("dao/saveInformation");
