import { useContext, useEffect } from "react";
import { useLocation, useRouteMatch } from "react-router-dom";
import {
  ErrorValues,
  OrgSettings,
  VotingSettings,
} from "../../services/contracts/baseDAO/types";
import { CreatorContext } from "./state/context";
import { useStepNumber } from "./steps";

export const handleOrgFormErrors = (
  values: OrgSettings
): ErrorValues<OrgSettings> => {
  const errors: ErrorValues<OrgSettings> = {};
  Object.keys(values).map((field) => {
    const value = field as keyof OrgSettings;
    if (!values[value]) errors[value] = "Required";
  });
  return errors;
};

export const handleGovernanceFormErrors = (values: VotingSettings) => {
  const errors: ErrorValues<VotingSettings> = {};
  const {
    votingDays,
    votingHours,
    votingMinutes,
    proposeStakePercentage,
    proposeStakeRequired,
    maxProposalSize,
    minXtzAmount,
    maxXtzAmount,
  } = values;

  if (!votingDays && !votingHours && !votingMinutes) {
    errors.votingMinutes = "The voting time must be greater than 0 minutes";
  }
  if (!proposeStakePercentage && !proposeStakeRequired) {
    errors.proposeStakePercentage = "The sum must be greater than 0";
  }

  if (!maxProposalSize || maxProposalSize <= 0) {
    errors.maxProposalSize = "Must be greater than 0";
  }

  if (!minXtzAmount || minXtzAmount <= 0) {
    errors.minXtzAmount = "Must be greater than 0";
  }

  if (!maxXtzAmount || maxXtzAmount <= 0) {
    errors.maxXtzAmount = "Must be greater than 0";
  }

  return errors;
};

export const useCreatorRouteValidation = (): string => {
  const match = useRouteMatch();
  const { pathname } = useLocation();
  const step = useStepNumber();
  const { orgSettings, votingSettings, memberSettings } = useContext(
    CreatorContext
  ).state.data;

  type OrgKeys = keyof typeof orgSettings;
  type VotingKeys = keyof typeof votingSettings;
  type MemberKeys = keyof typeof memberSettings;

  const org = Object.keys(orgSettings) as OrgKeys[];
  const voting = Object.keys(votingSettings) as VotingKeys[];
  const members = Object.keys(memberSettings) as MemberKeys[];

  const needsToFillOrgSettings = org.some((value) => !orgSettings[value]);
  const needsToFillGovernance = voting.some((value) => !votingSettings[value]);
  const needsToFillMembers = members.some((value) => !memberSettings[value]);

  const isPreviousStep = (steps: string[]): boolean => {
    return steps.some((step) => pathname.includes(step));
  };

  if (!step) return "";

  if (needsToFillOrgSettings) return match.url + "/dao";
  if (needsToFillGovernance && !isPreviousStep(["dao"]))
    return match.url + "/voting";
  if (needsToFillMembers && !isPreviousStep(["dao", "voting"]))
    return match.url + "/token";

  return "";
};
