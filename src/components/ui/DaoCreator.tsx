import { Grid, Paper, Stepper, TextareaAutosize, Typography, styled, withStyles, withTheme } from "@material-ui/core"
import InfoRounded from "@material-ui/icons/InfoRounded"
import { TextField as FormikTextField } from "formik-material-ui"

export const PageContainer = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.main
}))

export const StepContentContainer = styled(Grid)({
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

export const StyledStepper = styled(Stepper)({
  "background": "inherit",
  "paddingTop": 48,
  "& .MuiStepLabel-label": {
    fontSize: 14,
    lineHeight: 14
  },
  "cursor": "pointer"
})

export const IndicatorValue = styled(Paper)(({ theme }) => ({
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
  fontFamily: "Roboto Flex"
}))

export const FAQClickToAction = styled(Typography)(({ theme }) => ({
  color: theme.palette.secondary.main,
  fontSize: "14px",
  cursor: "pointer",
  fontWeight: 300
}))

export const FAQReadMe = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  cursor: "pointer",
  fontWeight: 300
}))

export const ProgressContainer = styled(Grid)(({ theme }) => ({
  background: "#2F3438",
  display: "grid",
  borderRadius: 8,
  maxHeight: 680,
  paddingTop: 20,
  position: "sticky",
  top: 130
}))

export const PageContent = styled(Grid)({
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

export const DescriptionText = styled(Typography)(({ theme }) => ({
  color: theme.palette.secondary.dark
}))

export const SecondContainer = styled(Grid)({
  marginTop: 25
})

export const CustomInputContainer = styled(Grid)(({ theme }) => ({
  "height": 54,
  "boxSizing": "border-box",
  "marginTop": 14,
  "background": "#2F3438",
  "borderRadius": 8,
  "alignItems": "center",
  "display": "flex",
  "padding": "13px 23px",
  "fontWeight": 300,
  "& input::placeholder": {
    fontWeight: 300
  }
}))

export const CustomTextarea = styled(withTheme(TextareaAutosize))(props => ({
  "minHeight": 152,
  "boxSizing": "border-box",
  "width": "100%",
  "marginTop": 14,
  "fontWeight": 300,
  "padding": "21px 20px",
  "border": "none",
  "fontSize": 16,
  "fontFamily": "Roboto Flex",
  "color": props.theme.palette.text.secondary,
  "background": "#2F3438",
  "lineHeight": "135%",
  "letterSpacing": -0.18,
  "borderRadius": 8,
  "paddingRight": 40,
  "wordBreak": "break-word",
  "&:focus-visible": {
    outline: "none"
  }
}))

export const CustomFormikTextField = withStyles({
  root: {
    "& .MuiInput-root": {
      fontWeight: 300,
      textAlign: "initial"
    },
    "& .MuiInputBase-input": {
      textAlign: "initial"
    },
    "& .MuiInputBase-root": {
      textWeight: 300
    },
    "& .MuiInput-underline:before": {
      borderBottom: "none !important"
    },
    "& .MuiInput-underline:hover:before": {
      borderBottom: "none !important"
    },
    "& .MuiInput-underline:after": {
      borderBottom: "none !important"
    }
  }
})(FormikTextField)

export const ErrorText = styled(Typography)({
  fontSize: 14,
  color: "red",
  marginTop: 4
})

export const InfoIconInput = styled(InfoRounded)(({ theme }) => ({
  cursor: "default",
  color: theme.palette.secondary.light,
  height: 16,
  width: 16
}))
export const TextareaContainer = styled(Grid)({
  display: "flex",
  position: "relative"
})

export const MetadataContainer = styled(Grid)({
  margin: "-4px 0 16px 0"
})

export const InfoIcon = styled(InfoRounded)(({ theme }) => ({
  position: "absolute",
  right: 25,
  top: "20%",
  color: theme.palette.secondary.light,
  height: 18,
  width: 18
}))
