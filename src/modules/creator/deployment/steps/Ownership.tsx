import React from "react"
import { Grid, Link, styled, Typography } from "@material-ui/core"
import { MainButton } from "modules/common/MainButton"
import { Navbar } from "modules/common/Toolbar"

const PageContainer = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.main
}))

const PageContent = styled(Grid)(({ theme }) => ({
  marginTop: 60,
  width: "1000px",
  height: "100%",
  margin: "auto",
  padding: "28px 0",
  flexDirection: "row",
  paddingTop: 0,
  ["@media (max-width:1167px)"]: {
    width: "86vw"
  },
  [theme.breakpoints.down("sm")]: {
    marginTop: 10
  }
}))

const Title = styled(Typography)({
  fontSize: 24,
  textAlign: "center"
})

const CardContainer = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.dark,
  borderRadius: 8,
  padding: "36px 47px"
}))

const DescriptionContainer = styled(Grid)(({ theme }) => ({
  marginTop: 32,
  [theme.breakpoints.down("sm")]: {
    paddingLeft: "4%",
    paddingRight: "4%",
    marginTop: 40
  }
}))

const OptionsContainer = styled(Grid)(({ theme }) => ({
  marginTop: 20,
  [theme.breakpoints.down("sm")]: {
    paddingLeft: "4%",
    paddingRight: "4%",
    marginTop: 40
  }
}))

const ChoicesContainer = styled(Grid)(({ theme }) => ({
  marginTop: 50,
  paddingLeft: "24%",
  paddingRight: "24%",
  [theme.breakpoints.down("sm")]: {
    paddingLeft: "2%",
    paddingRight: "2%"
  }
}))

const DescriptionText = styled(Typography)(({ theme }) => ({
  fontWeight: 200,
  color: theme.palette.text.secondary,
  [theme.breakpoints.down("sm")]: {
    fontSize: 14
  }
}))

const OptionButton = styled(Link)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    width: "95%",
    display: "flex",
    textAlign: "center"
  }
}))

export const Ownership: React.FC = () => {
  return (
    <>
      <PageContainer container direction="row">
        <Navbar mode="creator" />
        <PageContent>
          <CardContainer>
            <Grid container direction="row">
              <Title color="textSecondary">Do you already have a governance token?</Title>
            </Grid>

            <Grid container direction="column">
              <DescriptionContainer item>
                <DescriptionText>
                  This would be an FA2-compatible token contract that will serve to assign voting weight based on
                  ownership.
                </DescriptionText>
              </DescriptionContainer>

              <OptionsContainer item>
                <DescriptionText>
                  If you already have this asset deployed, click YES. If not, click NO and we will configure and deploy
                  one now.
                </DescriptionText>
              </OptionsContainer>
            </Grid>

            <ChoicesContainer container direction="row" alignContent="center" justifyContent="center">
              <Grid item xs>
                <OptionButton underline="none" href={`/creator/build`}>
                  <MainButton variant="contained" color="secondary">
                    Yes, I have one
                  </MainButton>
                </OptionButton>
              </Grid>
              <Grid item xs>
                <OptionButton underline="none" href={`/creator/deployment`}>
                  <MainButton variant="contained" color="secondary">
                    No, I need one
                  </MainButton>
                </OptionButton>
              </Grid>
            </ChoicesContainer>
          </CardContainer>
        </PageContent>
      </PageContainer>
    </>
  )
}
