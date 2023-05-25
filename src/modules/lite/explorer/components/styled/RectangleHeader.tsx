import { Grid, styled } from "@material-ui/core"

export const RectangleContainer = styled(Grid)(({ theme }) => ({
  minHeight: 125,
  padding: "68px 8%",
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  [theme.breakpoints.down("sm")]: {
    padding: "35px 8%"
  }
}))
