import React, { useEffect, useState } from "react"
import { Grid, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import { MainButton } from "modules/common/MainButton"
import { Navbar } from "modules/common/Toolbar"
import { useHistory, useLocation } from "react-router-dom"
import { Blockie } from "modules/common/Blockie"
import { CopyAddress } from "modules/common/CopyAddress"
import { PageContainer, PageContent, TitleMediumCenter } from "../../ui"
import {
  CardContainer,
  DescriptionContainer,
  DescriptionText,
  OptionsContainer,
  ChoicesContainer,
  OptionButton
} from "../../ui/success"

export const Success: React.FC = () => {
  const location = useLocation<{ address: string }>()
  const [address, setAddress] = useState("")
  const history = useHistory()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

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
              <TitleMediumCenter color="textSecondary">Governance token successfully deployed!</TitleMediumCenter>
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

            <ChoicesContainer
              container
              direction="row"
              alignContent="center"
              justifyContent={isMobile ? "center" : "flex-start"}
            >
              <Grid container direction="row" justifyContent={"center"} item xs={isMobile ? 8 : 2}>
                <OptionButton underline="none" href={`/creator/build/template`}>
                  <MainButton variant="contained" color="secondary">
                    Create DAO
                  </MainButton>
                </OptionButton>
              </Grid>
              <Grid container direction="row" justifyContent={"center"} item xs={isMobile ? 8 : 2}>
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
