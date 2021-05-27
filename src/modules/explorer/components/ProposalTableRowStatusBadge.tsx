import React from "react";
import { styled, Grid, Theme, Typography, GridProps } from "@material-ui/core";
import { ProposalStatus } from "services/bakingBad/proposals/types";

const statusColors = (status: ProposalStatus, theme: Theme) => {
  switch (status) {
    case ProposalStatus.ACTIVE:
      return {
        background: "rgba(255, 200, 57, 0.4)",
        color: "#FFC839",
      };
    case ProposalStatus.PENDING:
      return {
        background: "rgba(56, 102, 249, 0.4)",
        color: "#3866F9",
      };
    case ProposalStatus.PASSED:
      return {
        background: "rgba(75, 207, 147, 0.4)",
        color: theme.palette.secondary.main,
      };
    case ProposalStatus.REJECTED:
      return {
        background: "rgba(237, 37, 78, 0.4)",
        color: theme.palette.error.main,
      };
    case ProposalStatus.NO_QUORUM:
      return {
        background: "rgba(61, 61, 61, 0.4)",
        color: theme.palette.text.secondary,
      };
    case ProposalStatus.EXPIRED:
      return {
        background: "rgba(61, 61, 61, 0.4)",
        color: theme.palette.text.secondary,
      };
      case ProposalStatus.DROPPED:
        return {
          background: "rgba(237, 37, 78, 0.4)",
          color: theme.palette.error.main,
        };
    case ProposalStatus.EXECUTED:
      return {
        background: "rgba(75, 207, 147, 0.4)",
        color: theme.palette.secondary.main,
      };
  }
};

const Badge = styled(Grid)(
  ({ status, theme }: { status: ProposalStatus; theme: Theme }) => ({
    borderRadius: 4,
    padding: 4,
    textAlign: "center",
    maxWidth: 87,
    marginRight: 32,
    marginLeft: 10,

    background: statusColors(status, theme).background,
    color: statusColors(status, theme).color,
  })
);

export const TableStatusBadge: React.FC<
  { status: ProposalStatus } & GridProps
> = ({ status, ...props }) => (
  <Badge status={status} {...props}>
    <Typography> {status.toUpperCase()} </Typography>
  </Badge>
);
