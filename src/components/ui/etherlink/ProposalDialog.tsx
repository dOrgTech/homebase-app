import { Grid, Typography, styled } from "@material-ui/core"

export const OptionContainer = styled(Grid)(({ theme }) => ({
  "minHeight": 80,
  "background": theme.palette.primary.main,
  "borderRadius": 8,
  "padding": "35px 42px",
  "marginBottom": 16,
  "cursor": "pointer",
  "height": 110,
  "&:hover:enabled": {
    background: theme.palette.secondary.dark,
    scale: 1.01,
    transition: "0.15s ease-in"
  }
}))

export const ActionText = styled(Typography)(() => ({
  fontWeight: 400,
  fontSize: 20,
  marginBottom: 8
}))

export const ActionDescriptionText = styled(Typography)(() => ({
  fontWeight: 300,
  fontSize: 16
}))

export const TitleContainer = styled(Grid)({
  marginBottom: 24
})
