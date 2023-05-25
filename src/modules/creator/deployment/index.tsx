import React, { useContext, useMemo } from "react"
import {
  Box,
  Grid,
  Link,
  Paper,
  Step,
  StepLabel,
  Stepper,
  styled,
  Typography,
  useMediaQuery,
  useTheme
} from "@material-ui/core"
import { Navbar } from "modules/common/Toolbar"
import ProgressBar from "react-customizable-progressbar"
import { DeploymentStepRouter, STEPS, useDeploymentStepNumber } from "./steps"
import { StepInfo } from "./state"
import { useHistory } from "react-router-dom"
import { NavigationBar } from "../components/NavigationBar"
import { DeploymentContext } from "./state/context"

const PageContainer = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.main
}))

const PageContent = styled(Grid)(({ theme }) => ({
  marginTop: 0,
  width: "1000px",
  height: "100%",
  margin: "auto",
  padding: "28px 0",
  flexDirection: "row",
  paddingTop: 0,
  ["@media (max-width:1167px)"]: {
    width: "86vw"
  },
  [theme.breakpoints.down("sm")]: {
    marginTop: 10
  }
}))

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
  fontFamily: "Roboto Mono"
}))

const StepContentContainer = styled(Grid)({
  alignItems: "baseline",
  height: "100%",
  paddingTop: 0,
  boxSizing: "border-box",
  overflowY: "auto",
  marginLeft: 47,
  zIndex: 10,
  width: "fit-content",
  ["@media (max-width:1167px)"]: {
    marginLeft: 0
  }
})

const ProgressContainer = styled(Grid)(({ theme }) => ({
  background: "#2F3438",
  display: "grid",
  borderRadius: 8,
  maxHeight: 410,
  paddingTop: 20,
  position: "sticky",
  top: 125
}))

const StyledStepper = styled(Stepper)({
  "background": "inherit",
  "paddingTop": 48,
  "& .MuiStepLabel-label": {
    fontSize: 14,
    lineHeight: 14
  },
  "cursor": "pointer"
})

export const Deployment: React.FC = () => {
  const creator = useContext(DeploymentContext)

  const { back, next } = creator.state

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const history = useHistory()
  const step = useDeploymentStepNumber()
  const progress = useMemo(() => step * 50, [step])

  return (
    <PageContainer container direction="row">
      <Navbar mode="creator" />
      <PageContent container direction="row">
        {!isMobile && (
          <ProgressContainer item xs={3} container direction="column">
            <Grid item container direction="column" alignItems="center" xs>
              <ProgressBar
                progress={progress}
                radius={52}
                strokeWidth={5}
                strokeColor={theme.palette.secondary.main}
                trackStrokeWidth={4}
                trackStrokeColor={"rgba(255, 255, 255, 0.2)"}
              >
                <Box className="indicator">
                  <IndicatorValue>{progress === 0.5 ? 0 : step * 50}%</IndicatorValue>
                </Box>
              </ProgressBar>

              <StyledStepper activeStep={step} orientation="vertical">
                {STEPS.map(({ title, path }: StepInfo, index: number) => (
                  <Step key={title}>
                    <StepLabel onClick={() => (index < step ? history.push(path) : null)} icon={index + 1}>
                      {title}
                    </StepLabel>
                  </Step>
                ))}
              </StyledStepper>
            </Grid>
          </ProgressContainer>
        )}

        <Grid item xs={12} md={9} container justifyContent="center" alignItems="baseline">
          <Grid container direction="column" alignItems="center" style={{ width: "100%", marginBottom: 20 }}>
            <Grid item style={{ width: "100%" }} xs>
              <StepContentContainer item container justifyContent="center">
                <DeploymentStepRouter />
              </StepContentContainer>
            </Grid>
          </Grid>
          {step < 3 && <NavigationBar back={back} next={next} />}
        </Grid>
      </PageContent>
    </PageContainer>
  )
}
