import React from "react"
import { Grid, useMediaQuery, useTheme } from "@material-ui/core"
import { MainButton } from "modules/common/MainButton"
import { Navbar } from "modules/common/Toolbar"
import { useHistory } from "react-router-dom"
import { useTezos } from "services/beacon/hooks/useTezos"
import {
  CenterTitle,
  PageContainer,
  PageContent,
  DescriptionText,
  CardContainer,
  DescriptionContainer,
  OptionsContainer,
  ChoicesContainer,
  OptionButton
} from "../../ui"

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
              <CenterTitle color="textSecondary">Do you already have a governance token?</CenterTitle>
            </Grid>

            <Grid container direction="row">
              <DescriptionContainer item>
                <DescriptionText>
                  This would be an ERC20-compatible token contract that will serve to assign voting weight based on
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
