import React from "react";
import { styled, Typography, Grid, GridProps } from "@material-ui/core";
import { useDAO } from "services/indexer/dao/hooks/useDAO";

const Container = styled(Grid)({
  background: "rgba(129, 254, 183, 0.07)",
  borderRadius: 4,
  padding: "8px 23px",
  boxShadow: "none",
  width: "100%",
  textAlign: "center",
  maxWidth: 279,
});

interface Props extends GridProps {
  daoId: string;
}

export const PeriodLabel: React.FC<Props> = ({ daoId, ...props }) => {
  const { cycleInfo } = useDAO(daoId);
  const isVotingPeriod = cycleInfo && cycleInfo.type;

  return (
    <Container {...props}>
      <Typography color="textSecondary">
        {isVotingPeriod === "voting"
          ? "VOTING ON PROPOSALS"
          : "CREATING PROPOSALS"}
      </Typography>
    </Container>
  );
};
