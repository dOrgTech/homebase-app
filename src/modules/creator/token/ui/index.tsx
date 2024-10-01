import { Grid, Link, styled, Typography, withTheme, withStyles } from "@material-ui/core"
import { TextareaAutosize, Paper, Stepper } from "@material-ui/core"
import { TextField as FormikTextField } from "formik-material-ui"
import { RemoveCircleOutline } from "@material-ui/icons"

export const Title = styled(Typography)(({ theme }) => ({
  fontSize: 32,
  fontWeight: 600,
  [theme.breakpoints.down("sm")]: {
    fontSize: 26
  }
}))

export const CenterTitle = styled(Typography)(({ theme }) => ({
  fontSize: 32,
  fontWeight: 600,
  textAlign: "center",
  [theme.breakpoints.down("sm")]: {
    fontSize: 26
  }
}))

export const TitleMediumCenter = styled(Typography)({
  fontSize: 24,
  textAlign: "center"
})

export const CustomTextarea = styled(withTheme(TextareaAutosize))(props => ({
  "minHeight": 152,
  "boxSizing": "border-box",
  "width": "100%",
  "marginTop": 14,
  "fontWeight": 300,
  "padding": "21px 20px",
  "fontFamily": "Roboto Flex",
  "border": "none",
  "fontSize": 16,
  "color": props.theme.palette.text.secondary,
  "background": "#2F3438",
  "borderRadius": 8,
  "paddingRight": 40,
  "wordBreak": "break-word",
  "&:focus-visible": {
    outline: "none"
  },
  "resize": "none"
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
  },
  [theme.breakpoints.down("sm")]: {
    width: "100%"
  }
}))

export const ErrorText = styled(Typography)({
  fontSize: 14,
  color: "red",
  marginTop: 4
})

export const TextareaContainer = styled(Grid)({
  display: "flex",
  position: "relative"
})

// Starting for Distribution.tsx

export const CustomAmountContainer = styled(Grid)(({ theme }) => ({
  "height": 54,
  "boxSizing": "border-box",
  "marginTop": 14,
  "background": "#2F3438",
  "borderRadius": 8,
  "alignItems": "center",
  "display": "flex",
  "padding": "13px 23px",
  "width": "45%",
  "& input::placeholder": {
    fontWeight: 300
  },
  [theme.breakpoints.down("sm")]: {
    width: "100%"
  }
}))

export const AddButtonContainer = styled(Grid)(({ theme }) => ({
  "height": 54,
  "boxSizing": "border-box",
  "marginTop": 14,
  "alignItems": "center",
  "display": "flex",
  "padding": "0px 0px",
  "width": "15%",
  "& input::placeholder": {
    fontWeight: 300
  },
  [theme.breakpoints.down("sm")]: {
    width: "100%"
  }
}))

export const RemoveButton = styled(RemoveCircleOutline)({
  marginTop: 0,
  fontSize: 18
})

export const AmountText = styled(Typography)({
  fontWeight: 400
})

// Starting for Ownership.tsx

export const PageContainer = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.main
}))

export const PageContent = styled(Grid)(({ theme }) => ({
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

export const CardContainer = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.dark,
  gap: 32,
  borderRadius: 8,
  padding: "40px 48px",
  [theme.breakpoints.down("sm")]: {
    padding: "30px 38px"
  }
}))

export const DescriptionContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    paddingLeft: "4%",
    paddingRight: "4%"
  }
}))

export const OptionsContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    paddingLeft: "4%",
    paddingRight: "4%"
  }
}))

export const ChoicesContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    gap: 32
  }
}))

export const DescriptionText = styled(Typography)(({ theme }) => ({
  fontWeight: 300,
  fontSize: 18,
  color: theme.palette.text.secondary,
  [theme.breakpoints.down("sm")]: {
    fontSize: 14
  }
}))

export const OptionButton = styled(Link)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    display: "flex",
    textAlign: "center"
  }
}))

// Starting for /index.tsx
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
  fontWeight: 300,
  color: theme.palette.text.secondary,
  userSelect: "none",
  boxShadow: "none",
  background: "inherit",
  fontFamily: "Roboto Flex"
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

export const ProgressContainer = styled(Grid)(({ theme }) => ({
  background: "#2F3438",
  display: "grid",
  borderRadius: 8,
  maxHeight: 480,
  paddingTop: 20,
  position: "sticky",
  top: 125
}))

export const StyledStepper = styled(Stepper)({
  "background": "inherit",
  "paddingTop": 48,
  "& .MuiStepLabel-label": {
    fontSize: 14,
    lineHeight: 14
  },
  "cursor": "pointer"
})

export const FAQClickToAction = styled(Typography)(({ theme }) => ({
  color: theme.palette.secondary.main,
  fontSize: "14px",
  cursor: "pointer",
  textAlign: "center",
  textDecoration: "underline"
}))

export const FAQClickText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "14px",
  cursor: "pointer",
  textAlign: "center"
}))

// Starting for Summary.tsx

export const TitleSpacing = styled(Typography)({
  marginTop: 8,
  fontWeight: 400,
  fontSize: 18
})

export const ContainerEdit = styled(Typography)(({ theme }) => ({
  cursor: "pointer",
  color: theme.palette.secondary.light
}))

export const AdminAddress = styled(Typography)({
  wordBreak: "break-all"
})

export const AdminAddressIcon = styled(Typography)({
  wordBreak: "break-all",
  display: "flex",
  alignItems: "center"
})

export const KeyText = styled(Typography)({
  fontWeight: 400
})

export const AddressText = styled(Typography)({
  marginLeft: 12,
  fontWeight: 300,
  marginRight: 8
})

export const ThirdContainer = styled(Grid)({
  background: "#2F3438",
  borderRadius: 8,
  boxSizing: "border-box"
})

export const ThirdContainerFirstRow = styled(Grid)(({ theme }) => ({
  padding: "19px 48px",
  borderBottom: "0.3px solid #575757",
  backgroundColor: theme.palette.primary.dark,
  borderRadius: "8px 8px 0px 0px",
  alignItems: "center",
  display: "flex",
  minHeight: 70,
  ["@media (max-width:1167px)"]: {
    padding: "12px 15px",
    maxHeight: "inherit"
  }
}))

export const ThirdContainerLastRow = styled(Grid)({
  padding: "19px 48px",
  alignItems: "center",
  display: "flex",
  backgroundColor: "#24282D",
  borderRadius: "0px 0px 8px 8px",
  minHeight: 70,
  ["@media (max-width:1167px)"]: {
    padding: "12px 15px",
    maxHeight: "inherit"
  }
})

export const ThirdContainerRow = styled(Grid)({
  "borderBottom": "0.3px solid #575757",
  "backgroundColor": "#24282D",
  "padding": "24px 48px",
  "minHeight": 70,
  ["@media (max-width:1167px)"]: {
    padding: "12px 15px",
    maxHeight: "inherit"
  },
  "&:last-child": {
    borderBottom: "none"
  }
})
