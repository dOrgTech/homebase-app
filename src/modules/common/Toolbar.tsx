import React, { useState } from "react";
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
  Popover,
  useMediaQuery,
} from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";
import { TezosToolkit } from "@taquito/taquito";

import HomeButton from "assets/logos/homebase.svg";
import { useTezos } from "services/beacon/hooks/useTezos";
import { toShortAddress } from "services/contracts/utils";
import { Blockie } from "./Blockie";
import { ExitToAppOutlined, FileCopyOutlined } from "@material-ui/icons";

const StyledAppBar = styled(AppBar)({
  boxShadow: "none",
});

const StyledToolbar = styled(Toolbar)(
  ({ mode }: { mode: "creator" | "explorer" }) => ({
    display: "flex",
    padding: "22px 37px",
    boxSizing: "border-box",
    justifyContent: "space-between",
    flexWrap: "wrap",
    minHeight: mode === "creator" ? 80 : 100,
  })
);

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
  cursor: "pointer",
});

const LogoText = styled(Typography)({
  fontWeight: "bold",
  fontSize: "24px",
  cursor: "pointer",
});

const ConnectWallet = styled(Button)({
  maxHeight: 50,
  alignSelf: "baseline",
});

const AddressMenu = styled(Box)(() => ({
  width: 264,
  borderRadius: 4,
  backgroundColor: "#282B31",
}));

const AddressMenuItem = styled(Grid)(({ theme }) => ({
  cursor: "pointer",
  boxSizing: "border-box",
  color: theme.palette.text.secondary,
  padding: "20px 34px",
  "&:hover": {
    background: "rgba(129, 254, 183, 0.03)",
    borderLeft: `2px solid ${theme.palette.secondary.light}`,
    cursor: "pointer",
  },
}));

const AddressMenuIcon = styled(Grid)({
  paddingRight: "12px",
  marginBottom: "-4px",
});

const AddressBarWrapper = styled(Grid)(({ theme }) => ({
  padding: "15px",
  marginRight: 10,
  borderRadius: 4,
  "&:hover": {
    background: "rgba(129, 254, 183, 0.03)",
  },
  [theme.breakpoints.down("xs")]: {
    marginLeft: -15,
  },
}));

const custom = (theme: Theme, mode: "creator" | "explorer") => ({
  logo: {
    height: "100%",
    alignItems: "baseline",
    display: "flex",
    marginTop: 22,
  },
  appBorder: {
    borderBottom:
      mode === "explorer"
        ? `2px solid ${theme.palette.primary.light}`
        : "unset",
  },
  appLogoHeight: {
    borderRight: `2px solid ${theme.palette.primary.light}`,
  },
});

const LogoItem = styled("img")({
  cursor: "pointer",
});

const StyledPopover = styled(Popover)({
  ".MuiPaper-root": {
    borderRadius: 4,
  },
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

export const Navbar: React.FC<{ mode: "creator" | "explorer" }> = ({
  mode,
}) => {
  const { connect, account, reset } = useTezos();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [popperOpen, setPopperOpen] = useState(false);
  const theme = useTheme();
  const isMobileExtraSmall = useMediaQuery(theme.breakpoints.down("xs"));

  const handleClick = (event: React.MouseEvent<any>) => {
    setAnchorEl(event.currentTarget);
    setPopperOpen(!popperOpen);
  };

  const handleLogout = () => {
    reset();
    setPopperOpen(false);
  };

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setPopperOpen(false);
  };

  const location = useLocation();
  const history = useHistory();

  return (
    <StyledAppBar
      position="sticky"
      color="primary"
      style={
        location.pathname === "/creator"
          ? undefined
          : custom(theme, mode).appBorder
      }
    >
      <StyledToolbar mode={mode}>
        <Grid container direction="row" alignItems="center" wrap="wrap">
          {mode === "explorer" ? (
            <Grid
              item
              xs={12}
              sm={3}
              style={
                location.pathname === "/creator"
                  ? custom(theme, mode).appLogoHeight
                  : undefined
              }
            >
              <Box
                style={
                  location.pathname === "/creator"
                    ? custom(theme, mode).logo
                    : undefined
                }
                onClick={() => history.push("/explorer")}
              >
                <Grid container alignItems="center" wrap="nowrap">
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
          ) : null}

          <Grid
            item
            xs={mode === "creator" ? 12 : isMobileExtraSmall ? 12 : 9}
            container
            justify={
              isMobileExtraSmall && mode === "explorer"
                ? "flex-start"
                : "flex-end"
            }
            style={{
              marginTop: isMobileExtraSmall && mode === "explorer" ? 25 : 0,
            }}
          >
            {account ? (
              <>
                <Grid
                  container
                  alignItems="center"
                  justify={isMobileExtraSmall ? "flex-start" : "flex-end"}
                >
                  <AddressBarWrapper item>
                    <AddressContainer
                      container
                      alignItems="center"
                      wrap="nowrap"
                      justify="flex-end"
                      onClick={handleClick}
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
                  </AddressBarWrapper>
                </Grid>

                <StyledPopover
                  id={"wallet-Popper"}
                  open={popperOpen}
                  anchorEl={anchorEl}
                  style={{ zIndex: 1500, borderRadius: 4 }}
                  onClose={() => {
                    setPopperOpen(false);
                  }}
                  PaperProps={{
                    style: { borderRadius: 4, backgroundColor: "transparent" },
                  }}
                >
                  <AddressMenu>
                    <AddressMenuItem
                      container
                      alignItems="center"
                      onClick={() => handleCopy(account)}
                    >
                      <AddressMenuIcon item>
                        <FileCopyOutlined color="inherit" fontSize="inherit" />
                      </AddressMenuIcon>
                      <Grid item>
                        <Typography variant="subtitle2" color="textSecondary">
                          {toShortAddress(account)}
                        </Typography>
                      </Grid>
                    </AddressMenuItem>
                    <AddressMenuItem
                      style={{
                        borderTop: "2px solid rgba(255, 255, 255, 0.2)",
                      }}
                      container
                      alignItems="center"
                      onClick={handleLogout}
                    >
                      <AddressMenuIcon item>
                        <ExitToAppOutlined color="inherit" fontSize="inherit" />
                      </AddressMenuIcon>
                      <Grid item>
                        <Typography variant="subtitle2" color="textSecondary">
                          Log out
                        </Typography>
                      </Grid>
                    </AddressMenuItem>
                  </AddressMenu>
                </StyledPopover>
              </>
            ) : (
              <ConnectWalletButton connect={connect} />
            )}
          </Grid>
        </Grid>
      </StyledToolbar>
    </StyledAppBar>
  );
};
