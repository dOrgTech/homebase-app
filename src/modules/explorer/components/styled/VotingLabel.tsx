import React from "react";
import { styled, Paper, Typography } from "@material-ui/core";
import { useCycleInfo } from "services/contracts/baseDAO/hooks/useCycleInfo";

const Container = styled(Paper)({
  background: "rgba(129, 254, 183, 0.07)",
  borderRadius: 4,
  padding: "8px 23px",
  boxShadow: "none",
  width: "100%",
  textAlign: "center",
  maxWidth: 279,
});

export const PeriodLabel: React.FC<{ daoId: string }> = ({ daoId }) => {
  const cycleInfo = useCycleInfo(daoId);
  const isVotingPeriod = cycleInfo && cycleInfo.type;

  return (
    <Container>
      <Typography color="textSecondary">
        {isVotingPeriod === "voting"
          ? "VOTING ON PROPOSALS"
          : "CREATING PROPOSALS"}
      </Typography>
    </Container>
  );
};
