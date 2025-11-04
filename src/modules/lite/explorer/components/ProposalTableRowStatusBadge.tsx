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
    [ProposalStatus.ACTIVE]: "#85c4ff",
    [ProposalStatus.CLOSED]: "#cc8aff"
  }

  return statusToColor[status]
}

const Badge = styled(({ status, ...other }: any) => <Grid {...other} />)(
  ({ status, theme }: { status: ProposalStatus; theme: Theme }) => ({
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
  })
)

const Text = styled(Typography)({
  fontWeight: 500,
  fontSize: 16,
  textTransform: "capitalize"
})

export const TableStatusBadge: React.FC<{ status: ProposalStatus } & GridProps> = ({ status }) => (
  <Badge status={status} theme={theme}>
    <Grid container alignItems="center" justifyContent="center">
      <Grid item>
        <Text> {status} </Text>
      </Grid>
    </Grid>
  </Badge>
)
