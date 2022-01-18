import React from "react";
import {
  AppBar,
  Toolbar,
  Button,
  styled,
  Typography,
  Box,
  Grid,
  useTheme,
  useMediaQuery,
  Theme,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";

import HomeButton from "assets/logos/homebase_logo.svg";
import { useTezos } from "services/beacon/hooks/useTezos";
import { ChangeNetworkButton } from "./ChangeNetworkButton";
import { UserProfileName } from "modules/explorer/components/UserProfileName";
import { ProfileAvatar } from "modules/explorer/components/styled/ProfileAvatar";
import { NavigationMenu } from "modules/explorer/components/NavigationMenu";
import { ActionSheet, useActionSheet } from "../context/ActionSheets";

const Header = styled(Grid)(({ theme }) => ({
  padding: "28px 125px",

  [theme.breakpoints.down("xs")]: {
    padding: "28px 25px",
  },
}));

const StyledAppBar = styled(AppBar)(({ theme }: { theme: Theme }) => ({
  boxShadow: "none",
  background: theme.palette.primary.dark,
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
  whiteSpace: "nowrap",
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

export const Navbar: React.FC<{ disableMobileMenu?: boolean }> = ({
  disableMobileMenu,
  children,
}) => {
  const { connect, account } = useTezos();
  const theme = useTheme();
  const isMobileExtraSmall = useMediaQuery(theme.breakpoints.down("xs"));

  const { open: openUserMenuSheet } = useActionSheet(ActionSheet.UserMenu);

  const history = useHistory();

  return (
    <StyledAppBar position="sticky">
      <StyledToolbar>
        <Header
          container
          direction={isMobileExtraSmall ? "column" : "row"}
          alignItems="center"
          wrap="wrap"
          justify={"space-between"}
        >
          <Grid item>
            <Box onClick={() => history.push("/explorer")}>
              <ToolbarContainer container alignItems="center" wrap="nowrap">
                <Grid item>
                  <LogoItem src={HomeButton} />
                </Grid>
                <Grid item>
                  <Box paddingLeft="10px">
                    <LogoText color="textPrimary">Homebase</LogoText>
                  </Box>
                </Grid>
              </ToolbarContainer>
            </Box>
          </Grid>

          <Grid item>
            <Grid
              container
              justify={isMobileExtraSmall ? "center" : "flex-end"}
            >
              {account ? (
                <Grid
                  container
                  alignItems="center"
                  style={{ gap: 12 }}
                  justify={isMobileExtraSmall ? "center" : "flex-end"}
                >
                  {children}
                  <Grid item>
                    <Grid container alignItems="center" style={{ gap: 8 }}>
                      <Grid item>
                        <ChangeNetworkButton />
                      </Grid>
                      <AddressBarWrapper
                        item
                        onClick={() => openUserMenuSheet()}
                      >
                        <AddressContainer
                          container
                          alignItems="center"
                          wrap="nowrap"
                          justify="flex-end"
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
                  </Grid>
                </Grid>
              ) : (
                <Grid
                  container
                  justify="flex-end"
                  alignItems="center"
                  wrap="nowrap"
                  style={{ gap: 8 }}
                >
                  <Grid item>
                    <ChangeNetworkButton />
                  </Grid>
                  <Grid item>
                    <ConnectWallet
                      color="secondary"
                      variant="contained"
                      size="small"
                      onClick={() => connect()}
                    >
                      Connect Wallet
                    </ConnectWallet>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Header>
        <NavigationMenu disableMobileMenu={disableMobileMenu} />
      </StyledToolbar>
    </StyledAppBar>
  );
};
