import {
  OrgSettings,
  VotingSettings,
} from "../../services/contracts/baseDAO/types";
import { ErrorValues, Settings } from "./state/types";

// @TODO: Make it more generic to handle different cases
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
    proposalMinutes,
    proposalHours,
    proposalDays,
    proposeStakePercentage,
    proposeStakeRequired,
    voteStakePercentage,
    voteStakeRequired,
  } = values;

  if (!votingDays && !votingHours && !votingMinutes) {
    errors.votingMinutes = "The voting time must be greater than 0 minutes";
  }

  if (!proposalDays && !proposalHours && !proposalMinutes) {
    errors.proposalMinutes = "The proposal time must be greater than 0 minutes";
  }

  if (!proposeStakePercentage && !proposeStakeRequired) {
    errors.proposeStakePercentage = "The sum must be greater than 0";
  }

  if (!voteStakePercentage && !voteStakeRequired) {
    errors.voteStakePercentage = "The sum must be greater than 0";
  }

  return errors;
};
