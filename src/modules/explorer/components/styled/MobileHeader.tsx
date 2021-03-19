import { styled, Grid } from "@material-ui/core";

export const MobileHeader = styled(Grid)(({ theme }) => ({
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  minHeight: 48,
  padding: "0 20px",
}));