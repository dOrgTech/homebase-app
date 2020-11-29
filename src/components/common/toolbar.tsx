import { AppBar, Toolbar, Button, styled, Typography } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../store";

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "flex-end",
});

export const Navbar: React.FC = () => {
  const account = useSelector<AppState, AppState["wallet"]["address"]>(
    (state) => state.wallet.address
  );

  return (
    <AppBar position="sticky">
      <StyledToolbar>
        {account ? (
          <Typography variant="body1">{account}</Typography>
        ) : (
          <Button color="inherit">Connect Wallet</Button>
        )}
      </StyledToolbar>
    </AppBar>
  );
};
