import React, { useContext, useEffect, useMemo } from "react"
import { Button, Grid, Box, styled, Typography } from "@material-ui/core"
import { useHistory } from "react-router-dom"

import Rocket from "assets/img/rocket.svg"
import { useOriginate } from "services/contracts/baseDAO/hooks/useOriginate"
import { getTokensInfo, CreatorContext, ActionTypes, MigrationParams } from "modules/creator/state"
import { MetadataCarrierParameters } from "services/contracts/metadataCarrier/types"
import { DeploymentLoader } from "../components/DeploymentLoader"
import { useCreatorRouteValidation } from "modules/creator/components/ProtectedRoute"
import { useTezos } from "services/beacon/hooks/useTezos"
import { ConnectWalletButton } from "modules/common/Toolbar"

const RocketImg = styled("img")({
  marginBottom: 46,
  height: 128
})

const CustomButton = styled(Button)({
  marginTop: 20
})

const CustomText = styled(Typography)({
  fontWeight: "bold",
  marginLeft: 12,
  marginRight: 12
})

const StyledContainer = styled(Box)({
  minHeight: 500,
  minWidth: 650,
  display: "grid",
  ["@media (max-width:1167px)"]: {
    minWidth: "auto"
  }
})

export const Review: React.FC = () => {
  const { account, connect } = useTezos()
  const validDAOData = useCreatorRouteValidation()
  const { state, dispatch } = useContext(CreatorContext)
  const info: MigrationParams = state.data
  const { frozenToken, unfrozenToken } = getTokensInfo(info)

  const metadataCarrierParams: MetadataCarrierParameters = useMemo(
    () => ({
      keyName: "metadataKey",
      metadata: {
        frozenToken,
        unfrozenToken,
        description: info.orgSettings.description,
        authors: [info.orgSettings.administrator],
        template: state.data.template
      }
    }),
    [frozenToken, info.orgSettings.administrator, info.orgSettings.description, state.data.template, unfrozenToken]
  )

  const {
    mutation: { mutate, data, error },
    states,
    activeState
  } = useOriginate(state.data.template)
  const history = useHistory()

  // TODO: Fix infinite calling here
  useEffect(() => {
    ;(async () => {
      if (!validDAOData && info && metadataCarrierParams) {
        await connect()
        mutate({
          metadataParams: metadataCarrierParams,
          params: info
        })
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (data && data.address) {
      dispatch({
        type: ActionTypes.CLEAR_CACHE
      })
    }
  }, [data, dispatch])

  return (
    <StyledContainer>
      <Grid container direction="row" justifyContent="center">
        {account ? (
          <>
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
              style={{ height: "fit-content" }}
            >
              <Grid item>
                <RocketImg src={Rocket} alt="rocket" />
              </Grid>
              <Grid item container direction="row" justifyContent="center">
                <Typography variant="h4" color="textSecondary">
                  Deploying
                </Typography>
                <CustomText color="secondary" variant="h4">
                  {" "}
                  {state.data.orgSettings.name}
                </CustomText>
                <Typography variant="h4" color="textSecondary">
                  {" "}
                  to the Tezos Network
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Box>
                  {data && data.address ? (
                    <CustomButton
                      color="secondary"
                      variant="outlined"
                      onClick={() => history.push("/explorer/dao/" + data.address)}
                    >
                      Go to my DAO
                    </CustomButton>
                  ) : null}
                </Box>
              </Grid>
            </Grid>
            <DeploymentLoader states={states} activeStep={activeState} error={error} />

            {states[0].activeText !== "" && states[2].completedText === "" && error === null ? (
              <Grid container direction="row" justifyContent="center" alignContent="center">
                <Typography color="secondary"> This may take several minutes </Typography>
              </Grid>
            ) : null}
          </>
        ) : (
          <ConnectWalletButton connect={connect} />
        )}
      </Grid>
    </StyledContainer>
  )
}
