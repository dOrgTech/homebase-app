import React from "react"
import { Grid, Typography, styled } from "@material-ui/core"
import HomeButton from "assets/logos/footer_logo.svg"
import Documentation from "assets/logos/footer_documentation.svg"
import Help from "assets/logos/footer_help.svg"
import Tezos from "assets/logos/footer_tezos.svg"
import Explorer from "assets/logos/footer_explorer.svg"
import Github from "assets/logos/footer_github.svg"
import Discord from "assets/logos/footer_discord.svg"
import Youtube from "assets/logos/footer_youtube.svg"
import dOrg from "assets/logos/footer_dorg.svg"

const Footer = styled(Grid)(({ theme }) => ({
  width: "100%",
  height: "126px",
  backgroundColor: "#24282d",
  paddingTop: 40,
  paddingBottom: 40,
  marginTop: 32
}))

const LogoItem = styled("img")({
  opacity: 0.65,
  cursor: "pointer"
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
  return (
    <Footer>
      <Container container direction="column" style={{ gap: 32 }}>
        <Grid item>
          <LogoItem src={HomeButton} />
        </Grid>
        <Grid item container direction="row">
          <Grid item xs={5}></Grid>
          <Grid item xs={7} container direction="row" alignItems="center">
            <Grid container direction="row" style={{ gap: 8 }} item xs={3} justifyContent="flex-end">
              <LogoItem src={Documentation} />
              <ItemText color="textPrimary">Documentation</ItemText>
            </Grid>
            <Grid container direction="row" style={{ gap: 8 }} item xs={3} justifyContent="flex-end">
              <LogoItem src={Help} />
              <ItemText color="textPrimary">Help</ItemText>
            </Grid>
            <Grid container direction="row" style={{ gap: 8 }} item xs={3} justifyContent="center">
              <LogoItem src={Tezos} />
              <ItemText color="textPrimary">Tezos</ItemText>
            </Grid>
            <Grid container direction="row" style={{ gap: 8 }} item xs={3} justifyContent="flex-end">
              <LogoItem src={Explorer} />
              <ItemText color="textPrimary">TzKT Explorer</ItemText>
            </Grid>
          </Grid>
        </Grid>
        <Grid item container direction="row">
          <Grid item xs={6} style={{ gap: 24 }} container direction="row">
            <LogoItem src={Github} />
            <LogoItem src={Discord} />
            <LogoItem src={Youtube} />
          </Grid>
          <Grid item xs={6} container direction="row" alignItems="center" justifyContent="flex-end" style={{ gap: 8 }}>
            <DesignedByText color="textPrimary"> Designed & Developed by</DesignedByText>
            <LogoItem src={dOrg} />
          </Grid>
        </Grid>
      </Container>
    </Footer>
  )
}
