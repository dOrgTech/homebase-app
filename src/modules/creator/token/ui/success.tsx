import { Grid, Link, styled, Typography, withTheme, withStyles } from "@material-ui/core"

export const CardContainer = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.dark,
  borderRadius: 8,
  padding: "36px 47px"
}))

export const DescriptionContainer = styled(Grid)(({ theme }) => ({
  display: "inline-flex",
  [theme.breakpoints.down("sm")]: {
    paddingLeft: "4%",
    paddingRight: "4%"
  }
}))

export const OptionsContainer = styled(Grid)(({ theme }) => ({
  marginTop: 40,
  [theme.breakpoints.down("sm")]: {
    marginTop: 40
  }
}))

export const ChoicesContainer = styled(Grid)(({ theme }) => ({
  marginTop: 32,
  gap: 48,
  [theme.breakpoints.down("sm")]: {
    gap: 16
  }
}))

export const DescriptionText = styled(Typography)(({ theme }) => ({
  fontWeight: 200,
  color: theme.palette.text.secondary,
  [theme.breakpoints.down("sm")]: {
    fontSize: 14
  }
}))

export const OptionButton = styled(Link)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    width: "95%",
    display: "flex",
    textAlign: "center"
  },
  [theme.breakpoints.down("sm")]: {
    justifyContent: "center"
  }
}))
