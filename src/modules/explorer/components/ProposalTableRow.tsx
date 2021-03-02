import React, { useCallback } from "react";
import {
  styled,
  Grid,
  Box,
  Typography,
  IconButton,
  useTheme,
} from "@material-ui/core";
import dayjs from "dayjs";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { useHistory } from "react-router-dom";
import ProgressBar from "react-customizable-progressbar";

import { ProposalWithStatus } from "services/bakingBad/proposals/types";
import { toShortAddress } from "services/contracts/utils";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";

const ProposalTableRowContainer = styled(Grid)(({ theme }) => ({
  height: 155,
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  cursor: "pointer",
}));

export interface ProposalTableRowData {
  title: string;
  number: number;
  date: string;
  cycle: number;
  votes: {
    value: number;
    support: boolean;
  };
  daoId?: string;
  id: string;
}

const SupportText = styled(Typography)(
  ({ textColor }: { textColor: string }) => ({
    paddingLeft: 2,
    color: textColor,
  })
);

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

const ArrowButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.light,
}));

export const mapProposalData = (
  proposalData: ProposalWithStatus & { quorumTreshold: number },
  daoId?: string
): ProposalTableRowData => {
  const votes =
    proposalData.upVotes >= proposalData.downVotes
      ? {
          value: proposalData.quorumTreshold
            ? (Number(proposalData.upVotes) / proposalData.quorumTreshold) * 100
            : 0,
          support: true,
        }
      : {
          value: proposalData.quorumTreshold
            ? (Number(proposalData.downVotes) / proposalData.quorumTreshold) *
              100
            : 0,
          support: false,
        };
  return {
    title: proposalData.id,
    number: Number(proposalData.agoraPostId),
    date: proposalData.startDate,
    votes,
    cycle: proposalData.cycle,
    daoId,
    id: proposalData.id,
  };
};

export const ProposalTableRow: React.FC<ProposalTableRowData> = ({
  title,
  number,
  date,
  votes: { value, support },
  cycle,
  daoId,
  id,
}) => {
  const history = useHistory();
  const theme = useTheme();
  const color = support
    ? theme.palette.secondary.main
    : theme.palette.error.main;
  const formattedDate = dayjs(date).format("MM/DD/YYYY");
  const { data: dao } = useDAO(daoId);
  const onClick = useCallback(() => {
    if (dao) {
      history.push(`/explorer/dao/${daoId}/proposal/${dao.template}/${id}`);
    }
  }, [dao, daoId, history, id]);

  return (
    <ProposalTableRowContainer
      item
      container
      alignItems="center"
      onClick={onClick}
    >
      <Grid item xs={4}>
        <Box>
          <Typography variant="body1" color="textSecondary">
            {toShortAddress(title)}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body1" color="textSecondary">
            #{number} • {formattedDate}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={2}>
        <Typography variant="body1" color="textSecondary" align="center">
          {cycle || "-"}
        </Typography>
      </Grid>
      <Grid item xs={3} container justify="space-between" alignItems="center">
        <Grid item>
          <Grid container alignItems="center">
            <Grid item>
              <ProgressBar
                progress={value}
                radius={32}
                strokeWidth={4}
                strokeColor={color}
                trackStrokeWidth={2}
                trackStrokeColor={theme.palette.primary.light}
              >
                <div className="indicator">
                  <ProgressText textColor={color}>{value}%</ProgressText>
                </div>
              </ProgressBar>
            </Grid>
            <Grid item>
              <SupportText textColor={color}>
                {color === "danger" ? "OPPOSE" : "SUPPORT"}
              </SupportText>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={3} container justify="space-between" alignItems="center">
        <Grid item>
          <Grid container alignItems="center">
            <Grid item>
              <ProgressBar
                progress={value}
                radius={32}
                strokeWidth={4}
                strokeColor="#3866F9"
                trackStrokeWidth={2}
                trackStrokeColor={theme.palette.primary.light}
              >
                <div className="indicator">
                  <ProgressText textColor="#3866F9">{value}%</ProgressText>
                </div>
              </ProgressBar>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <ArrowButton>
            <ArrowForwardIcon fontSize={"large"} color="inherit" />
          </ArrowButton>
        </Grid>
      </Grid>
    </ProposalTableRowContainer>
  );
};
