import React, { useContext, useMemo } from "react"
import { Box, Grid, Step, StepLabel, useMediaQuery, useTheme } from "@material-ui/core"
import { Navbar } from "modules/common/Toolbar"
import ProgressBar from "react-customizable-progressbar"
import { DeploymentStepRouter, STEPS, useDeploymentStepNumber } from "./steps"
import { StepInfo } from "./state"
import { useHistory } from "react-router-dom"
import { NavigationBar } from "../../components/NavigationBar"
import { DeploymentContext } from "./state/context"
import {
  PageContainer,
  PageContent,
  ProgressContainer,
  IndicatorValue,
  FAQClickText,
  FAQClickToAction,
  StyledStepper,
  StepContentContainer
} from "../ui"

export const TezosTokenDeployment: React.FC = () => {
  const creator = useContext(DeploymentContext)

  const { back, next } = creator.state

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const history = useHistory()
  const step = useDeploymentStepNumber()
  const progress = useMemo(() => step * 45, [step])

  const goToFAQ = (): void => {
    history.push("/faq")
  }

  return (
    <PageContainer container direction="row">
      <Navbar mode="creator" />
      <PageContent container direction="row">
        {!isMobile && (
          <ProgressContainer item xs={3} container direction="column">
            <Grid item container direction="column" alignItems="center" xs>
              <ProgressBar
                progress={progress}
                radius={62}
                strokeWidth={8}
                strokeColor={theme.palette.secondary.main}
                trackStrokeWidth={7}
                trackStrokeColor={"rgba(255, 255, 255, 0.2)"}
              >
                <Box className="indicator">
                  <IndicatorValue>{progress === 0.5 ? 0 : step * 45}%</IndicatorValue>
                </Box>
              </ProgressBar>

              <Box onClick={goToFAQ}>
                <FAQClickText>New to DAOs?</FAQClickText>
                <FAQClickToAction> Read our FAQ </FAQClickToAction>
              </Box>

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
