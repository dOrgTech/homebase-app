import React from "react"
import { Grid, GridProps, Typography } from "@material-ui/core"
import { styled, Theme } from "@material-ui/core/styles"
import hexToRgba from "hex-to-rgba"
import { theme } from "theme"

const getStatusColor = (status: string, theme: Theme): string => {
  return "#85c4ff"
}

const StyledGrid = styled(Grid)(({ status, theme }: { status: string; theme: Theme }) => ({
  "borderRadius": 50,
  "boxSizing": "border-box",
  "minWidth": 87,
  "textAlign": "center",
  "padding": "4px 16px",

  "background": hexToRgba(getStatusColor(status, theme), 0.4),
  "color": getStatusColor(status, theme),
  "& > div": {
    height: "100%"
  }
}))

const Text = styled(Typography)({
  fontWeight: 500,
  fontSize: 16,
  textTransform: "capitalize"
})

export const Badge: React.FC<{ status: string } & GridProps> = ({ status }) => (
  <StyledGrid theme={theme} status={status}>
    <Grid container alignItems="center" justifyContent="center">
      <Grid item>
        <Text> {status} </Text>
      </Grid>
    </Grid>
  </StyledGrid>
)
