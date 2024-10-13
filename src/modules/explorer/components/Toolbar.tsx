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
import { toShortAddress } from "services/contracts/utils"
import { useTezos } from "services/beacon/hooks/useTezos"
import { ChangeNetworkButton } from "./ChangeNetworkButton"
import { UserProfileName } from "modules/explorer/components/UserProfileName"
import { ProfileAvatar } from "modules/explorer/components/styled/ProfileAvatar"
import { NavigationMenu } from "modules/explorer/components/NavigationMenu"
import { ActionSheet, useActionSheet } from "../context/ActionSheets"
import { SmallButton } from "../../common/SmallButton"
import { ConnectWalletButton } from "modules/common/ConnectWalletButton"
import { ToolbarAccount } from "modules/common/ToolbarAccount"
import { Header, StyledAppBar, StyledToolbar, LogoText, LogoItem, ToolbarContainer } from "components/ui/Toolbar"

export const Navbar: React.FC<{ disableMobileMenu?: boolean }> = ({ disableMobileMenu, children }) => {
  const { connect, account: tzAccountAddress, etherlink, network } = useTezos()
  const theme = useTheme()
  const isMobileExtraSmall = useMediaQuery(theme.breakpoints.down("mobile"))

  const { open: openUserMenuSheet } = useActionSheet(ActionSheet.UserMenu)
  const walletAddress = network.startsWith("etherlink") ? etherlink.account?.address : tzAccountAddress
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
              <ToolbarAccount>{children}</ToolbarAccount>
            </Grid>
          </Grid>
        </Header>
        <NavigationMenu disableMobileMenu={disableMobileMenu} />
      </StyledToolbar>
    </StyledAppBar>
  )
}
