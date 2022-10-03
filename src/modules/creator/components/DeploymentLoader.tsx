import {
  Box,
  Grid,
  Step,
  StepConnector,
  StepLabel,
  Stepper,
  styled,
  Theme,
  Typography,
  withStyles
} from "@material-ui/core"
import React, { useEffect, useState } from "react"
import { SuspenseDots } from "./SuspenseDots"

const WaitingText = styled(Typography)({
  marginTop: 46,
  textAlign: "center",
  justifyContent: "center",
  marginBottom: 20,
  maxWidth: 650
})

const StyledContainer = styled(Box)({
  width: "100%",
  marginTop: "-15%",
  minWidth: 650,
  ["@media (max-width:1167px)"]: {
    minWidth: "auto"
  }
})

const StyledStepper = styled(Stepper)(({ theme }) => ({
  "width": "100%",
  "paddingLeft": 0,
  "paddingRight": 0,
  "background": "inherit",
  "& .MuiStepConnector-alternativeLabel": {
    "left": "calc(-50% + 19px)",
    "right": "calc(50% + 19px)",
    "top": 16,
    "& .MuiStepConnector-lineHorizontal": {
      borderColor: theme.palette.primary.light,
      borderTopWidth: 3
    }
  }
}))

const StyledLabel = styled(StepLabel)(
  ({ theme, focused, hasError }: { theme: Theme; focused: boolean; hasError: boolean }) => ({
    "& .MuiStepIcon-root": {
      borderWidth: 3
    },
    "& .MuiStepIcon-active": {
      borderColor: hasError ? theme.palette.error.main : focused ? "#fff" : theme.palette.primary.light,
      fill: "none"
    },
    "& .MuiStepIcon-text": {
      fill: "none"
    },
    "& .MuiStepIcon-completed": {
      borderColor: focused ? "#fff" : theme.palette.secondary.main,
      fill: theme.palette.secondary.main
    }
  })
)

const ColorlibConnector = withStyles((theme: Theme) => ({
  alternativeLabel: {
    top: 22
  },
  active: {
    "& $line": {
      backgroundColor: theme.palette.secondary.main
    }
  },
  completed: {
    "& $line": {
      backgroundColor: theme.palette.secondary.main
    }
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.primary.light,
    borderRadius: 1
  }
}))(StepConnector)

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

  useEffect(() => {
    if (activeStep) {
      if (isFinished) {
        setFocusedState(states.length - 1)
      } else {
        setFocusedState(activeStep)
      }
    }
  }, [activeStep, isFinished, states.length])

  return (
    <StyledContainer>
      <Grid container justifyContent="center">
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
      <StyledStepper activeStep={activeStep} alternativeLabel nonLinear connector={<ColorlibConnector />}>
        {states.map((_, index) => (
          <Step
            key={index}
            onClick={() => {
              if (!activeStep) {
                return
              }

              if (index <= activeStep) {
                setFocusedState(index)
              }
            }}
            completed={activeStep ? index < activeStep : false}
          >
            <StyledLabel hasError={activeStep === index && !!error} focused={index === focusedState} />
          </Step>
        ))}
      </StyledStepper>
    </StyledContainer>
  )
}
