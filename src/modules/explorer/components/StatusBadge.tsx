import React from "react"
import { styled, Grid, Theme, Typography, GridProps } from "@material-ui/core"
import { ProposalStatus } from "services/indexer/dao/mappers/proposal/types"
import hexToRgba from "hex-to-rgba"

const statusColors = (status: ProposalStatus) => {
  switch (status) {
    case ProposalStatus.ACTIVE:
      return {
        background: hexToRgba("#0085FF", 0.2),
        color: "#0085FF",
        text: "ACTIVE"
      }
    case ProposalStatus.PENDING:
      return {
        background: hexToRgba("#FFC839", 0.2),
        color: "#FFC839",
        text: "PENDING"
      }
    case ProposalStatus.PASSED:
      return {
        background: hexToRgba("#4AFF98", 0.2),
        color: "#4AFF98",
        text: "PASSED"
      }
    case ProposalStatus.EXECUTABLE:
      return {
        background: hexToRgba("#5AFFE1", 0.2),
        color: "#5AFFE1",
        text: "EXECUTABLE"
      }
    case ProposalStatus.REJECTED:
      return {
        background: hexToRgba("#FF5A64", 0.2),
        color: "#FF5A64",
        text: "REJECTED"
      }
    case ProposalStatus.EXPIRED:
      return {
        background: hexToRgba("#9A40A9", 0.2),
        color: "#9A40A9",
        text: "EXPIRED"
      }
    case ProposalStatus.DROPPED:
      return {
        background: hexToRgba("#B93D3D", 0.2),
        color: "#B93D3D",
        text: "DROPPED"
      }
    case ProposalStatus.NO_QUORUM:
      return {
        background: hexToRgba("#8A8A8A", 0.2),
        color: "#8A8A8A",
        text: "NO QUORUM"
      }
    case ProposalStatus.EXECUTED:
      return {
        background: hexToRgba("#2BFFB2", 0.2),
        color: "#2BFFB2",
        text: "EXECUTED"
      }
  }
}

const Badge = styled(Grid)(({ status }: { status: ProposalStatus; theme: Theme }) => ({
  borderRadius: 50,
  alignItems: "center",
  padding: "2px 13px",
  background: statusColors(status).background,
  color: statusColors(status).color,
  whiteSpace: "nowrap"
}))

export const StatusBadge: React.FC<{ status: ProposalStatus } & GridProps> = ({ status, ...props }) => (
  <Badge status={status} {...props}>
    <Typography style={{ fontSize: 16, fontWeight: 500 }} color="inherit">
      {statusColors(status).text}
    </Typography>
  </Badge>
)
