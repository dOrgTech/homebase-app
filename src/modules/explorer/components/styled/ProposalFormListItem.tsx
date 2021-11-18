import { styled, Grid } from "@material-ui/core";

export const ProposalFormListItem = styled(Grid)(({ theme }) => ({
  minHeight: 54,
  display: "flex",
  alignItems: "center",
  borderRadius: "4px",
  padding: "0 20px",
  [theme.breakpoints.down("sm")]: {
    padding: "10px 24px",
  },
  background: theme.palette.primary.main
}));