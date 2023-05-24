import React from "react"
import { styled, Grid, Theme, Typography, GridProps } from "@material-ui/core"
import { ProposalStatus } from "services/services/dao/mappers/proposal/types"
import hexToRgba from "hex-to-rgba"

const getStatusColor = (status: ProposalStatus, theme: Theme): string => {
  const statusToColor = {
    [ProposalStatus.ACTIVE]: theme.palette.warning.main,
    [ProposalStatus.PENDING]: theme.palette.info.main,
    [ProposalStatus.PASSED]: theme.palette.secondary.main,
    [ProposalStatus.EXECUTABLE]: theme.palette.warning.main,
    [ProposalStatus.REJECTED]: theme.palette.error.main,
    [ProposalStatus.NO_QUORUM]: theme.palette.text.secondary,
    [ProposalStatus.EXPIRED]: theme.palette.text.secondary,
    [ProposalStatus.DROPPED]: theme.palette.error.main,
    [ProposalStatus.EXECUTED]: theme.palette.secondary.main
  }

  return statusToColor[status]
}

const Badge = styled(Grid)(({ status, theme }: { status: ProposalStatus; theme: Theme }) => ({
  "borderRadius": 4,
  "height": 27,
  "boxSizing": "border-box",
  "width": 105,
  "textAlign": "center",
  "padding": "0 7px",

  "background": hexToRgba(getStatusColor(status, theme), 0.4),
  "color": getStatusColor(status, theme),
  "& > div": {
    height: "100%"
  }
}))

export const TableStatusBadge: React.FC<{ status: ProposalStatus } & GridProps> = ({ status, ...props }) => (
  <Badge status={status} {...props}>
    <Grid container alignItems="center" justifyContent="center">
      <Grid item>
        <Typography> {status.toUpperCase()} </Typography>
      </Grid>
    </Grid>
  </Badge>
)
