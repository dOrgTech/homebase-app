import {
  Grid,
  Paper,
  Step,
  StepLabel,
  Stepper,
  styled,
  Typography,
  withTheme,
  CircularProgress,
  makeStyles,
} from "@material-ui/core";

import React, { useContext, useMemo, useReducer, useState } from "react";
import { useSelector } from "react-redux";

import { ConnectWallet } from "./ConnectWallet";
import { Governance } from "./Governance";
import { SelectTemplate } from "./SelectTemplate";
import { TokenSettings } from "./TokenSettings";
import { DaoSettings } from "./DaoSettings";
import { Summary } from "./Summary";
import { Review } from "./Review";
import { useHistory } from "react-router-dom";

import ProgressBar from "react-customizable-progressbar";
import { useConnectWallet } from "../../../store/wallet/hook";
import { AppState } from "../../../store";
import {
  INITIAL_STATE,
  CreatorState,
  CreatorAction,
  STEPS,
  StepInfo,
  ActionTypes,
  setActiveStep,
  setGovernanceStep,
  setHandleNextStep,
} from "../state";

const PageContainer = styled(withTheme(Grid))((props) => ({
  background: props.theme.palette.primary.main,
}));

const fullHeightStyles = makeStyles({
  root: {
    height: "100%",
  },
});

const reducedHeightStyles = makeStyles({
  root: {
    height: "87%",
  },
});

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
  // height: "calc(100% - 112px)",
  minHeight: 650,
  alignItems: "center",
});

const StepOneContentContainer = styled(Grid)({
  paddingLeft: "16%",
  paddingRight: "16%",
  marginTop: "2.5%",
  marginBottom: "2%",
  // height: "80%",
  alignItems: "center",
  minHeight: 650,
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

const IndicatorValue = styled(withTheme(Paper))((props) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  position: "absolute",
  top: 0,
  width: "100%",
  height: "100%",
  margin: "0 auto",
  fontSize: 25,
  color: props.theme.palette.text.secondary,
  userSelect: "none",
  boxShadow: "none",
  background: "inherit",
  fontFamily: "Roboto Mono",
}));

const reducer = (state: CreatorState, action: CreatorAction) => {
  switch (action.type) {
    case ActionTypes.UPDATE_HANDLER:
      state.onNextStep = action.handler;
      break;
    case ActionTypes.UPDATE_STEP:
      state.activeStep = action.step;
      console.log(state);
      break;
    case ActionTypes.UPDATE_GOVERNANCE_STEP:
      state.governanceStep = action.step;
      break;
    default:
      return state;
  }

  return state;
};

