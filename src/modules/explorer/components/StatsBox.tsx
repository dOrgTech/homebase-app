import { styled, Grid } from "@material-ui/core";

export const StatsBox = styled(Grid)(({ theme }) => ({
  borderRight: `2px solid ${theme.palette.primary.light}`,
  width: "unset",
  [theme.breakpoints.down("sm")]: {
    padding: "50px 8%",
    borderRight: `none`,
    borderBottom: `2px solid ${theme.palette.primary.light}`,
  },
}));
