import { createReducer } from "@reduxjs/toolkit";
import { saveDaoInformation } from "./action";

import { TokenHolders } from "./types";

export interface DaoInformation {
  // Step one
  proposal_days: number | undefined;
  proposal_hours: number | undefined;
  proposal_minutes: number | undefined;
  voting_days: number | undefined;
  voting_hours: number | undefined;
  voting_minutes: number | undefined;
  min_stake: number | undefined;
  propose_stake_mygt: number | undefined;
  propose_stake_percentage: number | undefined;
  vote_stake_mygt: number | undefined;
  vote_stake_percentage: number | undefined;

  max_agent: number | undefined;
  administrator: string;
  token_name: string | undefined;
  token_symbol: string | undefined;
  lock_disabled: boolean;
  description: string;

  token_holders: Array<TokenHolders>;
}

export const initialState: DaoInformation = {
  proposal_days: undefined,
  proposal_hours: undefined,
  proposal_minutes: undefined,
  voting_days: undefined,
  voting_hours: undefined,
  voting_minutes: undefined,
  min_stake: 0,
  propose_stake_mygt: undefined,
  propose_stake_percentage: undefined,
  vote_stake_mygt: undefined,
  vote_stake_percentage: undefined,

  max_agent: undefined,
  administrator: "",
  token_name: "",
  token_symbol: "",
  lock_disabled: false,
  description: "",
  token_holders: [{ token_holder: "", balance: 0 }],
};

export default createReducer(initialState, (builder) =>
  builder.addCase(saveDaoInformation, (state, action) => {
    state.proposal_days = action.payload.proposal_days;
    state.proposal_hours = action.payload.proposal_hours;
    state.proposal_minutes = action.payload.proposal_minutes;
    state.voting_days = action.payload.voting_days;
    state.voting_hours = action.payload.voting_hours;
    state.voting_minutes = action.payload.voting_minutes;
    state.min_stake = action.payload.min_stake;
    state.max_agent = action.payload.max_agent;
    state.administrator = action.payload.administrator;
    state.token_name = action.payload.token_name;
    state.token_symbol = action.payload.token_symbol;
    state.lock_disabled = action.payload.lock_disabled;
    state.description = action.payload.description;
    state.propose_stake_mygt = action.payload.propose_stake_mygt;
    state.propose_stake_percentage = action.payload.propose_stake_percentage;
    state.vote_stake_percentage = action.payload.vote_stake_percentage;
    state.vote_stake_mygt = action.payload.vote_stake_mygt;
    state.token_holders = action.payload.token_holders;
  })
);
