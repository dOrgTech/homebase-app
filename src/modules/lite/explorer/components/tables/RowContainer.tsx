import { Grid, styled } from "@material-ui/core"

export const RowContainer = styled(Grid)(({ theme }) => ({
  minHeight: 192,
  padding: "37px 48px",
  cursor: "pointer",
  [theme.breakpoints.down("md")]: {
    padding: "34px 38px",
    width: "inherit"
  }
}))
