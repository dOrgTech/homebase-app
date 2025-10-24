import React from "react"
import { Box, Grid, useTheme, useMediaQuery } from "@material-ui/core"

import HomeButton from "assets/logos/homebase-logo.svg"
import { NavigationMenu } from "modules/explorer/components/NavigationMenu"

import { ToolbarAccount } from "modules/common/ToolbarAccount"
import { Header, StyledAppBar, StyledToolbar, LogoText, LogoItem, ToolbarContainer } from "components/ui/Toolbar"

export const Navbar: React.FC<{ disableMobileMenu?: boolean }> = ({ disableMobileMenu, children }) => {
  const theme = useTheme()
  const isMobileExtraSmall = useMediaQuery(theme.breakpoints.down("mobile"))
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))

  return (
    <StyledAppBar>
      <StyledToolbar>
        <Header container alignItems="center" wrap="wrap" justifyContent={"space-between"}>
          <Grid
            item
            xs={isMobileSmall ? 12 : undefined}
            style={isMobileSmall ? { display: "flex", justifyContent: "center" } : undefined}
          >
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

          <Grid item xs={isMobileSmall ? 12 : undefined}>
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
