import { Grid, styled } from "@material-ui/core"

export const RowContainer = styled(Grid)(({ theme }) => ({
  minHeight: 145,
  padding: "44px 38px",
  cursor: "pointer",
  [theme.breakpoints.down("md")]: {
    padding: "44px 38px"
  }
}))
