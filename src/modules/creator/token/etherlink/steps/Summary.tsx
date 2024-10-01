import React, { useContext, useEffect, useState } from "react"
import { Grid, styled, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import { useHistory, useRouteMatch } from "react-router-dom"
import { toShortAddress } from "services/contracts/utils"
import { DeploymentContext } from "../state/context"
import BigNumber from "bignumber.js"
import { Blockie } from "modules/common/Blockie"
import { ActionTypes } from "../state/types"
import { useTokenOriginate } from "services/contracts/token/hooks/useToken"
import { CopyButton } from "modules/explorer/components/CopyButton"
import { numberWithCommas } from "utils"
import {
  TitleSpacing,
  ContainerEdit,
  AdminAddress,
  AdminAddressIcon,
  KeyText,
  AddressText,
  ThirdContainer,
  ThirdContainerFirstRow,
  ThirdContainerRow,
  ThirdContainerLastRow
} from "../../ui"
export const ContractSummary: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const history = useHistory()
  const match = useRouteMatch()

  const { state, dispatch } = useContext(DeploymentContext)
  const { tokenDistribution, tokenSettings } = state.data

  const [isLoading, setIsLoading] = useState(false)

  const goToSettings = () => {
    history.push(`config`)
  }

  const goToDistribution = () => {
    history.push(`distribution`)
  }

  const {
    mutation: { mutate, data }
  } = useTokenOriginate(state.data)

  useEffect(() => {
    if (data && data.address) {
      dispatch({
        type: ActionTypes.CLEAR_CACHE
      })
      history.push("/creator/success", { address: data.address })
    } else if (data && !data.address) {
      setIsLoading(false)
    }
  }, [data, dispatch, history])

  useEffect(() => {
    dispatch({
      type: ActionTypes.UPDATE_NAVIGATION_BAR,
      back: {
        handler: () => history.push(`distribution`),
        text: "Back"
      },
      next: {
        handler: () => {
          mutate({
            ...state.data
          })
          setIsLoading(true)
        },
        text: isLoading ? "Deploying..." : "Launch"
      }
    })
  }, [dispatch, history, match.path, match.url, mutate, state.data, isLoading])

  return (
    <>
      <Grid container direction="column">
        <Grid>
          <Typography style={{ marginBottom: 16 }} variant="h5" color="textSecondary">
            Review Information
          </Typography>
          <Typography variant="subtitle1" style={{ marginBottom: 32, fontWeight: 300 }} color="textSecondary">
            {" "}
            Make sure you’ve set up your token right.{" "}
          </Typography>
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
                Token Contract Settings
              </TitleSpacing>
              <ContainerEdit onClick={goToSettings}>Edit</ContainerEdit>
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

          <ThirdContainerLastRow item xs={12}>
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
          </ThirdContainerLastRow>

          {/* <ThirdContainerLastRow item xs={12}>
            <Grid item container direction="row" alignItems="center">
              <Grid item xs={5}>
                <KeyText variant="subtitle2" color="textSecondary">
                  Icon
                </KeyText>
              </Grid>
              <Grid item xs={7} container direction="row" alignItems="center" justifyContent="flex-end">
                <AdminAddressIcon variant="subtitle2" color="textSecondary" align="right">
                  <img
                    style={{ borderRadius: 50, marginRight: 8 }}
                    height={30}
                    width={30}
                    src={tokenSettings.icon}
                    alt="icon"
                  />
                  {tokenSettings.icon}
                </AdminAddressIcon>
              </Grid>
            </Grid>
          </ThirdContainerLastRow> */}
        </ThirdContainer>

        <ThirdContainer container direction="row" style={{ marginTop: 22 }}>
          <ThirdContainerFirstRow item xs={12}>
            <Grid
              container
              direction={isMobile ? "column" : "row"}
              alignItems={isMobile ? "baseline" : "center"}
              justifyContent="space-between"
            >
              <TitleSpacing color="textSecondary" variant="subtitle1">
                Initial Distribution
              </TitleSpacing>
              <ContainerEdit onClick={goToDistribution}>Edit</ContainerEdit>
            </Grid>
          </ThirdContainerFirstRow>

          {tokenDistribution.holders && tokenDistribution.holders.length > 0
            ? tokenDistribution.holders.map((holder, index) => {
                return (
                  <ThirdContainerLastRow key={"holder-" + index} item xs={12}>
                    <Grid container direction="row" alignItems="center">
                      <Grid item xs={isMobile ? 12 : 5} container direction="row">
                        <Blockie address={holder.walletAddress} size={24} />
                        <AddressText variant="subtitle2" color="textSecondary">
                          {toShortAddress(holder.walletAddress)}
                        </AddressText>
                        <CopyButton text={holder.walletAddress} />
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
                  </ThirdContainerLastRow>
                )
              })
            : null}
        </ThirdContainer>
      </Grid>
    </>
  )
}
