import {
  AppBar,
  Toolbar,
  Button,
  styled,
  Typography,
  Box,
  Grid,
} from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../store";
import { toShortAddress } from "../../utils";

const StyledAppBar = styled(AppBar)({
  boxShadow: "none",
  borderBottom: "2px solid #3D3D3D",
});

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "flex-end",
  height: 100,
});

const StatusDot = styled(Box)({
  borderRadius: "100%",
  width: 8,
  height: 8,
  background: "#4BCF93",
});

const AddressContainer = styled(Grid)({
  width: "min-content",
});

export const Navbar: React.FC = () => {
  const account = useSelector<AppState, AppState["wallet"]["address"]>(
    (state) => state.wallet.address
  );

  return (
    <StyledAppBar position="sticky" color="transparent">
      <StyledToolbar>
        {account ? (
          <AddressContainer
            container
            alignItems="center"
            wrap="nowrap"
            spacing={1}
          >
            <Grid item>
              <Typography variant="body1">{toShortAddress(account)}</Typography>
            </Grid>
            <Grid item>
              <StatusDot />
            </Grid>
          </AddressContainer>
        ) : (
          <Button color="inherit">Connect Wallet</Button>
        )}
      </StyledToolbar>
    </StyledAppBar>
  );
};
