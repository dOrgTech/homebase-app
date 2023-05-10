import React from "react"
import { styled, Grid, Theme, Typography, GridProps } from "@material-ui/core"
import { ProposalStatus } from "services/indexer/dao/mappers/proposal/types"

const statusColors = (status: ProposalStatus) => {
  switch (status) {
    case ProposalStatus.ACTIVE:
      return {
        background: "#77632E",
        color: "#DBDE39",
        text: "Active"
      }
    case ProposalStatus.PENDING:
      return {
        background: "#273379",
        color: "#3866F9",
        text: "Pending"
      }
    case ProposalStatus.PASSED:
      return {
        background: "#1A5D35",
        color: "#3DB84E",
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
        background: "#63191B",
        color: "#CC0F0F",
        text: "Rejected"
      }
    case ProposalStatus.EXPIRED:
      return {
        background: "#443042",
        color: "#7E496F",
        text: "Expired"
      }
    case ProposalStatus.DROPPED:
      return {
        background: "#482E30",
        color: "#894343",
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
  }
}

const Badge = styled(Grid)(({ status }: { status: ProposalStatus; theme: Theme }) => ({
  borderRadius: 50,
  textAlign: "center",
  minHeight: 24,
  minWidth: 105,
  padding: "2px 8px",
  background: statusColors(status).background,
  color: statusColors(status).color,
  whiteSpace: "nowrap"
}))

export const StatusBadge: React.FC<{ status: ProposalStatus } & GridProps> = ({ status, ...props }) => (
  <Badge status={status} {...props}>
    <Typography color="inherit"> {statusColors(status).text} </Typography>
  </Badge>
)
