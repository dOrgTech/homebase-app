import { Grid, Link, styled, Typography } from "@mui/material"

import withTheme from "@mui/styles/withTheme"
import withStyles from "@mui/styles/withStyles"

export const CardContainer = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.dark,
  borderRadius: 8,
  padding: "36px 47px"
}))

export const DescriptionContainer = styled(Grid)(({ theme }) => ({
  display: "inline-flex",
  [theme.breakpoints.down("lg")]: {
    paddingLeft: "4%",
    paddingRight: "4%"
  }
}))

export const OptionsContainer = styled(Grid)(({ theme }) => ({
  marginTop: 40,
  [theme.breakpoints.down("lg")]: {
    marginTop: 40
  }
}))

export const ChoicesContainer = styled(Grid)(({ theme }) => ({
  marginTop: 32,
  gap: 48,
  [theme.breakpoints.down("lg")]: {
    gap: 16
  }
}))

export const DescriptionText = styled(Typography)(({ theme }) => ({
  fontWeight: 200,
  color: theme.palette.text.secondary,
  [theme.breakpoints.down("lg")]: {
    fontSize: 14
  }
}))

export const OptionButton = styled(Link)(({ theme }) => ({
  [theme.breakpoints.down("lg")]: {
    width: "95%",
    display: "flex",
    textAlign: "center"
  },
  [theme.breakpoints.down("lg")]: {
    justifyContent: "center"
  }
}))
