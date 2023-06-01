import React from "react"
import { styled, Grid, Theme, Typography, GridProps } from "@material-ui/core"
import { ProposalStatus } from "services/services/dao/mappers/proposal/types"

const statusColors = (status: ProposalStatus | "all") => {
  switch (status) {
    case ProposalStatus.ACTIVE:
      return {
        background: "#0085ff33",
        color: "#0085FF",
        text: "Active"
      }
    case ProposalStatus.PENDING:
      return {
        background: "#ffc83933",
        color: "#ffc839",
        text: "Pending"
      }
    case ProposalStatus.PASSED:
      return {
        background: "#4aff9833",
        color: "#4aff98",
        text: "Passed"
      }
    case ProposalStatus.EXECUTABLE:
      return {
        background: "#35796F",
        color: "#5AFFE1",
        text: "Passed - Executable"
      }
    case ProposalStatus.REJECTED:
      return {
        background: "#ff5a6433",
        color: "#ff5a64",
        text: "Rejected"
      }
    case ProposalStatus.EXPIRED:
      return {
        background: "#9a40a933",
        color: "#9a40a9",
        text: "Expired"
      }
    case ProposalStatus.DROPPED:
      return {
        background: "#b93d3d33",
        color: "#b93d3d",
        text: "Dropped"
      }
    case ProposalStatus.NO_QUORUM:
      return {
        background: "#484A4C",
        color: "#8A8A8A",
        text: "No Quorum"
      }
    case ProposalStatus.EXECUTED:
      return {
        background: "#2F7952",
        color: "#58FF98",
        text: "Passed - Executed"
      }
    case "all":
      return {
        background: "#81feb733",
        color: "#81feb7",
        text: "All"
      }
  }
}

export const Badge = styled(Grid)(({ status }: { status: ProposalStatus | "all"; theme: Theme }) => ({
  borderRadius: 50,
  textAlign: "center",
  minHeight: 24,
  minWidth: 105,
  padding: "2px 8px",
  background: statusColors(status).background,
  color: statusColors(status).color,
  whiteSpace: "nowrap",
  fontWeight: 300
}))

export const StatusBadge: React.FC<{ status: ProposalStatus | "all" } & GridProps> = ({ status, ...props }) => (
  <Badge status={status} {...props}>
    <Typography color="inherit"> {statusColors(status).text} </Typography>
  </Badge>
)
