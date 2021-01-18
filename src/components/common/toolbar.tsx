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
import HomeButton from "../../assets/logos/homebase.svg";

const StyledAppBar = styled(AppBar)({
  boxShadow: "none",
  borderBottom: "2px solid #3D3D3D",
});

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
  flexWrap: "wrap",
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

const LogoText = styled(Typography)({
  fontWeight: "bold",
  fontSize: "18px",
});

export const Navbar: React.FC = () => {
  const account = useSelector<AppState, AppState["wallet"]["address"]>(
    (state) => state.wallet.address
  );

  return (
    <StyledAppBar position="sticky" color="primary">
      <StyledToolbar>
        <Box>
          <Grid container alignItems="center" wrap="nowrap">
            <Grid item>
              <img src={HomeButton} />
            </Grid>
            <Grid item>
              <Box paddingLeft="10px">
                <LogoText color="textSecondary">Homebase</LogoText>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {account ? (
          <AddressContainer
            container
            alignItems="center"
            wrap="nowrap"
            spacing={1}
          >
            <Grid item>
              <Typography variant="subtitle1">
                {toShortAddress(account)}
              </Typography>
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
