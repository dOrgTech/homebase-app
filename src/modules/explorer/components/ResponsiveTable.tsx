import { Box, styled } from "@material-ui/core"

export const ResponsiveTableContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  padding: "72px 8%",
  boxSizing: "border-box",
  paddingBottom: "24px",
  [theme.breakpoints.down("sm")]: {
    padding: "0",
    borderBottom: `2px solid ${theme.palette.primary.light}`
  }
}))
