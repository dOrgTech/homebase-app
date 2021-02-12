import React, { useContext, useMemo } from "react";
import {
  Box,
  Grid,
  Paper,
  Step,
  StepLabel,
  Stepper,
  styled,
} from "@material-ui/core";
import ProgressBar from "react-customizable-progressbar";

import { ConnectWallet } from "./components/ConnectWallet";
import { StepInfo } from "./state/types";
import { CreatorContext } from "./state/context";
import { CurrentStep, STEPS, useStepNumber } from "./steps";
import { NavigationBar } from "./components/NavigationBar";

const PageContainer = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.main,
  minHeight: "calc(100vh - 102px)",
}));

const StepContentContainer = styled(Grid)({
  alignItems: "center",
  height: "100%",
  maxHeight: "calc(100vh - 177px)",
  overflowY: "auto"
});

const StepOneContentContainer = styled(Grid)({
  paddingLeft: "16%",
  paddingRight: "16%",
  alignItems: "center",
});

const StyledStepper = styled(Stepper)({
  background: "inherit",
  marginTop: 70,
});

const StepContentHeigth = styled(Grid)({
  minHeight: "80vh",
  overflowY: "auto",
});

const IndicatorValue = styled(Paper)(({ theme }) => ({
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
  color: theme.palette.text.secondary,
  userSelect: "none",
  boxShadow: "none",
  background: "inherit",
  fontFamily: "Roboto Mono",
}));

const ProgressContainer = styled(Grid)({
  borderRight: "2px solid #3D3D3D",
});

export const DAOCreate: React.FC = () => {
  const creator = useContext(CreatorContext);
  // const tezos = useContext(TezosContext);

  const { back, next } = creator.state;
  const step = useStepNumber();
  const progress = useMemo(() => step * 25, [step]);

  return (
    <PageContainer container direction="row">
      <ProgressContainer
        item
        xs={3}
        container
        justify="center"
        alignItems="center"
        direction="column"
      >
        <ProgressBar
          progress={progress}
          radius={62}
          strokeWidth={4}
          strokeColor={"#81FEB7"}
          trackStrokeWidth={2}
          trackStrokeColor={"#3d3d3d"}
        >
          <Box className="indicator">
            <IndicatorValue>{progress === 0.5 ? 0 : step * 25}%</IndicatorValue>
          </Box>
        </ProgressBar>
        <StyledStepper activeStep={step} orientation="vertical">
          {STEPS.map(({ title }: StepInfo, index: any) => (
            <Step key={title} {...(!true && { active: false })}>
              <StepLabel icon={index + 1}>{title}</StepLabel>
            </Step>
          ))}
        </StyledStepper>
      </ProgressContainer>

      <StepContentHeigth item xs={9} container justify="center">
        {true ? (
          <StepContentContainer item container justify="center">
            <CurrentStep />
          </StepContentContainer>
        ) : (
          <StepOneContentContainer item container justify="center">
            <ConnectWallet />
          </StepOneContentContainer>
        )}
      </StepContentHeigth>
      {step < 4 && <NavigationBar back={back} next={next} />}
    </PageContainer>
  );
};
