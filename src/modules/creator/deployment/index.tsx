import React from "react"
import { Grid, Link, styled, Typography } from "@material-ui/core"
import { Navbar } from "modules/common/Toolbar"

const Title = styled(Typography)({
  fontSize: 24,
  textAlign: "center"
})

const DescriptionContainer = styled(Grid)(({ theme }) => ({
  marginTop: 60,
  paddingLeft: "24%",
  paddingRight: "24%",
  [theme.breakpoints.down("sm")]: {
    paddingLeft: "4%",
    paddingRight: "4%",
    marginTop: 40
  }
}))

const OptionsContainer = styled(Grid)(({ theme }) => ({
  marginTop: 50,
  paddingLeft: "24%",
  paddingRight: "24%",
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
  color: "gray",
  [theme.breakpoints.down("sm")]: {
    fontSize: 14
  }
}))

const OptionText = styled(Typography)(({ theme }) => ({
  "cursor": "pointer",
  "padding": 4,
  "&:hover": {
    color: theme.palette.secondary.light,
    border: "0.5px solid",
    borderRadius: 8,
    padding: 4
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: 14
  }
}))

export const Deployment: React.FC = () => {
  return (
    <>
      <Grid container direction="row" justifyContent="center">
        <Title color="textSecondary">Do you already have a governance token?</Title>
      </Grid>

      <Grid container direction="column" justifyContent="center">
        <DescriptionContainer item>
          <DescriptionText>
            This would be an FA2-compatible token contract that will serve to assign voting weight based on ownership.
          </DescriptionText>
        </DescriptionContainer>

        <OptionsContainer item>
          <DescriptionText>
            If you already have this asset deployed, click YES. If not, click NO and we will configure and deploy one
            now.
          </DescriptionText>
        </OptionsContainer>
      </Grid>

      <ChoicesContainer container direction="row" alignContent="center" justifyContent="center">
        <Grid item xs>
          <Link underline="none" href={`/creator/build`}>
            <OptionText align="center" color="textSecondary">
              Yes, I have one
            </OptionText>
          </Link>
        </Grid>
        <Grid item xs>
          <Link underline="none" href={`/creator/token-config`}>
            <OptionText align="center" color="textSecondary">
              No, I need one
            </OptionText>
          </Link>
        </Grid>
      </ChoicesContainer>
    </>
  )
}
