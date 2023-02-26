import React, { useContext } from "react"
import { Grid, styled, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import { useHistory } from "react-router-dom"
import { toShortAddress } from "services/contracts/utils"
import { DeploymentContext } from "../state/context"
import { numberWithCommas } from "../state/utils"
import BigNumber from "bignumber.js"
import { Blockie } from "modules/common/Blockie"
import { CopyButton } from "modules/common/CopyButton"
import { SmallButton } from "modules/common/SmallButton"
import { ActionTypes } from "../state/types"

const FormContainer = styled(Grid)(({ theme }) => ({
  paddingLeft: "20%",
  paddingRight: "20%",
  [theme.breakpoints.down("sm")]: {
    paddingLeft: "2%",
    paddingRight: "2%"
  }
}))

const Title = styled(Typography)({
  fontSize: 24
})

const Subtitle = styled(Typography)({
  color: "gray",
  fontWeight: 200,
  marginBottom: 20
})

const ThirdContainer = styled(Grid)({
  marginTop: 22,
  background: "#2F3438",
  borderRadius: 8,
  boxSizing: "border-box"
})

const ThirdContainerFirstRow = styled(Grid)({
  padding: "19px 48px",
  borderBottom: "0.3px solid #7D8C8B",
  alignItems: "center",
  display: "flex",
  minHeight: 70,
  ["@media (max-width:1167px)"]: {
    padding: "12px 15px",
    maxHeight: "inherit"
  }
})

const ThirdContainerLastRow = styled(Grid)({
  padding: "19px 48px",
  alignItems: "center",
  display: "flex",
  minHeight: 70,
  ["@media (max-width:1167px)"]: {
    padding: "12px 15px",
    maxHeight: "inherit"
  }
})

const ThirdContainerRow = styled(Grid)({
  "borderBottom": "0.3px solid #7D8C8B",
  "padding": "24px 48px",
  "minHeight": 70,
  ["@media (max-width:1167px)"]: {
    padding: "12px 15px",
    maxHeight: "inherit"
  },
  "&:last-child": {
    borderBottom: "none"
  }
})

const TitleSpacing = styled(Typography)({
  marginTop: 8,
  fontWeight: 200
})

const ContainerEdit = styled(Typography)({
  cursor: "pointer"
})

const AdminAddress = styled(Typography)({
  wordBreak: "break-all"
})

const KeyText = styled(Typography)({
  fontWeight: 300
})

const AddressText = styled(Typography)({
  marginLeft: 12,
  fontWeight: 300
})

export const ContractSummary: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const history = useHistory()

  const { state, dispatch } = useContext(DeploymentContext)
  const { tokenDistribution, tokenSettings } = state.data

  const goToSettings = () => {
    history.push(`token-config`)
  }

  const goToDistribution = () => {
    history.push(`token-distribution`)
  }

  const submitForm = () => {
    console.log("deploy token")
    history.push("/creator/build")
    dispatch({ type: ActionTypes.CLEAR_CACHE })
  }

  return (
    <>
      <FormContainer container direction="column">
        <Grid item container direction="column">
          <Title color="textSecondary">Review information</Title>
          <Subtitle>and make sure you&apos;ve set up your token right.</Subtitle>
        </Grid>

        <ThirdContainer container direction="row">
          <ThirdContainerFirstRow item xs={12}>
            <Grid
              container
              direction={isMobile ? "column" : "row"}
              alignItems={isMobile ? "baseline" : "center"}
              justifyContent="space-between"
            >
              <TitleSpacing color="textSecondary" variant="subtitle1">
                TOKEN CONTRACT SETTINGS
              </TitleSpacing>
              <ContainerEdit color="secondary" onClick={goToSettings}>
                Edit
              </ContainerEdit>
            </Grid>
          </ThirdContainerFirstRow>

          <ThirdContainerRow item xs={12}>
            <Grid container direction="row" alignItems="center">
              <Grid item xs={5}>
                <KeyText variant="subtitle2" color="textSecondary">
                  Name
                </KeyText>
              </Grid>
              <Grid item xs={7}>
                <AdminAddress variant="subtitle2" color="textSecondary" align="right">
                  {tokenSettings.name}
                </AdminAddress>
              </Grid>
            </Grid>
          </ThirdContainerRow>

          <ThirdContainerRow item xs={12}>
            <Grid container direction="row" alignItems="center">
              <Grid item xs={5}>
                <KeyText variant="subtitle2" color="textSecondary">
                  Description
                </KeyText>
              </Grid>
              <Grid item xs={7}>
                <AdminAddress variant="subtitle2" color="textSecondary" align="right">
                  {tokenSettings.description}
                </AdminAddress>
              </Grid>
            </Grid>
          </ThirdContainerRow>

          <ThirdContainerRow item xs={12}>
            <Grid item container direction="row" alignItems="center">
              <Grid item xs={5}>
                <KeyText variant="subtitle2" color="textSecondary">
                  Symbol
                </KeyText>
              </Grid>
              <Grid item xs={7}>
                <AdminAddress variant="subtitle2" color="textSecondary" align="right">
                  {tokenSettings.symbol}
                </AdminAddress>
              </Grid>
            </Grid>
          </ThirdContainerRow>

          <ThirdContainerRow item xs={12}>
            <Grid item container direction="row" alignItems="center">
              <Grid item xs={5}>
                <KeyText variant="subtitle2" color="textSecondary">
                  Supply
                </KeyText>
              </Grid>
              <Grid item xs={7}>
                <AdminAddress variant="subtitle2" color="textSecondary" align="right">
                  {numberWithCommas(new BigNumber(Number(tokenSettings.totalSupply)))}
                </AdminAddress>
              </Grid>
            </Grid>
          </ThirdContainerRow>

          <ThirdContainerLastRow item xs={12}>
            <Grid item container direction="row" alignItems="center">
              <Grid item xs={5}>
                <KeyText variant="subtitle2" color="textSecondary">
                  Icon
                </KeyText>
              </Grid>
              <Grid item xs={7}>
                <AdminAddress variant="subtitle2" color="textSecondary" align="right">
                  {tokenSettings.icon}
                </AdminAddress>
              </Grid>
            </Grid>
          </ThirdContainerLastRow>
        </ThirdContainer>

        <ThirdContainer container direction="row">
          <ThirdContainerFirstRow item xs={12}>
            <Grid
              container
              direction={isMobile ? "column" : "row"}
              alignItems={isMobile ? "baseline" : "center"}
              justifyContent="space-between"
            >
              <TitleSpacing color="textSecondary" variant="subtitle1">
                INITIAL DISTRIBUTION
              </TitleSpacing>
              <ContainerEdit color="secondary" onClick={goToDistribution}>
                Edit
              </ContainerEdit>
            </Grid>
          </ThirdContainerFirstRow>

          {tokenDistribution.holders && tokenDistribution.holders.length > 0
            ? tokenDistribution.holders.map((holder, index) => {
                return (
                  <ThirdContainerRow key={"holder-" + index} item xs={12}>
                    <Grid container direction="row" alignItems="center">
                      <Grid item xs={isMobile ? 12 : 5} container direction="row">
                        <Blockie address={holder.walletAddress} size={24} />
                        <AddressText variant="subtitle2" color="textSecondary">
                          {toShortAddress(holder.walletAddress)}
                        </AddressText>
                        <CopyButton style={{ fontSize: 16 }} text={holder.walletAddress} />
                      </Grid>
                      <Grid item xs={isMobile ? 12 : 7}>
                        <AdminAddress
                          variant="subtitle2"
                          style={isMobile ? { marginTop: 10 } : {}}
                          color="textSecondary"
                          align={isMobile ? "left" : "right"}
                        >
                          {numberWithCommas(new BigNumber(Number(holder.amount)))}
                        </AdminAddress>
                      </Grid>
                    </Grid>
                  </ThirdContainerRow>
                )
              })
            : null}
        </ThirdContainer>

        <Grid container direction="row" justifyContent="flex-end" style={{ marginTop: 40 }}>
          <SmallButton color="secondary" variant="contained" style={{ fontSize: "14px" }} onClick={submitForm}>
            Submit
          </SmallButton>
        </Grid>
      </FormContainer>
    </>
  )
}
