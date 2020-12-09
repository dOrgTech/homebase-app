import {
  Box,
  Button,
  Grid,
  Paper,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  styled,
  Typography,
} from "@material-ui/core";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../store";
import { ConnectWallet } from "./ConnectWallet";
import { SelectTemplate } from "./SelectTemplate";

const PageContainer = styled(Grid)({
  height: "calc(100% - 64px)",
});

const StepsContainer = styled(Grid)({
  width: "50%",
  margin: "auto",
});

const CustomGrid = styled(Grid)({
  border: "1px solid #E4E4E4",
  alignItems: "center",
  justifyContent: "center",
});

const StepContentContainer = styled(Grid)({
  paddingLeft: "8%",
  paddingRight: "8%",
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
  const account = useSelector<AppState, AppState["wallet"]["address"]>(
    (state) => state.wallet.address
  );

  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return <SelectTemplate />;
      case 1:
        return "An ad group contains one or more ads which target a shared set of keywords.";
      case 2:
        return `Try out different ad text to see what brings in the most customers,
                and learn how to enhance your ads using features like ad extensions.
                If you run into any problems with your ads, find out how to tell if
                they're running and how to resolve approval issues.`;
      default:
        return "Unknown step";
    }
  }
  const [activeStep, setActiveStep] = React.useState(0);

  return (
    <PageContainer container>
      <CustomGrid container item xs={3} direction="column" justify="flex-end">
        <Stepper activeStep={activeStep} orientation="vertical">
          {STEPS.map((label, index) => (
            <Step key={label} {...(!account && { active: false })}>
              <StepLabel>{label}</StepLabel>
              {/* <StepContent>
              <Typography>{getStepContent(index)}</Typography>
            </StepContent> */}
            </Step>
          ))}
        </Stepper>
      </CustomGrid>
      <StepContentContainer
        item
        container
        justify="center"
        alignItems="center"
        xs={9}
      >
        <ConnectWallet />
        <Grid item container justify="center">
          {getStepContent(activeStep)}
        </Grid>
      </StepContentContainer>
    </PageContainer>
  );
};
