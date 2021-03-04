import React from "react";
import {
  AppBar,
  Toolbar,
  Button,
  styled,
  Typography,
  Box,
  Grid,
  Theme,
  useTheme,
} from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";
import { TezosToolkit } from "@taquito/taquito";

import HomeButton from "assets/logos/homebase.svg";
import { useTezos } from "services/beacon/hooks/useTezos";
import { toShortAddress } from "services/contracts/utils";
import { Blockie } from "./Blockie";

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

const custom = (theme: Theme) => ({
  logo: {
    height: "100%",
    alignItems: "baseline",
    display: "flex",
    marginTop: 22,
  },
  appBorder: {
    borderBottom: `2px solid ${theme.palette.primary.light}`,
  },
  appHeight: {
    height: "inherit",
  },
  appLogoHeight: {
    height: "inherit",
    borderRight: `2px solid ${theme.palette.primary.light}`,
  },
});

const LogoItem = styled("img")({
  cursor: "pointer",
});

export const ConnectWalletButton = ({
  connect,
}: {
  connect: () => Promise<TezosToolkit>;
}) => (
  <ConnectWallet color="secondary" variant="outlined" onClick={connect}>
    Connect Wallet
  </ConnectWallet>
);

export const Navbar: React.FC = () => {
  const { connect, account } = useTezos();

  const location = useLocation();
  const history = useHistory();
  const theme = useTheme();

  return (
    <StyledAppBar
      position="sticky"
      color="primary"
      style={
        location.pathname === "/creator" ? undefined : custom(theme).appBorder
      }
    >
      <StyledToolbar>
        <Grid
          container
          direction="row"
          alignItems="center"
          style={custom(theme).appHeight}
        >
          <Grid
            item
            xs={3}
            style={
              location.pathname === "/creator"
                ? custom(theme).appLogoHeight
                : undefined
            }
          >
            <Box
              style={
                location.pathname === "/creator"
                  ? custom(theme).logo
                  : undefined
              }
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
            style={custom(theme).appHeight}
          >
            {account ? (
              <AddressContainer
                container
                alignItems="center"
                wrap="nowrap"
                justify="flex-end"
              >
                <Grid item>
                  <Blockie address={account} marginRight={"8px"} />
                </Grid>
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
              <ConnectWalletButton connect={connect} />
            )}
          </Grid>
        </Grid>
      </StyledToolbar>
    </StyledAppBar>
  );
};
