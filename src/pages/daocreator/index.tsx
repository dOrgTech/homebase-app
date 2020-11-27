import { Box, Grid, styled, Typography } from "@material-ui/core";

import React, { useState } from "react";
import { ConnectWallet } from "./ConnectWallet";

const PageContainer = styled(Grid)({
  height: "calc(100% - 64px)",
});

const StepsContainer = styled(Grid)({
  width: "50%",
  margin: "auto",
});

const STEPS = [
  "Select template",
  "Claim a name",
  "Configure template",
  "Review information",
  "Launch organization",
];

export const DAOCreate: React.FC = () => {
  const [activeStepNumber, setActiveStepNumber] = useState(0);

  return (
    <PageContainer container>
      <Grid container item xs={4} direction="column" justify="flex-end">
        <Grid item>
          {STEPS.map((step, index) => {
            return (
              <StepsContainer
                container
                key={`step-${index}`}
                justify="space-between"
                alignItems="center"
              >
                <Grid item>
                  <Typography variant="body1">{index + 1}</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body1" color={"textSecondary"}>
                    {step}
                  </Typography>
                </Grid>
              </StepsContainer>
            );
          })}
        </Grid>
      </Grid>
      <Grid item xs={8}>
        <ConnectWallet />
      </Grid>
    </PageContainer>
  );
};
