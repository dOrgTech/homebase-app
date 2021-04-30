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
    case ProposalStatus.CREATED:
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
    case ProposalStatus.DROPPED:
      return {
        background: "rgb(61, 61, 61)",
        color: theme.palette.text.secondary,
        opacity: 0.4
      };
    case ProposalStatus.EXECUTED:
      return {
        background: "rgb(61, 61, 61)",
        color: theme.palette.text.secondary,
        opacity: 0.4
      };
  }
};

const Badge = styled(Grid)(
  ({
    status,
    theme,
  }: {
    status: ProposalStatus;
    theme: Theme;
  }) => ({
    borderRadius: 4,
    padding: 4,
    textAlign: "center",
    maxWidth: 87,
    marginRight: 32,
    marginLeft: 10,

    background: statusColors(status, theme).background,
    color: statusColors(status, theme).color,
    opacity: statusColors(status, theme).opacity,
  })
);

export const TableStatusBadge: React.FC<
  { status: ProposalStatus } & GridProps
> = ({ status, ...props }) => (
  <Badge status={status} {...props}>
    <Typography> {status.toUpperCase()} </Typography>
  </Badge>
);
