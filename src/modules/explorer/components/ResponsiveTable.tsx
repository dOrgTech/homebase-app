import { Box, styled } from "@material-ui/core";

export const ResponsiveTableContainer = styled(Box)({
  width: "100%",
  padding: "72px 8%",
  boxSizing: "border-box",
  paddingBottom: "24px",
  overflowX: "auto",
  "& > div": {
    minWidth: 600,
  },
});
