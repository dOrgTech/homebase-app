import { Grid, Typography, styled } from "@mui/material"

export const OptionContainer = styled(Grid)(({ theme }) => ({
  "minHeight": 110,
  "background": theme.palette.primary.main,
  "borderRadius": 8,
  "padding": "35px 42px",
  "cursor": "pointer",
  // fill the grid cell so cards in a row share the height of the tallest description
  "height": "100%",
  "boxSizing": "border-box",
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
