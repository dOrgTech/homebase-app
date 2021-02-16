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
import { toShortAddress } from "../../utils";
import HomeButton from "../../assets/logos/homebase.svg";
import { useTezos } from "../../services/beacon/hooks/useTezos";
import { useHistory, useLocation } from "react-router-dom";

const StyledAppBar = styled(AppBar)({
  boxShadow: "none",
});

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
  flexWrap: "wrap",
  height: 100,
  paddingLeft: 0,
  paddingRight: 0,
});

const StatusDot = styled(Box)({
  borderRadius: "100%",
  width: 8,
  height: 8,
  background: "#4BCF93",
  marginLeft: 8,
});

const AddressContainer = styled(Grid)({
  width: "min-content",
  paddingRight: 24,
  alignItems: "baseline",
  margin: "auto 0",
});

const LogoText = styled(Typography)({
  fontWeight: "bold",
  fontSize: "18px",
  cursor: "pointer",
});

const ConnectWallet = styled(Button)({
  maxHeight: 50,
  alignSelf: "baseline",
  marginTop: 22,
  marginRight: 14,
});

const custom = {
  logo: {
    height: "100%",
    alignItems: "baseline",
    display: "flex",
    marginTop: 22,
  },
  appBorder: {
    borderBottom: "2px solid #3D3D3D",
  },
  appHeight: {
    height: "inherit",
  },
  appLogoHeight: {
    height: "inherit",
    borderRight: "2px solid #3D3D3D",
  },
};

const LogoItem = styled("img")({
  cursor: "pointer",
});

export const Navbar: React.FC = () => {
  const { connect, account } = useTezos();
  const location = useLocation();
  const history = useHistory();

  return (
    <StyledAppBar
      position="sticky"
      color="primary"
      style={location.pathname === "/creator" ? undefined : custom.appBorder}
    >
      <StyledToolbar>
        <Grid
          container
          direction="row"
          alignItems="center"
          style={custom.appHeight}
        >
          <Grid
            item
            xs={3}
            style={
              location.pathname === "/creator"
                ? custom.appLogoHeight
                : undefined
            }
          >
            <Box
              style={location.pathname === "/creator" ? custom.logo : undefined}
              onClick={() => history.push("/explorer")}
            >
              <Grid
                container
                alignItems="center"
                wrap="nowrap"
                justify="center"
              >
                <Grid item>
                  <LogoItem src={HomeButton} />
                </Grid>
                <Grid item>
                  <Box paddingLeft="10px">
                    <LogoText color="textSecondary">Homebase</LogoText>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Grid
            item
            xs={9}
            container
            justify="flex-end"
            style={custom.appHeight}
          >
            {account ? (
              <AddressContainer
                container
                alignItems="center"
                wrap="nowrap"
                justify="flex-end"
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
              <ConnectWallet
                color="secondary"
                variant="outlined"
                onClick={connect}
              >
                Connect Wallet
              </ConnectWallet>
            )}
          </Grid>
        </Grid>
      </StyledToolbar>
    </StyledAppBar>
  );
};
