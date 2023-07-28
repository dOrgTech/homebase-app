import React, { useContext, useEffect, useMemo } from "react"
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
  Link
} from "@material-ui/core"
import ProgressBar from "react-customizable-progressbar"
import { useHistory } from "react-router"

import { CreatorContext, StepInfo } from "modules/creator/state"
import { StepRouter, STEPS, urlToStepMap, useStepNumber } from "modules/creator/steps"
import { NavigationBar } from "modules/creator/components/NavigationBar"
import { Navbar } from "modules/common/Toolbar"
import mixpanel from "mixpanel-browser"

const PageContainer = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.main
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

const StyledStepper = styled(Stepper)({
  "background": "inherit",
  "paddingTop": 48,
  "& .MuiStepLabel-label": {
    fontSize: 14,
    lineHeight: 14
  },
  "cursor": "pointer"
})

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

const FAQClickToAction = styled(Typography)(({ theme }) => ({
  color: theme.palette.secondary.main,
  fontSize: "14px",
  cursor: "pointer",
  fontWeight: 300
}))

const ProgressContainer = styled(Grid)(({ theme }) => ({
  background: "#2F3438",
  display: "grid",
  borderRadius: 8,
  maxHeight: 650,
  paddingTop: 20,
  position: "sticky",
  top: 130
}))

const custom = (theme: Theme) => ({
  logo: {
    height: "100%",
    alignItems: "baseline",
    display: "flex",
    marginTop: 22
  },
  appBorder: {
    borderBottom: `2px solid ${theme.palette.primary.light}`
  },
  appHeight: {
    height: "inherit"
  },
  appLogoHeight: {
    height: "inherit",
    borderRight: `2px solid ${theme.palette.primary.light}`
  }
})

const PageContent = styled(Grid)({
  width: "1000px",
  height: "100%",
  margin: "auto",
  padding: "28px 0",
  flexDirection: "row",
  paddingTop: 0,
  ["@media (max-width:1167px)"]: {
    width: "86vw"
  }
})

export const DAOCreate: React.FC = () => {
  const creator = useContext(CreatorContext)

  const { back, next } = creator.state
  const step = useStepNumber()
  const progress = useMemo(() => step * 20, [step])
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
                radius={52}
                strokeWidth={5}
                strokeColor={theme.palette.secondary.main}
                trackStrokeWidth={4}
                trackStrokeColor={"rgba(255, 255, 255, 0.2)"}
              >
                <Box className="indicator">
                  <IndicatorValue>{Math.floor((step / (Object.keys(urlToStepMap).length - 1)) * 100)}%</IndicatorValue>
                </Box>
              </ProgressBar>
              <Box>
                <FAQClickToAction>New to DAOs?</FAQClickToAction>
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
