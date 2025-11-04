import React, { useState } from "react"
import { styled, Typography, Box, Grid, Popover, useTheme, useMediaQuery } from "@material-ui/core"
import { ExitToAppOutlined, FileCopyOutlined } from "@material-ui/icons"

import { useTezos } from "services/beacon/hooks/useTezos"
import { ProfileAvatar } from "modules/explorer/components/styled/ProfileAvatar"
import { toShortAddress } from "services/contracts/utils"

import { ChangeNetworkButton as ChangeNetworkButton_Common } from "modules/common/ChangeNetworkButton"
import { ChangeNetworkButton as ChangeNetworkButton_Explorer } from "modules/explorer/components/ChangeNetworkButton"
import { ConnectWalletButton } from "./ConnectWalletButton"

import { ActionSheet, useActionSheet } from "modules/explorer/context/ActionSheets"
import { UserProfileName } from "modules/explorer/components/UserProfileName"

const StyledPopover = styled(Popover)({
  ".MuiPaper-root": {
    borderRadius: 4
  }
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

const AddressContainer = styled(Grid)({
  cursor: "pointer"
})

const StyledUserProfileName = styled(Typography)({
  color: "#ddd"
})

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

export const ToolbarAccount: React.FC<any> = ({ children, variant = "common" }) => {
  const theme = useTheme()
  const { connect, account, etherlink, network, reset } = useTezos()
  const tzAccountAddress = account
  const isMobileExtraSmall = useMediaQuery(theme.breakpoints.down("mobile"))

  const { open: openUserMenuSheet } = useActionSheet(ActionSheet.UserMenu)
  const { open: openNetworkSheet } = useActionSheet(ActionSheet.Network)
  const walletAddress = network.startsWith("etherlink") ? etherlink.account?.address : tzAccountAddress

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
  const [popperOpen, setPopperOpen] = useState(false)

  // Methods for Common - Start

  const handleLogout = () => {
    reset()
    setPopperOpen(false)
  }

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address)
    setPopperOpen(false)
  }

  const handleNetworkClick = (event: React.MouseEvent<any>) => {
    try {
      openNetworkSheet()
    } finally {
      setPopperOpen(false)
    }
  }

  // Methods for Common - End
  const handleAddressbarClick = (event: React.MouseEvent<any>) => {
    if (variant === "explorer") return openUserMenuSheet()

    setAnchorEl(event.currentTarget)
    setPopperOpen(!popperOpen)
  }

  if (walletAddress || etherlink?.isConnected)
    return (
      <Grid
        container
        alignItems="center"
        style={{ gap: 12 }}
        justifyContent={isMobileExtraSmall ? "center" : "flex-end"}
      >
        {children}
        <Grid item>
          <Grid container alignItems="center" style={{ gap: 8 }}>
            <Grid item>{variant === "common" ? <ChangeNetworkButton_Common /> : <ChangeNetworkButton_Explorer />}</Grid>
            <AddressBarWrapper
              item
              onClick={handleAddressbarClick}
              style={{
                background: variant === "common" ? theme.palette.primary.dark : theme.palette.primary.main
              }}
            >
              <AddressContainer
                container
                alignItems="center"
                wrap="nowrap"
                justifyContent="flex-end"
                style={{ gap: variant === "explorer" ? 16 : 8 }}
              >
                <Grid item>
                  <ProfileAvatar size={22} address={walletAddress || ""} />
                </Grid>
                <Grid item>
                  {variant === "common" ? (
                    <StyledUserProfileName>
                      <UserProfileName address={walletAddress} short={true} />
                    </StyledUserProfileName>
                  ) : (
                    <Typography color="textPrimary" variant="body2">
                      <UserProfileName address={walletAddress} short={true} />
                    </Typography>
                  )}
                </Grid>
              </AddressContainer>
            </AddressBarWrapper>
          </Grid>
        </Grid>

        {variant === "common" ? (
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
            <AddressMenu id="address-menu">
              <AddressMenuItem container alignItems="center" onClick={() => handleCopy(walletAddress!)}>
                <AddressMenuIcon item>
                  <FileCopyOutlined color="inherit" fontSize="inherit" />
                </AddressMenuIcon>
                <Grid item>
                  <Typography variant="subtitle2" style={{ color: "#ddd" }}>
                    {toShortAddress(walletAddress)}
                  </Typography>
                </Grid>
              </AddressMenuItem>
              <AddressMenuItem container alignItems="center" onClick={handleNetworkClick}>
                <Grid item>
                  <Typography variant="subtitle2" style={{ color: "#ddd" }}>
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
                  <Typography variant="subtitle2" style={{ color: "#ddd" }}>
                    Log out
                  </Typography>
                </Grid>
              </AddressMenuItem>
            </AddressMenu>
          </StyledPopover>
        ) : null}
      </Grid>
    )
  else {
    return (
      <Grid container justifyContent="flex-end" alignItems="center" wrap="nowrap" style={{ gap: 8 }}>
        <Grid item>{variant === "common" ? <ChangeNetworkButton_Common /> : <ChangeNetworkButton_Explorer />}</Grid>
        <Grid item>
          <ConnectWalletButton connect={connect} variant="header" />
        </Grid>
      </Grid>
    )
  }
}
