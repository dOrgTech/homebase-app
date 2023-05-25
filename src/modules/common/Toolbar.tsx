import React, { useState } from "react"
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
  Theme
} from "@material-ui/core"
import { useHistory } from "react-router-dom"
import { TezosToolkit } from "@taquito/taquito"

import HomeButton from "assets/logos/homebase_logo.svg"
import { useTezos } from "services/beacon/hooks/useTezos"
import { toShortAddress } from "services/contracts/utils"
import { ExitToAppOutlined, FileCopyOutlined } from "@material-ui/icons"
import { Network } from "services/beacon"
import { UserProfileName } from "modules/explorer/components/UserProfileName"
import { ProfileAvatar } from "modules/explorer/components/styled/ProfileAvatar"
import { NavigationMenu } from "modules/explorer/components/NavigationMenu"
import { SmallButton } from "./SmallButton"
import { ChangeNetworkButton } from "./ChangeNetworkButton"

import { ArrowBackIos } from "@material-ui/icons"
import { EnvKey, getEnv } from "services/config"
import { networkNameMap } from "services/bakingBad"

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
  fontSize: "24px",
  cursor: "pointer",
  fontFamily: "Roboto",
  letterSpacing: "initial"
})

const AddressBarWrapper = styled(Grid)({
  "boxSizing": "border-box",
  "padding": "8px 16px",
  "borderRadius": 4,
  "&:hover": {
    background: "rgba(129, 254, 183, 0.03)"
  }
})

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

export const ConnectWalletButton = ({ connect }: { connect: () => Promise<TezosToolkit> }) => (
  <SmallButton variant="outlined" onClick={() => connect()}>
    Connect Wallet
  </SmallButton>
)

export const Navbar: React.FC<{
  mode: "creator" | "explorer"
  disableMobileMenu?: boolean
}> = ({ mode, children, disableMobileMenu }) => {
  const { connect, account, reset, changeNetwork, network } = useTezos()
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const [popperOpen, setPopperOpen] = useState(false)
  const theme = useTheme()
  const isMobileExtraSmall = useMediaQuery(theme.breakpoints.down("xs"))
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))

  const [networkAnchorEl, setNetworkAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const [networkPopperOpen, setNetworkPopperOpen] = useState(false)

  const handleNetworkClick = (event: React.MouseEvent<any>) => {
    setNetworkAnchorEl(event.currentTarget)
    setNetworkPopperOpen(!networkPopperOpen)
  }

  const handleNetworkChange = (network: Network) => {
    changeNetwork(network)
    setPopperOpen(!popperOpen)
    setNetworkPopperOpen(!networkPopperOpen)
    history.push("/explorer")
  }

  const handleClick = (event: React.MouseEvent<any>) => {
    setAnchorEl(event.currentTarget)
    setPopperOpen(!popperOpen)
  }

  const handleLogout = () => {
    reset()
    setPopperOpen(false)
  }

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address)
    setPopperOpen(false)
  }

  const history = useHistory()

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
              {account ? (
                <Grid
                  container
                  alignItems="center"
                  style={{ gap: 12 }}
                  justifyContent={isMobileExtraSmall ? "center" : "flex-end"}
                >
                  {children}
                  <Grid item>
                    <Grid container alignItems="center" style={{ gap: 8 }}>
                      <Grid item>
                        <ChangeNetworkButton />
                      </Grid>
                      <AddressBarWrapper item onClick={handleClick}>
                        <AddressContainer
                          container
                          alignItems="center"
                          wrap="nowrap"
                          justifyContent="flex-end"
                          style={{ gap: 8 }}
                        >
                          <Grid item>
                            <ProfileAvatar size={22} address={account} />
                          </Grid>
                          <Grid item>
                            <StyledUserProfileName>
                              <UserProfileName address={account} short={true} />
                            </StyledUserProfileName>
                          </Grid>
                        </AddressContainer>
                      </AddressBarWrapper>
                    </Grid>
                  </Grid>

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
                      <AddressMenuItem container alignItems="center" onClick={() => handleCopy(account)}>
                        <AddressMenuIcon item>
                          <FileCopyOutlined color="inherit" fontSize="inherit" />
                        </AddressMenuIcon>
                        <Grid item>
                          <Typography variant="subtitle2" color="textSecondary">
                            {toShortAddress(account)}
                          </Typography>
                        </Grid>
                      </AddressMenuItem>
                      <AddressMenuItem container alignItems="center" onClick={handleNetworkClick}>
                        <Grid item>
                          <Typography variant="subtitle2" color="textSecondary">
                            Change network ({network})
                          </Typography>
                        </Grid>
                      </AddressMenuItem>
                      <AddressMenuItem
                        style={{
                          borderTop: "2px solid rgba(255, 255, 255, 0.2)"
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
