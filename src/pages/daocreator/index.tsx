import {
  Grid,
  Paper,
  Step,
  StepLabel,
  Stepper,
  styled,
  Typography,
  withTheme,
} from "@material-ui/core";

import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../store";
import { ConnectWallet } from "./ConnectWallet";
import { Governance } from "./Governance";
import { SelectTemplate } from "./SelectTemplate";
import { TokenSettings } from "./TokenSettings";
import { DaoSettings } from "./DaoSettings";
import { Summary } from "./Summary";
import { Review } from "./Review";
import { useHistory } from "react-router-dom";

const PageContainer = styled(withTheme(Grid))((props) => ({
  height: "100%",
  background: props.theme.palette.primary.main,
}));

const CustomGrid = styled(Grid)({
  alignItems: "center",
  justifyContent: "center",
  borderRight: "2px solid #3D3D3D",
});

const StepContentContainer = styled(Grid)({
  paddingLeft: "16%",
  paddingRight: "16%",
  marginTop: "2.5%",
  marginBottom: "2%",
  height: "calc(100% - 112px)",
  alignItems: "center",
});

const Footer = styled(withTheme(Grid))((props) => ({
  boxShadow: "none",
  background: props.theme.palette.primary.main,
  height: 62,
  paddingTop: "1%",
  borderTop: "2px solid #3D3D3D",
}));

const BackButton = styled(Paper)({
  boxShadow: "none",
  width: "121px",
  height: 31,
  background: "inherit",
  color: "#fff",
  textAlign: "center",
  marginLeft: "4%",
  paddingTop: "1%",
  cursor: "pointer",
});

const NextButton = styled(Paper)({
  boxShadow: "none",
  minWidth: "121px",
  height: 31,
  borderRadius: 21,
  textAlign: "center",
  paddingTop: "1%",
  background: "inherit",
  float: "right",
  marginRight: "4%",
  cursor: "pointer",
  paddingLeft: "3%",
  paddingRight: "3%",
});

const WhiteText = styled(withTheme(Typography))((props) => ({
  color: props.theme.palette.secondary.main,
}));

const StyledStepper = styled(withTheme(Stepper))((props) => ({
  background: "inherit",
}));

const STEPS = [
  "Select template",
  // "Claim a name",
  "Configure template",
  "Review information",
  "Launch organization",
];
export const DAOCreate: React.FC = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [governanceStep, setGovernanceStep] = useState(0);
  const [handleNextStep, setHandleNextStep] = useState(() => undefined);
  const account = useSelector<AppState, AppState["wallet"]["address"]>(
    (state) => state.wallet.address
  );

  const history = useHistory<any>();

  function getStepContent(step: number, handleNextStep: any) {
    switch (step) {
      case 0:
        return <SelectTemplate setActiveStep={setActiveStep} />;
      case 1:
        return governanceStep === 0 ? (
          <Governance
            defineSubmit={setHandleNextStep}
            setActiveStep={setActiveStep}
            setGovernanceStep={setGovernanceStep}
          />
        ) : governanceStep === 1 ? (
          <TokenSettings
            defineSubmit={setHandleNextStep}
            setActiveStep={setActiveStep}
            setGovernanceStep={setGovernanceStep}
          />
        ) : (
          <DaoSettings
            defineSubmit={setHandleNextStep}
            setActiveStep={setActiveStep}
            setGovernanceStep={setGovernanceStep}
          />
        );
      case 2:
        return (
          <Summary
            setActiveStep={setActiveStep}
            setGovernanceStep={setGovernanceStep}
          />
        );
      case 3:
        return <Review />;
    }
  }

  const handleBackStep = () => {
    if (activeStep === 1 && governanceStep === 0) {
      return setActiveStep(0);
    } else if (activeStep === 1 && governanceStep !== 0) {
      return setGovernanceStep(governanceStep - 1);
    }
  }

  const { tezos } = useConnectWallet()

  return (
    <PageContainer container>
      <CustomGrid container item xs={3} direction="column" justify="flex-end">
        <StyledStepper activeStep={activeStep} orientation="vertical">
          {STEPS.map((label, index) => (
            <Step key={label} {...(!account && { active: false })}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </StyledStepper>
      </CustomGrid>
      <Grid item container justify="center" alignItems="center" xs={9}>
        {account ? null : <ConnectWallet />}
        <StepContentContainer item container justify="center">
          {getStepContent(activeStep, handleNextStep)}
        </StepContentContainer>

        {activeStep !== 0 && activeStep !== 1 && activeStep !== 3 ? (
          <Footer
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item xs={6}>
              <BackButton onClick={() => setActiveStep(activeStep - 1)}>
                <Typography>BACK</Typography>{" "}
              </BackButton>
            </Grid>
            <Grid item xs={6}>
              <NextButton onClick={() => setActiveStep(activeStep + 1)}>
                {" "}
                <WhiteText>
                  {activeStep !== 2 ? "CONTINUE" : "Launch Organization"}
                </WhiteText>
              </NextButton>
            </Grid>
          </Footer>
        ) : null}

        {activeStep === 1 ? (
          <Footer
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item xs={6}>
              <BackButton onClick={handleBackStep}>
                <Typography>BACK </Typography>{" "}
              </BackButton>
            </Grid>
            <Grid item xs={6}>
              <NextButton onClick={handleNextStep}>
                {" "}
                <WhiteText>CONTINUE</WhiteText>
              </NextButton>
            </Grid>
          </Footer>
        ) : null}
      </Grid>
    </PageContainer>
  );
};
