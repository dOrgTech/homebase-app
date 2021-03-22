import { styled, Grid } from "@material-ui/core";

export const TemplateTableRowContainer = styled(Grid)(({ theme }) => ({
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  padding: 2,
  minHeight: 83,
  [theme.breakpoints.down("sm")]: {
    "& > div": {
      paddingBottom: 24,
    },
  },
}));