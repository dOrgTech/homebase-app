import React from "react"
import { styled, Grid, Theme, Typography, GridProps } from "@material-ui/core"
import { ProposalStatus } from "services/services/dao/mappers/proposal/types"

export const statusColors = (status: ProposalStatus | string): { background: string; color: string; text: string } => {
  switch (status) {
    case ProposalStatus.ACTIVE:
      return {
        background: "#2A4660",
        color: "#85C4FF",
        text: "Active"
      }
    case "Active":
      return { background: "#2A4660", color: "#85C4FF", text: "Active" }
    case ProposalStatus.PENDING:
      return {
        background: "#ffc83933",
        color: "#ffc839",
        text: "Pending"
      }
    case "Pending":
      return { background: "#ffc83933", color: "#ffc839", text: "Pending" }
    case ProposalStatus.PASSED:
    case "queue_to_execute":
      return {
        background: "#4aff9833",
        color: "#4aff98",
        text: "Passed"
      }
    case "Succeeded":
      return { background: "#4aff9833", color: "#4aff98", text: "Succeeded" }
    case "queued":
      return {
        background: "#e6f3ff",
        color: "#0066cc",
        text: "Queued"
      }
    case "Queued":
      return { background: "#e6f3ff", color: "#0066cc", text: "Queued" }
    case ProposalStatus.EXECUTABLE:
      return {
        background: "#35796F",
        color: "#5AFFE1",
        text: "Executable"
      }
    case "Executable":
      return { background: "#35796F", color: "#5AFFE1", text: "Executable" }
    case ProposalStatus.REJECTED:
    case "failed":
      return {
        background: "#513438",
        color: "#FF8FA0",
        text: "Rejected"
      }
    case "Defeated":
      return { background: "#513438", color: "#FF8FA0", text: "Defeated" }
    case "Rejected":
      return { background: "#513438", color: "#FF8FA0", text: "Rejected" }
    case ProposalStatus.EXPIRED:
      return {
        background: "#9a40a933",
        color: "#9a40a9",
        text: "Expired"
      }
    case "Expired":
      return { background: "#9a40a933", color: "#9a40a9", text: "Expired" }
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
    case "NoQuorum":
      return { background: "#484A4C", color: "#8A8A8A", text: "No Quorum" }
    case ProposalStatus.EXECUTED:
      return {
        background: "#2F7952",
        color: "#58FF98",
        text: "Executed"
      }
    case "Executed":
      return { background: "#2F7952", color: "#58FF98", text: "Executed" }
    case "all":
      return {
        background: "#81feb733",
        color: "#81feb7",
        text: "All"
      }
  }
  return {
    background: "#81feb733",
    color: "#81feb7",
    text: "All"
  }
}

export const Badge = styled(Grid)(({ status }: { status: ProposalStatus | string; theme: Theme }) => ({
  "borderRadius": 50,
  "boxSizing": "border-box",
  "minWidth": 87,
  "textAlign": "center",
  "padding": "4px 16px",
  "background": statusColors(status)?.background,
  "color": statusColors(status)?.color,
  "& > div": {
    height: "100%"
  }
}))

const Text = styled(Typography)({
  fontWeight: 500,
  fontSize: 16,
  textTransform: "capitalize"
})

export const StatusBadge: React.FC<{ status: ProposalStatus | string } & GridProps> = ({ status, ...props }) => (
  <Badge status={status} {...props}>
    <Grid container alignItems="center" justifyContent="center">
      <Grid item>
        <Text> {statusColors(status)?.text} </Text>
      </Grid>
    </Grid>
  </Badge>
)
