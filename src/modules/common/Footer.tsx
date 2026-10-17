import React from "react"
import { Grid, Typography, styled, useMediaQuery, useTheme } from "@mui/material"
import HomeButton from "assets/logos/footer_logo.svg"
import Documentation from "assets/logos/footer_documentation.svg"
import Tezos from "assets/logos/footer_tezos.svg"
import Explorer from "assets/logos/footer_explorer.svg"
import Github from "assets/logos/footer_github.svg"
import Discord from "assets/logos/footer_discord.svg"
import Youtube from "assets/logos/footer_youtube.svg"
import dOrg from "assets/logos/footer_dorg.svg"
import { useTezos } from "services/beacon/hooks/useTezos"
import { useLocation } from "react-router-dom"

const Footer = styled(Grid)(({ theme }) => ({
  width: "100%",
  backgroundColor: "#24282d",
  paddingTop: 40,
  paddingBottom: 40,
  marginTop: 32,
  [theme.breakpoints.down("lg")]: {
    paddingTop: 30,
    paddingBottom: 30
  }
}))

const LogoItem = styled("img")({
  opacity: 0.65,
  cursor: "pointer"
})

const HomebaseLogoItem = styled("img")({
  opacity: 0.65,
  cursor: "default"
})

const ItemText = styled(Typography)({
  fontSize: 15,
  opacity: 0.65,
  cursor: "pointer"
})

const DesignedByText = styled(Typography)({
  fontSize: 13.5,
  opacity: 0.65,
  fontWeight: 300
})

const CreditLink = styled("a")({
  color: "inherit",
  textDecoration: "underline",
  textUnderlineOffset: 2,
  cursor: "pointer"
})

const BottomContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("lg")]: {
    gap: 12
  }
}))

const Container = styled(Grid)(({ theme }) => ({
  margin: "auto",
  width: 1000,
  ["@media (max-width: 1425px)"]: {},

  ["@media (max-width:1335px)"]: {},

  ["@media (max-width:1167px)"]: {
    width: "86vw"
  },

  ["@media (max-width:1030px)"]: {},

  ["@media (max-width:960px)"]: {}
}))

export const ExplorerFooter: React.FC = () => {
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("lg"))
  const { network, account } = useTezos()
  const discordLink = account ? "https://discord.gg/ZRVk6zu3xR" : "https://discord.gg/yqv8ABG2EN"
  const { pathname } = useLocation()
  // DAO pages show a fixed 55px bottom bar below 960px (NavigationMenu); leave room so the footer is not covered.
  const hasBottomBar = useMediaQuery(theme.breakpoints.down(960)) && /^\/explorer\/dao\//.test(pathname)

  const goToDocs = () => {
    window.open("https://docs.tezos-homebase.io/", "_blank")
  }

  const goToExplorer = () => {
    return network === "shadownet"
      ? window.open("https://shadownet.tzkt.io/", "_blank")
      : window.open("https://tzkt.io/", "_blank")
  }

  const goToTezos = () => {
    window.open("https://tezos.com/", "_blank")
  }

  const goToGithub = () => {
    window.open("https://github.com/dOrgTech/homebase-app", "_blank")
  }

  const goToDiscord = () => {
    window.open(discordLink, "_blank")
  }

  const goToYoutube = () => {
    window.open("https://www.youtube.com/@Tezos", "_blank")
  }

  const goTodOrg = () => {
    window.open("https://www.dorg.tech/", "_blank")
  }

  return (
    <Footer style={hasBottomBar ? { paddingBottom: 30 + 55 } : undefined}>
      <Container container direction="column" style={isMobileSmall ? { gap: 22 } : { gap: 32 }}>
        <Grid
          item
          container
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          style={isMobileSmall ? { gap: 16 } : {}}
        >
          <HomebaseLogoItem src={HomeButton} />
          <Grid
            item
            container
            direction="row"
            alignItems="center"
            style={{ gap: isMobileSmall ? 20 : 40, width: "auto" }}
          >
            <Grid container direction="row" alignItems="center" style={{ gap: 8, width: "auto" }} onClick={goToDocs}>
              <LogoItem src={Documentation} />
              <ItemText color="textPrimary">Documentation</ItemText>
            </Grid>
            <Grid container direction="row" alignItems="center" style={{ gap: 8, width: "auto" }} onClick={goToTezos}>
              <LogoItem src={Tezos} />
              <ItemText color="textPrimary">Tezos</ItemText>
            </Grid>
            <Grid
              container
              direction="row"
              alignItems="center"
              style={{ gap: 8, width: "auto" }}
              onClick={goToExplorer}
            >
              <LogoItem src={Explorer} />
              <ItemText color="textPrimary">TzKT Explorer</ItemText>
            </Grid>
          </Grid>
        </Grid>
        <BottomContainer item container direction="row" alignItems="center" justifyContent="space-between">
          <Grid item container direction="row" alignItems="center" style={{ gap: 24, width: "auto" }}>
            <LogoItem src={Github} onClick={goToGithub} />
            <LogoItem src={Discord} onClick={goToDiscord} />
            <LogoItem src={Youtube} onClick={goToYoutube} />
          </Grid>
          <Grid
            item
            container
            direction="column"
            alignItems={isMobileSmall ? "flex-start" : "flex-end"}
            style={{ gap: 6, width: "auto" }}
          >
            <DesignedByText color="textPrimary">
              Supported by{" "}
              <CreditLink href="https://tezoscommons.org" target="_blank" rel="noopener noreferrer">
                Tezos Commons
              </CreditLink>
            </DesignedByText>
            <Grid container direction="row" alignItems="center" style={{ gap: 8, width: "auto" }}>
              <DesignedByText color="textPrimary">Designed & Developed by</DesignedByText>
              <LogoItem src={dOrg} onClick={goTodOrg} />
            </Grid>
          </Grid>
        </BottomContainer>
      </Container>
    </Footer>
  )
}
