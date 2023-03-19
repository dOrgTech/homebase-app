import { Grid, styled } from "@material-ui/core"

export const GridContainer = styled(Grid)(({ theme }) => ({
  minHeight: 145,
  borderRadius: 8,
  cursor: "pointer",
  padding: "32px 46px",
  background: theme.palette.primary.main,
  [theme.breakpoints.down("sm")]: {
    padding: "35px 25px"
  }
}))
