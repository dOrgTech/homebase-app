import { createReducer } from "@reduxjs/toolkit";
import { INITIAL_MIGRATION_STATE } from "../../contracts/store/dependency/types";
import {
  saveMemberSettings,
  saveOrgSettings,
  saveVotingSettings,
} from "./action";

export default createReducer(INITIAL_MIGRATION_STATE, (builder) =>
  builder
    .addCase(saveVotingSettings, (state, { payload }) => {
      state.votingSettings = { ...payload };
    })
    .addCase(saveOrgSettings, (state, { payload }) => {
      state.orgSettings = { ...payload };
    })
    .addCase(saveMemberSettings, (state, { payload }) => {
      state.memberSettings = { ...payload };
    })
);
