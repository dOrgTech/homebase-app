import { Grid, styled } from "@material-ui/core"

export const RowContainer = styled(Grid)(({ theme }) => ({
  minHeight: 155,
  padding: "0px 20px",
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  cursor: "pointer",
  [theme.breakpoints.down("md")]: {
    padding: "35px 0"
  }
}))
