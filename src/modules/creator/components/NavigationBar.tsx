import { styled, Grid, Typography, Paper, useMediaQuery, useTheme } from "@material-ui/core"
import React from "react"
import { ArrowBackIos } from "@material-ui/icons"
import { SmallButton } from "modules/common/SmallButton"
import { NavigationBarProps } from "modules/creator/state"

const Footer = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.main,
  marginLeft: 47,
  height: "fit-content",
  ["@media (max-width:1167px)"]: {
    marginLeft: 0
  }
}))

const BackButton = styled(Paper)({
  boxShadow: "none",
  background: "inherit",
  color: "#fff",
  textAlign: "start",
  cursor: "pointer",
  display: "flex",
  alignItems: "baseline",
  width: "fit-content",
  float: "left"
})

// const NextButton = styled(Paper)(({ theme }) => ({
//   boxShadow: "none",
//   borderRadius: 4,
//   textAlign: "center",
//   float: "right",
//   cursor: "pointer",
//   background: theme.palette.secondary.light,
//   padding: 8
// }))

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
    <Footer container direction="row">
      <FooterContainer item xs={12} container alignItems="center" isMobile={isMobile}>
        <Grid item xs={6}>
          {back && (
            <BackButton onClick={back.handler}>
              <BackButtonIcon />
              <Typography style={{ fontWeight: 400 }} color="secondary">
                {back.text}
              </Typography>
            </BackButton>
          )}
        </Grid>
        <Grid item xs={6}>
          {next && (
            <SmallButton style={{ float: "right" }} onClick={next.handler}>
              <Typography color="primary" style={{ fontWeight: 500 }}>
                {next.text}
              </Typography>
            </SmallButton>
          )}
        </Grid>
      </FooterContainer>
    </Footer>
  )
}
