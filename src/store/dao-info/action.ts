import { createAction } from "@reduxjs/toolkit";
import {
  MigrationParams,
  OrgSettings,
  VotingSettings,
  MemberSettings,
} from "../../services/contracts/baseDAO/types";

export const saveDaoInformation = createAction<MigrationParams>(
  "dao/saveInformation"
);

export const saveOrgSettings = createAction<OrgSettings>("dao/settings");
export const saveVotingSettings = createAction<VotingSettings>("dao/voting");
export const saveMemberSettings = createAction<MemberSettings>("dao/members");
