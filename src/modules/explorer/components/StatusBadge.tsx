import React from "react";
import { styled, Grid, Theme, Typography, GridProps } from "@material-ui/core";
import { ProposalStatus } from "services/indexer/dao/mappers/proposal/types";

const statusColors = (status: ProposalStatus) => {
  switch (status) {
    case ProposalStatus.ACTIVE:
      return {
        background: "#77632E",
        color: "#DBDE39",
        text: "ACTIVE"
      };
    case ProposalStatus.PENDING:
      return {
        background: "#273379",
        color: "#3866F9",
        text: "PENDING"
      };
    case ProposalStatus.PASSED:
      return {
        background: "#1A5D35",
        color: "#3DB84E",
        text: "PASSED"
      };
    case ProposalStatus.EXECUTABLE:
      return {
        background: "#35796F",
        color: "#5AFFE1",
        text: "PASSED - EXECUTABLE"
      };
    case ProposalStatus.REJECTED:
      return {
        background: "#63191B",
        color: "#CC0F0F",
        text: "REJECTED"
      };
    case ProposalStatus.EXPIRED:
      return {
        background: "#443042",
        color: "#7E496F",
        text: "EXPIRED"
      };
    case ProposalStatus.DROPPED:
      return {
        background: "#482E30",
        color: "#894343",
        text: "DROPPED"
      };
    case ProposalStatus.NO_QUORUM:
      return {
        background: "#484A4C",
        color: "#8A8A8A",
        text: "NO QUORUM"
      };
    case ProposalStatus.EXECUTED:
      return {
        background: "#2F7952",
        color: "#58FF98",
        text: "PASSED - EXECUTED"
      };
  }
};

const Badge = styled(Grid)(
  ({ status }: { status: ProposalStatus; theme: Theme }) => ({
    borderRadius: 4,
    textAlign: "center",
    minHeight: 24,
    minWidth: 105,
    padding: "2px 5px",
    background: statusColors(status).background,
    color: statusColors(status).color,
    whiteSpace: "nowrap",
  })
);

export const StatusBadge: React.FC<{ status: ProposalStatus } & GridProps> = ({
  status,
  ...props
}) => (
  <Badge status={status} {...props}>
    <Typography color="inherit"> {statusColors(status).text} </Typography>
  </Badge>
);
