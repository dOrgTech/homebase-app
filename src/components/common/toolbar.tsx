import { AppBar, Toolbar, Button, styled } from "@material-ui/core";
import React from "react";

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "flex-end",
});

export const Navbar: React.FC = () => {
  return (
    <AppBar position="sticky">
      <StyledToolbar>
        <Button color="inherit">Connect Wallet</Button>
      </StyledToolbar>
    </AppBar>
  );
};
