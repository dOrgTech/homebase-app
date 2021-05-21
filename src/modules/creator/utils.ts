import { DAOTemplate } from "./state/types";
import {
  ErrorValues,
  OrgSettings,
  VotingSettings,
} from "services/contracts/baseDAO/types";

export const handleOrgFormErrors = (
  values: OrgSettings
): ErrorValues<OrgSettings> => {
  const errors: ErrorValues<OrgSettings> = {};
  Object.keys(values).map((field) => {
    const value = field as keyof OrgSettings;
    if (!values[value] && field !== "governance") errors[value] = "Required";
  });
  return errors;
};

export const handleGovernanceFormErrors = (
  values: VotingSettings,
  template: DAOTemplate,
  totalSupply?: number,
) => {
  const errors: ErrorValues<VotingSettings> = {};
  const {
    votingDays,
    votingHours,
    votingMinutes,
    proposeStakePercentage,
    proposeStakeRequired,
    minXtzAmount,
    maxXtzAmount,
    quorumTreshold,
  } = values;

  if (!votingDays && !votingHours && !votingMinutes) {
    errors.votingMinutes = "The voting time must be greater than 0 minutes";
  }

  if (votingDays <= 0 && votingHours <= 0 && votingMinutes <= 0) {
    errors.votingMinutes = "The voting time must be greater than 0 minutes";
  }

  if (proposeStakeRequired < 0) {
    errors.proposeStakeRequired = "Negative values not allowed";
  }

  if (votingDays < 0) {
    errors.votingMinutes = "Negative values not allowed";
  }

  if (votingHours < 0) {
    errors.votingMinutes = "Negative values not allowed";
  }

  if (votingMinutes < 0) {
    errors.votingMinutes = "Negative values not allowed";
  }

  if (!proposeStakePercentage && !proposeStakeRequired) {
    errors.proposeStakePercentage = "The sum must be greater than 0";
  }

  if (proposeStakeRequired < 0) {
    errors.proposeStakeRequired = "Negative values not allowed";
  }

  if (totalSupply && proposeStakeRequired > Number(totalSupply)) {
    errors.proposeStakeRequired = "The required stake must be smaller than the total supply";
  }

  if (!quorumTreshold || quorumTreshold <= 0) {
    errors.quorumTreshold = "Must be greater than 0";
  }

  if (totalSupply && quorumTreshold > Number(totalSupply)) {
    errors.quorumTreshold = "Quorum Treshold must be smaller than the total supply";
  }

  if (!maxXtzAmount || maxXtzAmount <= 0) {
    errors.maxXtzAmount = "Must be greater than 0";
  }

  if(maxXtzAmount <= minXtzAmount) {
    errors.minXtzAmount = "Must be lower than max XTZ amount"
  }

  return errors;
};
