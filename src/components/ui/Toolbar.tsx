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

const LogoText = styled(Typography)({
  fontWeight: "bold",
  fontSize: "26px",
  cursor: "pointer",
  fontFamily: "Roboto Flex",
  letterSpacing: "initial"
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

export { Header, StyledAppBar, StyledToolbar, LogoText, LogoItem, ToolbarContainer }
