import { createAction } from "@reduxjs/toolkit";
import {
  OrgSettings,
  MemberSettings,
  MigrationParams,
  VotingSettings,
} from "../../contracts/store/dependency/types";

export const saveDaoInformation = createAction<MigrationParams>(
  "dao/saveInformation"
);

export const saveOrgSettings = createAction<OrgSettings>("dao/settings");
export const saveVotingSettings = createAction<VotingSettings>("dao/voting");
export const saveMemberSettings = createAction<MemberSettings>("dao/members");
