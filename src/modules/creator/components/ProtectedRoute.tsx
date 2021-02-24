import React, { FC, useContext, useEffect } from "react";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { CreatorContext } from "modules/creator/state";
import { useStepNumber } from "modules/creator/steps";
import { handleGovernanceFormErrors } from "modules/creator/utils";

export const useCreatorValidation = (): string => {
  const match = useRouteMatch();
  const { pathname } = useLocation();
  const step = useStepNumber();
  const { orgSettings, votingSettings, memberSettings } = useContext(
    CreatorContext
  ).state.data;

  type OrgKeys = keyof typeof orgSettings;
  type MemberKeys = keyof typeof memberSettings;

  const org = Object.keys(orgSettings) as OrgKeys[];
  const members = Object.keys(memberSettings) as MemberKeys[];

  const needsToFillOrgSettings = org.some((value) => !orgSettings[value]);
  const needsToFillGovernance = Object.keys(
    handleGovernanceFormErrors(votingSettings)
  ).length;
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

export const ProtectedRoute: FC = ({ children }) => {
  const { successful } = useContext(CreatorContext).state.deploymentStatus;
  const history = useHistory();
  const redirectUrl = useCreatorValidation();
  useEffect(() => {
    if (redirectUrl && !successful) history.replace(redirectUrl);
  }, [history, redirectUrl, successful]);

  return <React.Fragment>{children}</React.Fragment>;
};
