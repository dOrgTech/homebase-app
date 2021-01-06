import { createReducer } from "@reduxjs/toolkit";
import { saveDaoInformation } from "./action";

export interface DaoInformation {
  proposal_days: number | undefined;
  proposal_hours: number | undefined;
  proposal_minutes: number | undefined;
  voting_days: number | undefined;
  voting_hours: number | undefined;
  voting_minutes: number | undefined;
  min_stake: number | undefined;
  min_support: number | undefined;
  stake_returned: number | undefined;
}

export const initialState: DaoInformation = {
  proposal_days: 0,
  proposal_hours: undefined,
  proposal_minutes: undefined,
  voting_days: undefined,
  voting_hours: undefined,
  voting_minutes: undefined,
  min_stake: 0,
  min_support: 0,
  stake_returned: 0,
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
    state.min_support = action.payload.min_support;
    state.stake_returned = action.payload.stake_returned;
  })
);
