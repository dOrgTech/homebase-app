import React from "react";
import { styled, Grid, Theme, Typography, GridProps } from "@material-ui/core";
import { ProposalStatus } from "services/bakingBad/proposals/types";

type Status = "created" | ProposalStatus;

const statusColors = (status: Status, theme: Theme) => {
  switch (status) {
    case ProposalStatus.ACTIVE:
      return {
        background: "#DBDE39",
        color: theme.palette.primary.main,
      };
    case "created":
      return {
        background: "#3866F9",
        color: "white",
      };
    case ProposalStatus.PASSED:
      return {
        background: theme.palette.secondary.main,
        color: theme.palette.primary.main,
      };
    case ProposalStatus.REJECTED:
      return {
        background: theme.palette.error.main,
        color: "white",
      };
    case ProposalStatus.DROPPED:
      return {
        background: theme.palette.primary.light,
        color: "white",
      };
  }
};

const Badge = styled(Grid)(
  ({
    status,
    theme,
  }: {
    status: "created" | ProposalStatus;
    theme: Theme;
  }) => ({
    borderRadius: 4,
    padding: 2,
    textAlign: "center",
    minHeight: 24,
    minWidth: 105,
    marginRight: 15,

    background: statusColors(status, theme).background,
    color: statusColors(status, theme).color,
  })
);

export const StatusBadge: React.FC<
  { status: "created" | ProposalStatus } & GridProps
> = ({ status, ...props }) => (
  <Badge status={status} {...props}>
    <Typography> {status.toUpperCase()} </Typography>
  </Badge>
);
