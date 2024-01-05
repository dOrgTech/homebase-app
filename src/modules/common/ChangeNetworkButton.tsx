import { Box, capitalize, Grid, styled, Typography, Theme } from "@material-ui/core"
import { ActionSheet, useActionSheet } from "modules/explorer/context/ActionSheets"
import React from "react"
import { useLocation } from "react-router-dom"
import { Network } from "services/beacon"
import { useTezos } from "services/beacon/hooks/useTezos"

const StyledConnectedButton = styled(Box)(({ theme }: { theme: Theme }) => ({
  "& > *": {
    height: "100%"
  },
  "background": "rgb(47, 52, 56)",
  "height": 23,
  "borderRadius": 8,
  "paddingLeft": 16,
  "paddingRight": 16,
  "paddingTop": 5,
  "paddingBottom": 6,
  "cursor": "pointer",
  "transition": ".15s ease-out",
  "color": "#fff",

  "&:hover": {
    background: theme.palette.secondary.dark,
    transition: ".15s ease-in"
  }
}))

export const networkDotColorMap: Record<Network, string> = {
  mainnet: "#9EEE5D",
  ghostnet: "#291F79"
}

export const ColorDot = styled(Box)({
  height: 6,
  width: 6,
  backgroundColor: ({ color }: { color: string }) => color,
  borderRadius: "50%"
})

export const ChangeNetworkButton = () => {
  const { network } = useTezos()
  const { open } = useActionSheet(ActionSheet.Network)

  const location = useLocation()

  const canShow =
    location.pathname.indexOf("/explorer/dao/") === -1 && location.pathname.indexOf("/explorer/lite/dao/") === -1

  return (
    <>
      {canShow ? (
        <StyledConnectedButton onClick={() => open()}>
          <Grid container style={{ gap: 8 }} alignItems="center" wrap="nowrap">
            <Grid item>
              <ColorDot color={networkDotColorMap[network]} />
            </Grid>
            <Grid item>
              <Typography style={{ fontWeight: 400 }} variant="body2">
                {capitalize(network)}
              </Typography>
            </Grid>
          </Grid>
        </StyledConnectedButton>
      ) : null}
    </>
  )
}
