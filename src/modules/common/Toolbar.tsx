import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  styled,
  Typography,
  Box,
  Grid,
  useTheme,
  Popover,
  useMediaQuery,
  Theme,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { TezosToolkit } from "@taquito/taquito";

import HomeButton from "assets/logos/homebase_logo.svg";
import { useTezos } from "services/beacon/hooks/useTezos";
import { toShortAddress } from "services/contracts/utils";
import { ExitToAppOutlined, FileCopyOutlined } from "@material-ui/icons";
import { ChangeNetworkButton, NetworkMenu } from "./ChangeNetworkButton";
import { Network } from "services/beacon/context";
import { UserProfileName } from "modules/explorer/components/UserProfileName";
import { ProfileAvatar } from "modules/explorer/components/styled/ProfileAvatar";
import { ViewButton } from "modules/explorer/components/ViewButton";
import { NavigationMenu } from "modules/explorer/components/NavigationMenu";

const Header = styled(Grid)({
 padding: "28px 125px"
})

const StyledAppBar = styled(AppBar)(({ theme }: { theme: Theme }) => ({
  boxShadow: "none",
  background: theme.palette.primary.main,
}));

const StyledToolbar = styled(Toolbar)({
  width: "100%",
  display: "flex",
  padding: 0,
  boxSizing: "border-box",
  justifyContent: "space-between",
  flexWrap: "wrap",
});

const AddressContainer = styled(Grid)({
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

const AddressBarWrapper = styled(Grid)({
  boxSizing: "border-box",
  padding: "8px 16px",
  borderRadius: 4,
  "&:hover": {
    background: "rgba(129, 254, 183, 0.03)",
  },
});

const LogoItem = styled("img")({
  height: "30px",
  cursor: "pointer",
  paddingTop: 8,
});

const StyledPopover = styled(Popover)({
  ".MuiPaper-root": {
    borderRadius: 4,
  },
});

const ToolbarContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    display: "flex",
    justifyContent: "center",
    marginLeft: 16,
  },
  [theme.breakpoints.down("md")]: {
    display: "flex",
    justifyContent: "center",
    marginLeft: 0,
  },
}));

export const ConnectWalletButton = ({
  connect,
}: {
  connect: () => Promise<TezosToolkit>;
}) => (
  <ConnectWallet color="secondary" variant="outlined" onClick={() => connect()}>
    Connect Wallet
  </ConnectWallet>
);

export const Navbar: React.FC<{ mode: "creator" | "explorer", disableMobileMenu?: boolean }> = ({
  mode,
  children,
  disableMobileMenu
}) => {
  const { connect, account, reset, changeNetwork, network } = useTezos();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [popperOpen, setPopperOpen] = useState(false);
  const theme = useTheme();
  const isMobileExtraSmall = useMediaQuery(theme.breakpoints.down("xs"));
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const [networkAnchorEl, setNetworkAnchorEl] =
    React.useState<HTMLButtonElement | null>(null);
  const [networkPopperOpen, setNetworkPopperOpen] = useState(false);

  const handleNetworkClick = (event: React.MouseEvent<any>) => {
    setNetworkAnchorEl(event.currentTarget);
    setNetworkPopperOpen(!networkPopperOpen);
  };

  const handleNetworkChange = (network: Network) => {
    changeNetwork(network);
    setPopperOpen(!popperOpen);
    setNetworkPopperOpen(!networkPopperOpen);
    history.push("/explorer");
  };

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

  const history = useHistory();

  return (
    <StyledAppBar position="sticky">
      <StyledToolbar>
        <Header
          container
          direction={isMobileExtraSmall ? "column" : "row"}
          alignItems="center"
          wrap="wrap"
          justify={mode === "explorer" ? "space-between" : "flex-end"}
        >
          {mode === "explorer" && (
            <Grid item>
              <Box onClick={() => history.push("/explorer")}>
                <ToolbarContainer container alignItems="center" wrap="nowrap">
                  <Grid item>
                    <LogoItem src={HomeButton} />
                  </Grid>
                  <Grid item>
                    <Box paddingLeft="10px">
                      <LogoText color="textSecondary">Homebase</LogoText>
                    </Box>
                  </Grid>
                </ToolbarContainer>
              </Box>
            </Grid>
          )}

          <Grid item>
            <Grid
              container
              justify={isMobileExtraSmall ? "center" : "flex-end"}
            >
              {account ? (
                <>
                  <Grid
                    container
                    alignItems="center"
                    justify={isMobileExtraSmall ? "center" : "flex-end"}
                  >
                    {children}
                    <AddressBarWrapper item>
                      <AddressContainer
                        container
                        alignItems="center"
                        wrap="nowrap"
                        justify="flex-end"
                        onClick={handleClick}
                        style={{ gap: 8 }}
                      >
                        <Grid item>
                          <ProfileAvatar size={22} address={account} />
                        </Grid>
                        <Grid item>
                          <Typography>
                            <UserProfileName address={account} short={true} />
                          </Typography>
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
                      style: {
                        borderRadius: 4,
                        backgroundColor: "transparent",
                      },
                    }}
                  >
                    <AddressMenu>
                      <AddressMenuItem
                        container
                        alignItems="center"
                        onClick={() => handleCopy(account)}
                      >
                        <AddressMenuIcon item>
                          <FileCopyOutlined
                            color="inherit"
                            fontSize="inherit"
                          />
                        </AddressMenuIcon>
                        <Grid item>
                          <Typography variant="subtitle2" color="textSecondary">
                            {toShortAddress(account)}
                          </Typography>
                        </Grid>
                      </AddressMenuItem>
                      <AddressMenuItem
                        container
                        alignItems="center"
                        onClick={handleNetworkClick}
                      >
                        <Grid item>
                          <Typography variant="subtitle2" color="textSecondary">
                            Change network ({network})
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
                          <ExitToAppOutlined
                            color="inherit"
                            fontSize="inherit"
                          />
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
              ) : !isMobileSmall ? (
                <Grid container justify="flex-end" wrap="nowrap" style={{ gap: 8 }}>
                  <Grid item>
                    <ChangeNetworkButton />
                  </Grid>
                  <Grid item>
                    <ConnectWalletButton connect={() => connect()} />
                  </Grid>
                </Grid>
              ) : (
                <Grid container>
                  <Grid item>
                    <ViewButton variant="outlined" onClick={() => connect()}>
                      CONNECT
                    </ViewButton>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Header>
        <NavigationMenu disableMobileMenu={disableMobileMenu}/>
      </StyledToolbar>
      <NetworkMenu
        open={networkPopperOpen}
        anchorEl={networkAnchorEl}
        onClose={() => {
          setNetworkPopperOpen(false);
        }}
        handleNetworkChange={handleNetworkChange}
      />
    </StyledAppBar>
  );
};
