import { styled, Grid } from "@material-ui/core";

export const ProposalFormListItem = styled(Grid)(({ theme }) => ({
  height: 70,
  display: "flex",
  alignItems: "center",
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  padding: "0px 65px",
  [theme.breakpoints.down("sm")]: {
    padding: "10px 24px",
  },
}));