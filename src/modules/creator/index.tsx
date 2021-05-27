import React, { useContext, useMemo } from "react";
import {
  Box,
  Grid,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
  Theme,
} from "@material-ui/core";
import ProgressBar from "react-customizable-progressbar";
import { useHistory } from "react-router";

import { CreatorContext, StepInfo } from "modules/creator/state";
import { StepRouter, STEPS, useStepNumber } from "modules/creator/steps";
import HomeButton from "assets/logos/homebase_logo.svg";
import { NavigationBar } from "modules/creator/components/NavigationBar";
import { Navbar } from "modules/common/Toolbar";

const PageContainer = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.main,
  minHeight: "100vh",
}));

const StepContentContainer = styled(Grid)({
  alignItems: "center",
  height: "100%",
  maxHeight: "calc(100vh - 75px - 80px)",
  paddingTop: 50,
  boxSizing: "border-box",
  overflowY: "auto",
  padding: "4vw",
  zIndex: 10,
});

const StyledStepper = styled(Stepper)({
  background: "inherit",
  marginTop: 70,
});

const StepContentHeigth = styled(Grid)({
  height: "calc(100vh - 75px)",
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

const ProgressContainer = styled(Grid)(({ theme }) => ({
  borderRight: `2px solid ${theme.palette.primary.light}`,
  display: "grid",
}));

const LogoText = styled(Typography)({
  fontWeight: "bold",
  fontSize: "24px",
  cursor: "pointer",
});

const custom = (theme: Theme) => ({
  logo: {
    height: "100%",
    alignItems: "baseline",
    display: "flex",
    marginTop: 22,
  },
  appBorder: {
    borderBottom: `2px solid ${theme.palette.primary.light}`,
  },
  appHeight: {
    height: "inherit",
  },
  appLogoHeight: {
    height: "inherit",
    borderRight: `2px solid ${theme.palette.primary.light}`,
  },
});

const LogoItem = styled("img")({
  cursor: "pointer",
});

export const DAOCreate: React.FC = () => {
  const creator = useContext(CreatorContext);

  const { back, next } = creator.state;
  const step = useStepNumber();
  const progress = useMemo(() => step * 20, [step]);
  const history = useHistory();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <PageContainer container direction="row">
      {!isMobile && (
        <ProgressContainer
          item
          xs={3}
          container
          justify="center"
          alignItems="center"
          direction="column"
        >
          <Grid
            item
            container
            direction="column"
            alignItems="center"
            xs={3}
            style={{ maxWidth: "unset" }}
          >
            <Grid item>
              <Box
                style={
                  location.pathname === "/creator"
                    ? custom(theme).logo
                    : undefined
                }
                onClick={() => history.push("/explorer")}
                margin="auto"
                marginTop="22px"
              >
                <Grid
                  container
                  alignItems="center"
                  wrap="nowrap"
                  justify="center"
                >
                  <Grid item>
                    <LogoItem src={HomeButton} />
                  </Grid>
                  <Grid item>
                    <Box paddingLeft="10px">
                      <LogoText color="textSecondary">Homebase</LogoText>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
          <Grid item container direction="column" alignItems="center" xs>
            <ProgressBar
              progress={progress}
              radius={62}
              strokeWidth={4}
              strokeColor={theme.palette.secondary.main}
              trackStrokeWidth={2}
              trackStrokeColor={theme.palette.primary.light}
            >
              <Box className="indicator">
                <IndicatorValue>
                  {progress === 0.5 ? 0 : step * 20}%
                </IndicatorValue>
              </Box>
            </ProgressBar>
            <StyledStepper activeStep={step} orientation="vertical">
              {STEPS.map(({ title }: StepInfo, index: number) => (
                <Step key={title}>
                  <StepLabel icon={index + 1}>{title}</StepLabel>
                </Step>
              ))}
            </StyledStepper>
          </Grid>
        </ProgressContainer>
      )}

      <StepContentHeigth item xs={12} md={9} container justify="center">
        <Grid
          container
          direction="column"
          alignItems="center"
          style={{ width: "100%" }}
        >
          <Navbar mode="creator" />
          <Grid item style={{ width: "100%" }} xs>
            <StepContentContainer item container justify="center">
              <StepRouter />
            </StepContentContainer>
          </Grid>
        </Grid>
      </StepContentHeigth>
      {step < 5 && <NavigationBar back={back} next={next} />}
    </PageContainer>
  );
};
