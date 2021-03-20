import { styled, withTheme, Grid } from "@material-ui/core";
import React from "react";

const ListItemContainer = styled(withTheme(Grid))((props) => ({
  background: props.theme.palette.primary.main,
  paddingLeft: "8%",
  paddingRight: "8%",
  "&:hover": {
    background: "rgba(129, 254, 183, 0.03)",
    borderLeft: `2px solid ${props.theme.palette.secondary.light}`,
  },
}));

export const GenericTableContainer: React.FC<any> = ({ children }) => {
  return <ListItemContainer>{children}</ListItemContainer>;
};
