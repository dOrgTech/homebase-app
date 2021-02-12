import React, { useContext, useEffect, useMemo } from "react";
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
import { useSelector } from "react-redux";

import { ConnectWallet } from "./components/ConnectWallet";
import { StepInfo } from "./state/types";
import { AppState } from "../../store";
import { CreatorContext } from "./state/context";
import { CurrentStep, STEPS } from "./steps";
import { NavigationBar } from "./components/NavigationBar";
import { TezosContext } from "../../services/beacon/context";
import { addNewContractToIPFS } from "../../services/pinata";

const PageContainer = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.main,
}));

const StepContentContainer = styled(Grid)({
  paddingLeft: "16%",
  paddingRight: "16%",
  alignItems: "center",
  height: "inherit",
  marginTop: "15%",
  display: "block",
});

const StepOneContentContainer = styled(Grid)({
  paddingLeft: "16%",
  paddingRight: "16%",
  alignItems: "center",
});

const StyledStepper = styled(Stepper)({
  background: "inherit",
  marginTop: 70
});

const StepContentHeigth = styled(Grid)({
  height: "80vh",
  overflowY: "auto",
});

const ContentContainer = styled(Grid)({
  height: "inherit",
  alignItems: "center",
  display: "flex",
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
  
  const { activeStep, governanceStep, back, next } = creator.state;
  const progress = useMemo(() => activeStep * 25, [activeStep]);


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
            <IndicatorValue>
              {progress === 0.5 ? 0 : activeStep * 25}%
            </IndicatorValue>
          </Box>
        </ProgressBar>
        <StyledStepper activeStep={activeStep} orientation="vertical">
          {STEPS.map(({ title }: StepInfo, index: any) => (
            <Step key={title} {...(!true && { active: false })}>
              <StepLabel icon={index + 1}>{title}</StepLabel>
            </Step>
          ))}
        </StyledStepper>
      </ProgressContainer>

      <StepContentHeigth item xs={9} container>
        <ContentContainer item xs={11}>
          {true ? (
            <StepContentContainer item container justify="center">
              <CurrentStep />
            </StepContentContainer>
          ) : (
            <StepOneContentContainer item container justify="center">
              <ConnectWallet />
            </StepOneContentContainer>
          )}
        </ContentContainer>
      </StepContentHeigth>
      {activeStep < 4 && <NavigationBar back={back} next={next} />}
    </PageContainer>
  );
};