export const DAOCreate: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const { activeStep, governanceStep, onNextStep } = state;

  const account = useSelector<AppState, AppState["wallet"]["address"]>(
    (state) => state.wallet.address
  );

  const fullHeight = fullHeightStyles();
  const reducedHeight = reducedHeightStyles();

  const history = useHistory();

  // const GetStep = (
  //   switch (step) {
  //     case 0:
  //       return <SelectTemplate setActiveStep={dispatch} />;
  //     case 1:
  //       return governanceStep === 0 ? (
  //         <Governance
  //           defineSubmit={setHandleNextStep}
  //           setActiveStep={setActiveStep}
  //           setGovernanceStep={setGovernanceStep}
  //         />
  //       ) : governanceStep === 1 ? (
  //         <DaoSettings
  //           defineSubmit={setHandleNextStep}
  //           setActiveStep={dispatch}
  //         />
  //       ) : null;
  //     case 2:
  //       return (
  //         <TokenSettings
  //           defineSubmit={setHandleNextStep}
  //           setActiveStep={setActiveStep}
  //           setGovernanceStep={setGovernanceStep}
  //         />
  //       );
  //     case 3:
  //       return (
  //         <Summary
  //           setActiveStep={setActiveStep}
  //           setGovernanceStep={setGovernanceStep}
  //         />
  //       );
  //     case 4:
  //       return <Review />;
  //   }
  // )

  function getStepContent(step: number) {
    console.log("here ", step);
    switch (step) {
      case 0:
        return <SelectTemplate setActiveStep={dispatch} />;
      case 1:
        return governanceStep === 0 ? (
          <Governance
            defineSubmit={setHandleNextStep}
            setActiveStep={setActiveStep}
            setGovernanceStep={setGovernanceStep}
          />
        ) : governanceStep === 1 ? (
          <DaoSettings
            defineSubmit={setHandleNextStep}
            setActiveStep={dispatch}
          />
        ) : null;
      case 2:
        return (
          <TokenSettings
            defineSubmit={setHandleNextStep}
            setActiveStep={setActiveStep}
            setGovernanceStep={setGovernanceStep}
          />
        );
      case 3:
        return (
          <Summary
            setActiveStep={setActiveStep}
            setGovernanceStep={setGovernanceStep}
          />
        );
      case 4:
        return <Review />;
    }
  }

  const handleBackStep = () => {
    if (activeStep === 1 && governanceStep === 0) {
      return dispatch({ type: ActionTypes.UPDATE_STEP, step: 0 });
    } else if (activeStep === 1 && governanceStep !== 0) {
      return setGovernanceStep(dispatch, governanceStep - 1);
    } else if (activeStep === 0) {
      history.push("/explorer");
    } else if (activeStep === 3 || activeStep === 2) {
      return dispatch({ type: ActionTypes.UPDATE_STEP, step: activeStep - 1 });
    }
  };

  const progress = useMemo(() => activeStep * 25, [activeStep]);

  return (
    <PageContainer
      container
      classes={
        !account || (account && activeStep === 0) ? reducedHeight : fullHeight
      }
    >
      <CustomGrid container item xs={3} direction="column" justify="flex-end">
        {
          <ProgressBar
            progress={progress}
            radius={62}
            strokeWidth={4}
            strokeColor={"#81FEB7"}
            trackStrokeWidth={2}
            trackStrokeColor={"#3d3d3d"}
          >
            <div className="indicator">
              <IndicatorValue>
                {progress === 0.5 ? 0 : activeStep * 25}%
              </IndicatorValue>
            </div>
          </ProgressBar>
        }
        <StyledStepper activeStep={activeStep} orientation="vertical">
          {STEPS.map(({ title }: StepInfo) => (
            <Step key={title} {...(!account && { active: false })}>
              <StepLabel>{title}</StepLabel>
            </Step>
          ))}
        </StyledStepper>
      </CustomGrid>
      <Grid item container justify="center" alignItems="center" xs={9}>
        {account ? (
          <StepContentContainer item container justify="center">
            {getStepContent(activeStep)}
          </StepContentContainer>
        ) : (
          <StepOneContentContainer item container justify="center">
            <ConnectWallet />
          </StepOneContentContainer>
        )}

        {activeStep === 3 ? (
          <Footer
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item xs={6}>
              <BackButton onClick={handleBackStep}>
                <Typography>BACK</Typography>{" "}
              </BackButton>
            </Grid>
            <Grid item xs={6}>
              <NextButton
                onClick={() => setActiveStep(dispatch, activeStep + 1)}
              >
                {" "}
                <WhiteText>{"LAUNCH"}</WhiteText>
              </NextButton>
            </Grid>
          </Footer>
        ) : null}

        {account && activeStep !== 3 && activeStep !== 4 ? (
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

            {activeStep === 1 || activeStep === 2 ? (
              <Grid item xs={6}>
                <NextButton onClick={onNextStep}>
                  {" "}
                  <WhiteText>CONTINUE</WhiteText>
                </NextButton>
              </Grid>
            ) : null}
          </Footer>
        ) : null}

        {!account ? (
          <Footer
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item xs={6}>
              <BackButton onClick={() => history.push("/explorer")}>
                <Typography>BACK </Typography>{" "}
              </BackButton>
            </Grid>
          </Footer>
        ) : null}
      </Grid>
    </PageContainer>
  );
};
