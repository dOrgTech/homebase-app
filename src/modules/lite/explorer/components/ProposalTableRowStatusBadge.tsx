import React from "react"
import { Grid, GridProps, Typography } from "@material-ui/core"
import { styled, Theme } from "@material-ui/core/styles"
import hexToRgba from "hex-to-rgba"
import { theme } from "theme"

export enum ProposalStatus {
  ACTIVE = "active",
  CLOSED = "closed"
}

const getStatusColor = (status: ProposalStatus, theme: Theme): string => {
  const statusToColor = {
    [ProposalStatus.ACTIVE]: theme.palette.secondary.main,
    [ProposalStatus.CLOSED]: "#7e496f"
  }

  return statusToColor[status]
}

const Badge = styled(Grid)(({ status, theme }: { status: ProposalStatus; theme: Theme }) => ({
  "borderRadius": 4,
  "boxSizing": "border-box",
  "minWidth": 87,
  "textAlign": "center",
  "padding": "2px 16px",

  "background": hexToRgba(getStatusColor(status, theme), 0.4),
  "color": getStatusColor(status, theme),
  "& > div": {
    height: "100%"
  }
}))

const Text = styled(Typography)({
  fontWeight: 500,
  fontSize: 16
})

export const TableStatusBadge: React.FC<{ status: ProposalStatus } & GridProps> = ({ status }) => (
  <Badge status={status} theme={theme}>
    <Grid container alignItems="center" justifyContent="center">
      <Grid item>
        <Text> {status.toUpperCase()} </Text>
      </Grid>
    </Grid>
  </Badge>
)
