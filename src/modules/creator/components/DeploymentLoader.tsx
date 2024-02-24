import {
  Box,
  Grid,
  LinearProgress,
  Step,
  StepConnector,
  StepLabel,
  Stepper,
  styled,
  Theme,
  Typography,
  useTheme,
  withStyles
} from "@material-ui/core"
import React, { useEffect, useState } from "react"
import { SuspenseDots } from "./SuspenseDots"
import ProgressBar from "react-customizable-progressbar"

const WaitingText = styled(Typography)({
  marginTop: 46,
  textAlign: "center",
  justifyContent: "center",
  marginBottom: 20,
  maxWidth: 650
})

const StyledContainer = styled(Box)({
  width: "100%",
  minWidth: 650,
  ["@media (max-width:1167px)"]: {
    minWidth: "auto"
  }
})

interface Props {
  states: { activeText: string; completedText: string }[]
  activeStep: number | undefined
  error: Error | null
}

export const DeploymentLoader: React.FC<Props> = ({ states, activeStep, error }) => {
  const errorMessage = "Something went wrong, please try again later."
  const [focusedState, setFocusedState] = useState(0)
  const isFinished = activeStep === states.length
  const isStarted = Number.isInteger(activeStep)
  const showActiveText = isStarted && !isFinished && activeStep === focusedState
  const showCompletedText = isStarted && focusedState < (activeStep as number)
  const [progress, setProgress] = useState(0)
  const theme = useTheme()

  useEffect(() => {
    if (activeStep) {
      if (isFinished) {
        setFocusedState(states.length - 1)
      } else {
        setFocusedState(activeStep)
        // setProgress(progress + 25)
      }
    }
  }, [activeStep, isFinished, states.length])

  useEffect(() => {
    setProgress(progress + 25)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedState])

  return (
    <StyledContainer>
      <Grid container justifyContent="flex-start">
        <Grid item>
          <WaitingText variant="subtitle1" color="textSecondary">
            {showActiveText
              ? error
                ? errorMessage
                : states[focusedState].activeText
              : showCompletedText
              ? states[focusedState].completedText
              : ""}
            {showActiveText && !error && <SuspenseDots />}
          </WaitingText>
        </Grid>
      </Grid>

      <LinearProgress color="secondary" variant="determinate" value={progress} />
    </StyledContainer>
  )
}
