import { styled, Grid, Typography, Paper, useMediaQuery, useTheme } from "@material-ui/core"
import React from "react"
import { ArrowBackIos } from "@material-ui/icons"

import { NavigationBarProps } from "modules/creator/state"
import { MainButton } from "modules/common/MainButton"

const Footer = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.main,
  marginLeft: 47,
  marginBottom: 10,
  ["@media (max-width:1167px)"]: {
    marginLeft: 0,
    marginBottom: 50
  }
}))

const BackButton = styled(Paper)({
  boxShadow: "none",
  height: 41,
  background: "inherit",
  color: "#fff",
  textAlign: "start",
  cursor: "pointer",
  display: "flex",
  alignItems: "baseline",
  padding: 8,
  width: "fit-content"
})

const NextButton = styled(MainButton)(({ theme }) => ({
  textAlign: "center",
  float: "right",
  cursor: "pointer",
  background: theme.palette.secondary.light,
  padding: "8px 16px"
}))

const BackButtonIcon = styled(ArrowBackIos)(({ theme }) => ({
  color: theme.palette.secondary.light,
  fontSize: 12,
  marginRight: 12
}))

const FooterContainer = styled(Grid)(({ isMobile }: { isMobile: boolean }) => ({
  width: "100%"
}))

export const NavigationBar: React.FC<NavigationBarProps> = ({ back, next }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  return (
    <Footer container direction="row" alignItems="center">
      <FooterContainer item xs={12} container isMobile={isMobile}>
        <Grid item xs={6}>
          {back && (
            <BackButton onClick={back.handler}>
              <BackButtonIcon />
              <Typography style={{ fontWeight: 500 }} color="secondary">
                {back.text}
              </Typography>
            </BackButton>
          )}
        </Grid>
        <Grid item xs={6}>
          {next && (
            <NextButton onClick={next.handler}>
              <Typography style={{ fontWeight: 500 }} color="primary">
                {next.text}
              </Typography>
            </NextButton>
          )}
        </Grid>
      </FooterContainer>
    </Footer>
  )
}
