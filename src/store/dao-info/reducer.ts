import { createReducer } from "@reduxjs/toolkit";
import { INITIAL_MIGRATION_STATE } from "../../services/contracts/baseDAO/types";
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

export default createReducer(INITIAL_MIGRATION_STATE, (builder) =>
  builder.addCase(saveDaoInformation, (state, action) => {
    // DAO Settings
    state.orgName = action.payload.orgName;
    state.orgSymbol = action.payload.orgSymbol;
    state.description = action.payload.description;

    // Voting Settings
    state.proposalDays = action.payload.proposalDays;
    state.proposalHours = action.payload.proposalHours;
    state.proposalMinutes = action.payload.proposalMinutes;
    state.votingDays = action.payload.votingDays;
    state.votingHours = action.payload.votingHours;
    state.votingMinutes = action.payload.votingMinutes;

    state.proposeStakeMygt = action.payload.proposeStakeMygt;
    state.proposeStakePercentage = action.payload.proposeStakePercentage;
    state.voteStakeMygt = action.payload.voteStakeMygt;
    state.voteStakePercentage = action.payload.voteStakePercentage;
    state.minStake = action.payload.minStake;

    // Member Settings
    state.tokenHolders = action.payload.tokenHolders;
    state.maxAgent = action.payload.maxAgent;
    state.administrator = action.payload.administrator;
  })
);
