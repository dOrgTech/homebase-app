import React, { useEffect, useState } from "react"
import { Grid, Link, styled, Typography } from "@material-ui/core"
import { MainButton } from "modules/common/MainButton"
import { Navbar } from "modules/common/Toolbar"
import { useHistory, useLocation } from "react-router-dom"
import { Blockie } from "modules/common/Blockie"
import { CopyAddress } from "modules/common/CopyAddress"

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
  display: "inline-flex",
  [theme.breakpoints.down("sm")]: {
    paddingLeft: "4%",
    paddingRight: "4%"
  }
}))

const OptionsContainer = styled(Grid)(({ theme }) => ({
  marginTop: 40,
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

export const Success: React.FC = () => {
  const location = useLocation<{ address: string }>()
  const [address, setAddress] = useState("")
  const history = useHistory()

  useEffect(() => {
    if (location && location.state && location.state.address) {
      setAddress(location.state.address)
    } else {
      history.push("/explorer")
    }
  }, [location, history])
  return (
    <>
      <PageContainer container direction="row">
        <Navbar mode="creator" />
        <PageContent>
          <CardContainer>
            <Grid container direction="row">
              <Title color="textSecondary">Governance token successfully deployed!</Title>
            </Grid>

            <Grid container direction="column">
              <Grid item>
                <DescriptionText style={{ marginTop: 40, marginBottom: 20 }}>Your Token Address:</DescriptionText>
              </Grid>
              <DescriptionContainer item>
                <DescriptionText style={{ display: "inline-flex", alignItems: "center" }}>
                  <Blockie address={address} size={35} style={{ marginRight: 16 }} />
                  {address && (
                    <CopyAddress
                      address={address}
                      typographyProps={{
                        variant: "body1",
                        color: "textSecondary"
                      }}
                    />
                  )}
                </DescriptionText>
              </DescriptionContainer>

              <OptionsContainer item>
                <DescriptionText>Would you like to continue and create a DAO?</DescriptionText>
              </OptionsContainer>
            </Grid>

            <ChoicesContainer container direction="row" alignContent="center" justifyContent="center">
              <Grid item xs>
                <OptionButton underline="none" href={`/creator/build/dao`}>
                  <MainButton variant="contained" color="secondary">
                    Create DAO
                  </MainButton>
                </OptionButton>
              </Grid>
              <Grid item xs>
                <OptionButton underline="none" href={`/explorer`}>
                  <Typography color="secondary" style={{ padding: "6px 16px" }}>
                    {"I'm done"}
                  </Typography>
                </OptionButton>
              </Grid>
            </ChoicesContainer>
          </CardContainer>
        </PageContent>
      </PageContainer>
    </>
  )
}
