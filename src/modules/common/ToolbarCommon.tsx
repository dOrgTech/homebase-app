// TODO: @ashutoshpw
// Merge into one
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

import HomeButton from "assets/logos/homebase-logo.svg"
import { useTezos } from "services/beacon/hooks/useTezos"
import { toShortAddress } from "services/contracts/utils"
import { ExitToAppOutlined, FileCopyOutlined } from "@material-ui/icons"

import { UserProfileName } from "modules/explorer/components/UserProfileName"
import { ProfileAvatar } from "modules/explorer/components/styled/ProfileAvatar"

import { ChangeNetworkButton } from "./ChangeNetworkButton"
import { ArrowBackIos } from "@material-ui/icons"
import { ConnectWalletButton } from "./ConnectWalletButton"
import { NavigationMenu } from "modules/explorer/components/NavigationMenu"
import { ActionSheet, useActionSheet } from "modules/explorer/context/ActionSheets"

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

interface NavbarProps {
  variant?: "default" | "explorer"
  mode?: "creator" | "explorer"
  disableMobileMenu?: boolean
}

export const Navbar: React.FC<NavbarProps> = ({ variant = "default", mode, children, disableMobileMenu }) => {
  const { reset, connect, account: tzAccountAddress, etherlink, network } = useTezos()
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [popperOpen, setPopperOpen] = useState(false)
  const theme = useTheme()
  const isMobileExtraSmall = useMediaQuery(theme.breakpoints.down("xs"))

  const { open: openUserMenuSheet } = useActionSheet(ActionSheet.UserMenu)

  const walletAddress = network.startsWith("etherlink") ? etherlink.account?.address : tzAccountAddress

  const handleClick = (event: React.MouseEvent<any>) => {
    if (variant === "default") {
      setAnchorEl(event.currentTarget)
      setPopperOpen(!popperOpen)
    } else {
      openUserMenuSheet()
    }
  }

  const handleLogout = () => {
    reset()
    setPopperOpen(false)
  }

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address)
    setPopperOpen(false)
  }

  const renderAccountButton = () => {
    if (walletAddress) {
      return (
        <Grid
          container
          alignItems="center"
          style={{ gap: 12 }}
          justifyContent={isMobileExtraSmall ? "center" : "flex-end"}
        >
          {children}
          <Grid item>
            <Grid container alignItems="center" style={{ gap: variant === "default" ? 8 : 16 }}>
              <Grid item>
                <ChangeNetworkButton />
              </Grid>
              <AddressBarWrapper item onClick={handleClick}>
                <AddressContainer
                  container
                  alignItems="center"
                  wrap="nowrap"
                  justifyContent="flex-end"
                  style={{ gap: variant === "default" ? 8 : 16 }}
                >
                  <Grid item>
                    <ProfileAvatar size={22} address={walletAddress} />
                  </Grid>
                  <Grid item>
                    <Typography color={variant === "default" ? "textSecondary" : "textPrimary"} variant="body2">
                      <UserProfileName address={walletAddress} short={true} />
                    </Typography>
                  </Grid>
                </AddressContainer>
              </AddressBarWrapper>
            </Grid>
          </Grid>
        </Grid>
      )
    } else {
      return (
        <Grid container justifyContent="flex-end" alignItems="center" wrap="nowrap" style={{ gap: 8 }}>
          <Grid item>
            <ChangeNetworkButton />
          </Grid>
          <Grid item>
            <ConnectWalletButton connect={connect} variant={variant === "default" ? "header" : "explorer"} />
          </Grid>
        </Grid>
      )
    }
  }

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
                    <LogoText color={variant === "default" ? "textSecondary" : "textPrimary"}>Homebase</LogoText>
                  </Box>
                </Grid>
              </ToolbarContainer>
            </Box>
          </Grid>

          <Grid item>
            <Grid container justifyContent={isMobileExtraSmall ? "center" : "flex-end"}>
              {renderAccountButton()}
            </Grid>
          </Grid>

          {variant === "default" && mode !== "creator" && (
            <BackButtonContainer container justifyContent="flex-start">
              <BackButtonText container item xs={6} md={2} onClick={() => (location.href = `/explorer`)}>
                <BackButtonIcon />
                <BackButton>Back</BackButton>
              </BackButtonText>
            </BackButtonContainer>
          )}
        </Header>
        {variant === "explorer" && <NavigationMenu disableMobileMenu={disableMobileMenu} />}
      </StyledToolbar>

      {variant === "default" && (
        <StyledPopover
          id={"wallet-Popper"}
          open={popperOpen}
          anchorEl={anchorEl}
          style={{ zIndex: 1500, borderRadius: 4 }}
          onClose={() => {
            setPopperOpen(false)
          }}
          PaperProps={{
            style: {
              borderRadius: 4,
              backgroundColor: "transparent"
            }
          }}
        >
          <AddressMenu>
            <AddressMenuItem container alignItems="center" onClick={() => handleCopy(walletAddress!)}>
              <AddressMenuIcon item>
                <FileCopyOutlined color="inherit" fontSize="inherit" />
              </AddressMenuIcon>
              <Grid item>
                <Typography variant="subtitle2" color="textSecondary">
                  {toShortAddress(walletAddress!)}
                </Typography>
              </Grid>
            </AddressMenuItem>
            <AddressMenuItem container alignItems="center" onClick={handleLogout}>
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
      )}
    </StyledAppBar>
  )
}

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

const StyledPopover = styled(Popover)({
  ".MuiPaper-root": {
    borderRadius: 4
  }
})
