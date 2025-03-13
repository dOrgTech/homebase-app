import React, { useContext, useEffect } from "react"
import { Box, Grid, Step, StepLabel, useMediaQuery, useTheme, Link } from "@material-ui/core"
import ProgressBar from "react-customizable-progressbar"
import { useHistory } from "react-router"

import { CreatorContext, StepInfo } from "modules/creator/state"
import { StepRouter, STEPS, urlToStepMap, useStepNumber } from "modules/creator/steps"
import { NavigationBar } from "modules/creator/components/NavigationBar"
import { Navbar } from "modules/common/Toolbar"
import mixpanel from "mixpanel-browser"
import {
  PageContainer,
  PageContent,
  ProgressContainer,
  IndicatorValue,
  StyledStepper,
  StepContentContainer,
  FAQReadMe,
  FAQClickToAction
} from "components/ui/DaoCreator"

export const DAOCreate: React.FC = () => {
  const creator = useContext(CreatorContext)

  const { back, next } = creator.state
  const step = useStepNumber()
  const history = useHistory()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  useEffect(() => {
    mixpanel.unregister("daoAddress")
    mixpanel.unregister("daoType")

    mixpanel.track("Visited Creator")
  }, [])

  return (
    <PageContainer container direction="row">
      <Navbar mode="creator" />
      <PageContent container direction="row">
        {!isMobile && (
          <ProgressContainer item xs={3} container direction="column">
            <Grid item container direction="column" alignItems="center" xs>
              <ProgressBar
                progress={Math.floor((step / (Object.keys(urlToStepMap).length - 1)) * 100)}
                radius={62}
                strokeWidth={8}
                strokeColor={theme.palette.secondary.main}
                trackStrokeWidth={7}
                trackStrokeColor={"rgba(255, 255, 255, 0.2)"}
              >
                <Box className="indicator">
                  <IndicatorValue>{Math.floor((step / (Object.keys(urlToStepMap).length - 1)) * 100)}%</IndicatorValue>
                </Box>
              </ProgressBar>
              <Box>
                <FAQReadMe color="textSecondary">New to DAOs?</FAQReadMe>
                <Link target="_blank" href="https://faq.tezos-homebase.io" color="secondary">
                  <FAQClickToAction style={{ textDecoration: "underline" }}>Read our FAQ</FAQClickToAction>
                </Link>
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
            <Grid item style={{ width: "100%", margin: "inherit" }} xs>
              <StepContentContainer item container justifyContent="center">
                <StepRouter />
              </StepContentContainer>
            </Grid>
          </Grid>
          {step < 6 && <NavigationBar back={back} next={next} />}
        </Grid>
      </PageContent>
    </PageContainer>
  )
}
