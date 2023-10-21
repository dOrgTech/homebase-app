import React from "react"
import { Grid, Typography, styled, useMediaQuery, useTheme } from "@material-ui/core"
import HomeButton from "assets/logos/footer_logo.svg"
import Documentation from "assets/logos/footer_documentation.svg"
import Help from "assets/logos/footer_help.svg"
import Tezos from "assets/logos/footer_tezos.svg"
import Explorer from "assets/logos/footer_explorer.svg"
import Github from "assets/logos/footer_github.svg"
import Discord from "assets/logos/footer_discord.svg"
import Youtube from "assets/logos/footer_youtube.svg"
import dOrg from "assets/logos/footer_dorg.svg"
import { useTezos } from "services/beacon/hooks/useTezos"

const Footer = styled(Grid)(({ theme }) => ({
  width: "100%",
  height: "126px",
  backgroundColor: "#24282d",
  paddingTop: 40,
  paddingBottom: 40,
  marginTop: 32,
  [theme.breakpoints.down("sm")]: {
    height: "auto",
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

const BottomContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
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
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))
  const { network } = useTezos()

  const goToFAQ = () => {
    window.open("https://faq.tezos-homebase.io/homebase-faq/", "_blank")
  }

  const goToExplorer = () => {
    return network === "ghostnet"
      ? window.open("https://ghostnet.tzkt.io/", "_blank")
      : window.open("https://tzkt.io/", "_blank")
  }

  const goToTezos = () => {
    window.open("https://tezos.com/", "_blank")
  }

  const goToGithub = () => {
    window.open("https://github.com/dOrgTech/homebase-app", "_blank")
  }

  const goToDiscord = () => {
    window.open("https://discord.com/invite/yXaPy6s5Nr", "_blank")
  }

  const goToYoutube = () => {
    window.open("https://www.youtube.com/@Tezos", "_blank")
  }

  const goTodOrg = () => {
    window.open("https://www.dorg.tech/", "_blank")
  }

  return (
    <Footer>
      <Container container direction="column" style={isMobileSmall ? { gap: 22 } : { gap: 32 }}>
        <Grid item>
          <HomebaseLogoItem src={HomeButton} />
        </Grid>
        <Grid item container direction="row">
          {!isMobileSmall ? <Grid item sm={5} md={5}></Grid> : null}

          <Grid
            item
            sm={9}
            xs={12}
            md={7}
            container
            direction="row"
            alignItems="center"
            style={isMobileSmall ? { gap: 8 } : {}}
            justifyContent={isMobileSmall ? "space-between" : "flex-end"}
          >
            <Grid
              container
              direction="row"
              style={{ gap: 8 }}
              item
              sm={4}
              xs={5}
              md={3}
              justifyContent={isMobileSmall ? "flex-start" : "flex-end"}
              onClick={goToFAQ}
            >
              <LogoItem src={Documentation} />
              <ItemText color="textPrimary">Documentation</ItemText>
            </Grid>
            <Grid
              container
              direction="row"
              item
              sm={4}
              xs={5}
              md={3}
              style={isMobileSmall ? { gap: 8 } : { marginLeft: -40, gap: 8 }}
              justifyContent={isMobileSmall ? "flex-start" : "flex-end"}
            >
              <LogoItem src={Help} />
              <ItemText color="textPrimary">Help</ItemText>
            </Grid>
            <Grid
              container
              direction="row"
              style={{ gap: 8 }}
              item
              sm={4}
              xs={5}
              md={3}
              justifyContent={isMobileSmall ? "flex-start" : "center"}
              onClick={goToTezos}
            >
              <LogoItem src={Tezos} />
              <ItemText color="textPrimary">Tezos</ItemText>
            </Grid>
            <Grid
              container
              direction="row"
              style={{ gap: 8 }}
              item
              sm={4}
              xs={5}
              md={3}
              justifyContent={isMobileSmall ? "flex-start" : "center"}
              onClick={goToExplorer}
            >
              <LogoItem src={Explorer} />
              <ItemText color="textPrimary">TzKT Explorer</ItemText>
            </Grid>
          </Grid>
        </Grid>
        <BottomContainer item container direction="row">
          <Grid item sm={12} md={6} xs={12} style={{ gap: 24 }} container direction="row">
            <LogoItem src={Github} onClick={goToGithub} />
            <LogoItem src={Discord} onClick={goToDiscord} />
            <LogoItem src={Youtube} onClick={goToYoutube} />
          </Grid>
          <Grid
            item
            md={6}
            sm={12}
            xs={12}
            container
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            style={{ gap: 8 }}
          >
            <DesignedByText color="textPrimary"> Designed & Developed by</DesignedByText>
            <LogoItem src={dOrg} onClick={goTodOrg} />
          </Grid>
        </BottomContainer>
      </Container>
    </Footer>
  )
}
