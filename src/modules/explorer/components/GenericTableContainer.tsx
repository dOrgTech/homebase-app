import { styled, Grid } from "@material-ui/core";

export const GenericTableContainer = styled(Grid)((props) => ({
  background: props.theme.palette.primary.main,
  padding: "0 8%",
  "&:hover": {
    background: "rgba(129, 254, 183, 0.03)",
    borderLeft: `2px solid ${props.theme.palette.secondary.light}`,
  },
  [props.theme.breakpoints.down("sm")]: {
    padding: "35px 0",
    borderTop: `2px solid ${props.theme.palette.primary.light}`,
    "& > div": {
      borderBottom: `unset`,
    },
  },
}));
