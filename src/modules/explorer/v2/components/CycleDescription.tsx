import { Typography } from "@material-ui/core";
import React from "react";
import { useDAO } from "services/indexer/dao/hooks/useDAO";

export const CycleDescription: React.FC<{ daoAddress: string }> = ({
  daoAddress,
}) => {
  const { cycleInfo } = useDAO(daoAddress);
  const isVotingPeriod = cycleInfo && cycleInfo.type;

  return (
    <Typography variant="h4" color="textPrimary">
      {isVotingPeriod === "voting"
        ? "VOTING ON PROPOSALS"
        : "CREATING PROPOSALS"}
    </Typography>
  );
};
