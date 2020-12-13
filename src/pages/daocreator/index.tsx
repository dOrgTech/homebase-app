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
import { ClaimName } from "./ClaimName";
import { ConnectWallet } from "./ConnectWallet";
import { Governance } from "./Governance";
import { SelectTemplate } from "./SelectTemplate";

const PageContainer = styled(Grid)({
  // height: "calc(100% - 64px)",
  height: "100%",
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
  marginTop: 25,
});

const Footer = styled(Grid)({
  boxShadow: "none",
  background: "#000000",
  height: 62,
  marginTop: 58,
  paddingTop: "1%",
});

const BackButton = styled(Paper)({
  boxShadow: "none",
  width: "121px",
  height: 31,
  background: "#EEEEEE",
  borderRadius: 21,
  color: "#000000",
  textAlign: "center",
  marginLeft: "4%",
  paddingTop: "1%",
  cursor: "pointer",
});

const NextButton = styled(Paper)({
  boxShadow: "none",
  width: "121px",
  height: 31,
  borderRadius: 21,
  textAlign: "center",
  paddingTop: "1%",
  background: "#3866F9",
  color: "fff",
  float: "right",
  marginRight: "4%",
  cursor: "pointer",
});

const WhiteText = styled(Typography)({
  color: "#fff",
});
const STEPS = [
  "Select template",
  // "Claim a name",
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
        return <SelectTemplate setActiveStep={setActiveStep} />;
      case 1:
        return <Governance />;
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
      <Grid item container justify="center" alignItems="center" xs={9}>
        <ConnectWallet />
        <StepContentContainer item container justify="center">
          {getStepContent(activeStep)}
        </StepContentContainer>

        {activeStep !== 0 ? (
          <Footer
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item xs={6}>
              <BackButton onClick={() => setActiveStep(activeStep - 1)}>
                <Typography>Back </Typography>{" "}
              </BackButton>
            </Grid>
            <Grid item xs={6}>
              <NextButton onClick={() => setActiveStep(activeStep + 1)}>
                {" "}
                <WhiteText>Continue</WhiteText>
              </NextButton>
            </Grid>
          </Footer>
        ) : null}
      </Grid>
    </PageContainer>
  );
};
