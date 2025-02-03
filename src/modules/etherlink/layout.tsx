import React from "react"
import { Box, Grid, Step, StepLabel, useMediaQuery, useTheme, Link } from "@material-ui/core"
import ProgressBar from "react-customizable-progressbar"
import { useHistory } from "react-router"

import { StepInfo } from "modules/creator/state"
import { STEPS } from "modules/etherlink/config"
import { Navbar } from "modules/common/Toolbar"
import {
  PageContainer,
  StepContentContainer,
  ProgressContainer,
  IndicatorValue,
  FAQReadMe,
  FAQClickToAction,
  StyledStepper,
  PageContent
} from "components/ui/DaoCreator"

import { urlToStepMap } from "./config"
import { NavigationBar } from "modules/creator/components/NavigationBar"
import useEvmDaoCreateStore from "services/contracts/etherlinkDAO/hooks/useEvmDaoCreateStore"

export const EvmDaoCreatorLayout: React.FC = ({ children }) => {
  const { currentStep: step, next, prev: back } = useEvmDaoCreateStore()
  const history = useHistory()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

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
                {children}
              </StepContentContainer>
            </Grid>
          </Grid>
          {step < STEPS.length && <NavigationBar back={back} next={next} />}
        </Grid>
      </PageContent>
    </PageContainer>
  )
}
