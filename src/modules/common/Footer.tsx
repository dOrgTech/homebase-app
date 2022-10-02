import { Grid, styled } from "@material-ui/core"

export const Footer = styled(Grid)(({ theme }) => ({
  width: "100%",
  height: 60,
  background: theme.palette.primary.dark,

  ["@media (max-width:960px)"]: {
    height: 100
  }
}))
