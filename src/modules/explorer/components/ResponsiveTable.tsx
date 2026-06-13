import { Box, styled } from "@mui/material"

export const ResponsiveTableContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  padding: "72px 8%",
  boxSizing: "border-box",
  paddingBottom: "24px",
  [theme.breakpoints.down("lg")]: {
    padding: "0",
    borderBottom: `2px solid ${theme.palette.primary.light}`
  }
}))
