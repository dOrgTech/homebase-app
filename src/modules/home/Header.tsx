import { AppBar, Box, Button, Grid, Link, styled, Theme, Toolbar, Typography } from "@material-ui/core"
import HomeButton from "assets/logos/homebase_logo.svg"
import hexToRgba from "hex-to-rgba"
import React from "react"
import { MainButton } from "../common/MainButton"

const StyledAppBar = styled(AppBar)(({ theme }: { theme: Theme }) => ({
  boxShadow: "none",
  background: "none",
  position: "sticky",

  ["@media (max-height:750px)"]: {
    position: "static"
  }
}))

const LogoItem = styled("img")({
  cursor: "pointer",
  paddingTop: 8,
  height: "30px"
})
const LogoText = styled(Typography)({
  fontWeight: "bold",
  fontSize: "24px",
  cursor: "pointer",
  fontFamily: "Roboto",
  letterSpacing: "initial"
})

const StyledToolbar = styled(Toolbar)({
  width: "100%",
  padding: 0,
  boxSizing: "border-box",
  justifyContent: "space-between",
  flexWrap: "wrap"
})

const Head = styled(Grid)(({ theme }) => ({
  width: "1000px",
  height: "100%",
  margin: "auto",
  padding: "28px 0",
  flexDirection: "row",

  ["@media (max-width:1167px)"]: {
    width: "86vw"
  },

  ["@media (max-width:645px)"]: {
    flexDirection: "column"
  }
}))

export const Header: React.FC = () => {
  return (
    <StyledAppBar>
      <StyledToolbar>
        <Head container alignItems="center" wrap="wrap" justifyContent={"space-between"}>
          <Grid item>
            <Link href={`/landing`}>
              <Grid container alignItems="center" wrap="nowrap">
                <Grid item>
                  <LogoItem src={HomeButton} />
                </Grid>
                <Grid item>
                  <Box paddingLeft="10px">
                    <LogoText color="textPrimary">Homebase</LogoText>
                  </Box>
                </Grid>
              </Grid>
            </Link>
          </Grid>
          <Grid item>
            <Link href={`/explorer`} underline="none">
              <MainButton variant="contained" color="secondary">
                Enter App
              </MainButton>
            </Link>
          </Grid>
        </Head>
      </StyledToolbar>
    </StyledAppBar>
  )
}
