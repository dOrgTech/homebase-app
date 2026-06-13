import { Grid, styled } from "@mui/material"

export const RowContainer = styled(Grid)(({ theme }) => ({
  minHeight: 155,
  padding: "0px 20px",
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  cursor: "pointer",
  [theme.breakpoints.down("xl")]: {
    padding: "35px 0"
  }
}))
