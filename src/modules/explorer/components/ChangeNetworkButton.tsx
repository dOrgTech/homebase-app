import React from "react"
import { Box, Grid, styled, Typography, Theme } from "@material-ui/core"
import { useTezos } from "services/beacon/hooks/useTezos"
import { ActionSheet, useActionSheet } from "../context/ActionSheets"
import { useLocation } from "react-router-dom"
import { getNetworkDisplayName, networkDotColorMap } from "services/beacon"

const StyledConnectedButton = styled(Box)(({ theme }: { theme: Theme }) => ({
  "& > *": {
    height: "100%"
  },
  "background": theme.palette.primary.main,
  "borderRadius": 8,
  "paddingLeft": 16,
  "paddingRight": 16,
  "paddingTop": 5,
  "paddingBottom": 6,
  "cursor": "pointer",
  "transition": ".15s ease-out",
  "height": 23,

  "&:hover": {
    background: theme.palette.secondary.dark,
    transition: ".15s ease-in"
  }
}))

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
      <StyledConnectedButton onClick={() => open()}>
        <Grid container style={{ gap: 8 }} alignItems="center" wrap="nowrap">
          <Grid item>
            <ColorDot color={networkDotColorMap[network]} />
          </Grid>
          <Grid item>
            <Typography variant="body2" color="textPrimary">
              {getNetworkDisplayName(network)}
            </Typography>
          </Grid>
        </Grid>
      </StyledConnectedButton>
    </>
  )
}
