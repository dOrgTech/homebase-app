import { Grid, styled, Typography, useTheme } from "@material-ui/core";
import ProgressBar from "react-customizable-progressbar";
import React, { useMemo } from "react";
import { StatusBadge } from "./StatusBadge";
import { UserBadge } from "./UserBadge";
import { useParams } from "react-router-dom";
import { useProposal } from "services/contracts/baseDAO/hooks/useProposal";
import dayjs from "dayjs";
import { ProposalStatus } from "services/bakingBad/proposals/types";

const HistoryContent = styled(Grid)({
  paddingBottom: 24,
  paddingLeft: 53,
});

const HistoryItem = styled(Grid)({
  paddingLeft: 63,
  marginTop: 20,
  paddingBottom: 12,
  display: "flex",
  height: "auto",
});

const ProgressText = styled(Typography)(
  ({ textColor }: { textColor: string }) => ({
    color: textColor,
    display: "flex",
    alignItems: "center",
    position: "absolute",
    width: "100%",
    height: "100%",
    fontSize: 16,
    userSelect: "none",
    boxShadow: "none",
    background: "inherit",
    fontFamily: "Roboto Mono",
    justifyContent: "center",
    top: 0,
  })
);

export const ProposalStatusHistory: React.FC = () => {
  const theme = useTheme();

  const { proposalId, id: daoId } = useParams<{
    proposalId: string;
    id: string;
  }>();

  const { data: proposal } = useProposal(daoId, proposalId);

  const history = useMemo(() => {
    if (!proposal) {
      return [];
    }
    const baseStatuses: {
      date: string;
      status: ProposalStatus | "created";
    }[] = [
      {
        date: dayjs(proposal.startDate).format("LLL"),
        status: "created",
      },
      {
        date: dayjs(proposal.startDate).format("LLL"),
        status: ProposalStatus.ACTIVE,
      },
    ];

    switch (proposal.status) {
      case ProposalStatus.DROPPED:
        baseStatuses.push({
          date: "",
          status: ProposalStatus.DROPPED,
        });
        break;
      case ProposalStatus.REJECTED:
        baseStatuses.push({
          date: "",
          status: ProposalStatus.REJECTED,
        });
        break;
      case ProposalStatus.PASSED:
        baseStatuses.push({
          date: "",
          status: ProposalStatus.PASSED,
        });
        break;
    }

    return baseStatuses;
  }, [proposal]);

  return (
    <Grid item xs={12} sm={6}>
      <Grid container direction="row">
        <HistoryContent item xs={12}>
          <Typography variant="subtitle1" color="textSecondary">
            QUORUM THRESHOLD %
          </Typography>
        </HistoryContent>
        <HistoryContent item xs={12}>
          <ProgressBar
            progress={90}
            radius={50}
            strokeWidth={7}
            strokeColor="#3866F9"
            trackStrokeWidth={4}
            trackStrokeColor={theme.palette.primary.light}
          >
            <div className="indicator">
              <ProgressText textColor="#3866F9">{90}%</ProgressText>
            </div>
          </ProgressBar>
        </HistoryContent>
      </Grid>
      <Grid container direction="row">
        <HistoryContent item xs={12}>
          <Typography variant="subtitle1" color="textSecondary">
            CREATED BY
          </Typography>
        </HistoryContent>
        {proposal && (
          <HistoryContent item xs={12}>
            <UserBadge address={proposal.proposer} />
          </HistoryContent>
        )}
        <HistoryContent item xs={12}>
          <Typography variant="subtitle1" color="textSecondary">
            HISTORY
          </Typography>
        </HistoryContent>
        {history.map((item, index) => {
          return (
            <HistoryItem
              container
              direction="row"
              key={index}
              justify="space-between"
            >
              <StatusBadge item lg={2} md={6} sm={6} status={item.status} />
              <Grid item lg={9} md={12} sm={12}>
                <Typography color="textSecondary">{item.date}</Typography>
              </Grid>
            </HistoryItem>
          );
        })}
      </Grid>
    </Grid>
  );
};
