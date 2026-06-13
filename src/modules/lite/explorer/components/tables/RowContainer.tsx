import { Grid, styled } from "@mui/material"

export const RowContainer = styled(Grid)(({ theme }) => ({
  minHeight: 192,
  padding: "37px 48px",
  cursor: "pointer",
  width: "inherit",
  [theme.breakpoints.down("xl")]: {
    padding: "34px 38px",
    width: "inherit"
  }
}))
