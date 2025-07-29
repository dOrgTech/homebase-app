import React, { useState } from "react"
import {
  AppBar,
  Toolbar,
  styled,
  Typography,
  Box,
  Grid,
  useTheme,
  Popover,
  useMediaQuery,
  Theme
} from "@material-ui/core"

import HomeButton from "assets/logos/homebase-logo.svg?react"
import { useTezos } from "services/beacon/hooks/useTezos"
import { toShortAddress } from "services/contracts/utils"
import { ExitToAppOutlined, FileCopyOutlined } from "@material-ui/icons"

import { UserProfileName } from "modules/explorer/components/UserProfileName"
import { ProfileAvatar } from "modules/explorer/components/styled/ProfileAvatar"

import { ChangeNetworkButton } from "./ChangeNetworkButton"

import { ArrowBackIos } from "@material-ui/icons"
import { ConnectWalletButton } from "./ConnectWalletButton"
import { ToolbarAccount } from "./ToolbarAccount"

const AddressMenu = styled(Box)(() => ({
  width: 264,
  borderRadius: 4,
  backgroundColor: "#282B31"
}))

const AddressMenuItem = styled(Grid)(({ theme }) => ({
  cursor: "pointer",
  boxSizing: "border-box",
  color: theme.palette.text.secondary,
  padding: "15px 10px"
}))

const AddressMenuIcon = styled(Grid)({
  paddingRight: "12px",
  marginBottom: "-4px"
})

const StyledUserProfileName = styled(Typography)({
  color: "#ddd"
})

const StyledPopover = styled(Popover)({
  ".MuiPaper-root": {
    borderRadius: 4
  }
})

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
  background: theme.palette.primary.main,
  position: "sticky",

  ["@media (max-height:750px)"]: {
    position: "sticky"
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
  background: theme.palette.primary.dark,
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

const BackButtonContainer = styled(Grid)({
  marginTop: 28,
  alignItems: "baseline"
})

const BackButton = styled(Typography)(({ theme }) => ({
  color: theme.palette.secondary.light,
  fontSize: 18
}))

const BackButtonIcon = styled(ArrowBackIos)(({ theme }) => ({
  color: theme.palette.secondary.light,
  fontSize: 12,
  marginRight: 15
}))

const BackButtonText = styled(Grid)({
  cursor: "pointer",
  alignItems: "baseline"
})

export const Navbar: React.FC<{
  mode: "creator" | "explorer"
  disableMobileMenu?: boolean
}> = ({ mode, children, disableMobileMenu }) => {
  const theme = useTheme()
  const isMobileExtraSmall = useMediaQuery(theme.breakpoints.down("xs"))
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
                    <LogoText color="textSecondary">Homebase</LogoText>
                  </Box>
                </Grid>
              </ToolbarContainer>
            </Box>
          </Grid>

          <Grid item>
            <Grid container justifyContent={isMobileExtraSmall ? "center" : "flex-end"}>
              <ToolbarAccount>{children}</ToolbarAccount>
            </Grid>
          </Grid>
          <BackButtonContainer container justifyContent="flex-start">
            {mode !== "creator" ? (
              <BackButtonText container item xs={6} md={2} onClick={() => (location.href = `/explorer`)}>
                <BackButtonIcon />
                <BackButton>Back</BackButton>
              </BackButtonText>
            ) : null}
          </BackButtonContainer>
        </Header>
        {/* <NavigationMenu disableMobileMenu={disableMobileMenu} /> */}
      </StyledToolbar>
    </StyledAppBar>
  )
}
