import React from "react"
import { Grid, Link, styled, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import { MainButton } from "modules/common/MainButton"
import { Navbar } from "modules/common/Toolbar"
import { useHistory } from "react-router-dom"
import { useTezos } from "services/beacon/hooks/useTezos"

const PageContainer = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.main
}))

const PageContent = styled(Grid)(({ theme }) => ({
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

const Title = styled(Typography)(({ theme }) => ({
  fontSize: 32,
  fontWeight: 600,
  textAlign: "center",
  [theme.breakpoints.down("sm")]: {
    fontSize: 26
  }
}))

const CardContainer = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.dark,
  gap: 32,
  borderRadius: 8,
  padding: "40px 48px",
  [theme.breakpoints.down("sm")]: {
    padding: "30px 38px"
  }
}))

const DescriptionContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    paddingLeft: "4%",
    paddingRight: "4%"
  }
}))

const OptionsContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    paddingLeft: "4%",
    paddingRight: "4%"
  }
}))

const ChoicesContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    gap: 32
  }
}))

const DescriptionText = styled(Typography)(({ theme }) => ({
  fontWeight: 300,
  fontSize: 18,
  color: theme.palette.text.secondary,
  [theme.breakpoints.down("sm")]: {
    fontSize: 14
  }
}))

const OptionButton = styled(Link)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    display: "flex",
    textAlign: "center"
  }
}))

export const Ownership: React.FC = () => {
  const theme = useTheme()
  const { account, etherlink } = useTezos()
  const history = useHistory()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))

  return (
    <>
      <PageContainer container direction="row">
        <Navbar mode="creator" />
        <PageContent>
          <CardContainer container>
            <Grid container direction="row">
              <Title color="textSecondary">Do you already have a governance token?</Title>
            </Grid>

            <Grid container direction="row">
              <DescriptionContainer item>
                <DescriptionText>
                  This would be an FA2-compatible token contract that will serve to assign voting weight based on
                  ownership.
                </DescriptionText>
              </DescriptionContainer>
            </Grid>
            <Grid container direction="row">
              <OptionsContainer item>
                <DescriptionText>
                  If you already have this asset deployed, click YES. If not, click NO and we will configure and deploy
                  one now.
                </DescriptionText>
              </OptionsContainer>
            </Grid>

            <ChoicesContainer
              container
              direction="row"
              alignContent="center"
              justifyContent={isMobileSmall ? "center" : "flex-start"}
            >
              <Grid item xs={isMobileSmall ? 12 : 3} container justifyContent={isMobileSmall ? "center" : "flex-start"}>
                <OptionButton underline="none" href={`/creator/build`}>
                  <MainButton variant="contained" color="secondary">
                    Yes, I have one
                  </MainButton>
                </OptionButton>
              </Grid>
              <Grid item xs={isMobileSmall ? 12 : 3} container justifyContent={isMobileSmall ? "center" : "flex-start"}>
                <OptionButton
                  underline="none"
                  onClick={() => {
                    if (etherlink.isConnected) {
                      window.open(`https://www.cookbook.dev/contracts/simple-token`)
                    } else {
                      const href = `/creator/deployment`
                      history.push(href)
                    }
                  }}
                >
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
