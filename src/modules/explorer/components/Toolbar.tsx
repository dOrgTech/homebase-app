import React from "react"
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
  Theme
} from "@material-ui/core"

import HomeButton from "assets/logos/homebase-logo.svg"
import { useTezos } from "services/beacon/hooks/useTezos"
import { ChangeNetworkButton } from "./ChangeNetworkButton"
import { UserProfileName } from "modules/explorer/components/UserProfileName"
import { ProfileAvatar } from "modules/explorer/components/styled/ProfileAvatar"
import { NavigationMenu } from "modules/explorer/components/NavigationMenu"
import { ActionSheet, useActionSheet } from "../context/ActionSheets"
import { SmallButton } from "../../common/SmallButton"

const Header = styled(Grid)(({ theme }) => ({
  width: "1000px",
  height: "100%",
  margin: "auto",
  padding: "28px 0",
  flexDirection: "row",

  ["@media (max-width: 1425px)"]: {},

  ["@media (max-width:1335px)"]: {},

  ["@media (max-width:1167px)"]: {
    width: "86vw"
  },

  ["@media (max-width:1030px)"]: {},

  ["@media (max-width:960px)"]: {},

  ["@media (max-width:645px)"]: {
    flexDirection: "column"
  }
}))

const StyledAppBar = styled(AppBar)(({ theme }: { theme: Theme }) => ({
  boxShadow: "none",
  background: theme.palette.primary.dark,
  position: "sticky",

  ["@media (max-height:750px)"]: {
    position: "static"
  }
}))

const StyledToolbar = styled(Toolbar)({
  width: "100%",
  padding: 0,
  boxSizing: "border-box",
  justifyContent: "space-between",
  flexWrap: "wrap"
})

const AddressContainer = styled(Grid)({
  cursor: "pointer"
})

const LogoText = styled(Typography)({
  fontWeight: "bold",
  fontSize: "26px",
  cursor: "pointer",
  fontFamily: "Roboto Flex",
  letterSpacing: "initial"
})

const AddressBarWrapper = styled(Grid)(({ theme }) => ({
  borderRadius: 8,
  background: theme.palette.primary.main,
  paddingLeft: 16,
  paddingRight: 16,
  paddingTop: 5,
  paddingBottom: 6,
  boxSizing: "border-box"
}))

const LogoItem = styled("img")({
  height: "30px",
  cursor: "pointer",
  paddingTop: 8
})

const ToolbarContainer = styled(Grid)(({ theme }) => ({
  ["@media (max-width: 645px)"]: {
    marginBottom: "20px"
  }
}))

export const Navbar: React.FC<{ disableMobileMenu?: boolean }> = ({ disableMobileMenu, children }) => {
  const { connect, account } = useTezos()
  const theme = useTheme()
  const isMobileExtraSmall = useMediaQuery(theme.breakpoints.down("mobile"))

  const { open: openUserMenuSheet } = useActionSheet(ActionSheet.UserMenu)

  return (
    <StyledAppBar>
      <StyledToolbar>
        <Header container alignItems="center" wrap="wrap" justifyContent={"space-between"}>
          <Grid item>
            <Box onClick={() => (location.href = `/explorer`)}>
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
            <Grid container justifyContent={isMobileExtraSmall ? "center" : "flex-end"}>
              {account ? (
                <Grid
                  container
                  alignItems="center"
                  style={{ gap: 12 }}
                  justifyContent={isMobileExtraSmall ? "center" : "flex-end"}
                >
                  {children}
                  <Grid item>
                    <Grid container alignItems="center" style={{ gap: 16 }}>
                      <Grid item>
                        <ChangeNetworkButton />
                      </Grid>
                      <AddressBarWrapper item onClick={() => openUserMenuSheet()}>
                        <AddressContainer
                          container
                          alignItems="center"
                          wrap="nowrap"
                          justifyContent="flex-end"
                          style={{ gap: 16 }}
                        >
                          <Grid item>
                            <ProfileAvatar size={22} address={account} />
                          </Grid>
                          <Grid item>
                            <Typography color="textPrimary" variant="body2">
                              <UserProfileName address={account} short={true} />
                            </Typography>
                          </Grid>
                        </AddressContainer>
                      </AddressBarWrapper>
                    </Grid>
                  </Grid>
                </Grid>
              ) : (
                <Grid container justifyContent="flex-end" alignItems="center" wrap="nowrap" style={{ gap: 8 }}>
                  <Grid item>
                    <ChangeNetworkButton />
                  </Grid>
                  <Grid item>
                    <SmallButton
                      color="secondary"
                      variant="contained"
                      style={{ fontSize: "14px" }}
                      onClick={() => connect()}
                    >
                      Connect Wallet
                    </SmallButton>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Header>
        <NavigationMenu disableMobileMenu={disableMobileMenu} />
      </StyledToolbar>
    </StyledAppBar>
  )
}
