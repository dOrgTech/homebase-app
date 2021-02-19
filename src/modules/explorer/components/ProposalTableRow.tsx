import React from "react";
import {
  styled,
  Grid,
  Box,
  Typography,
  IconButton,
  Link,
} from "@material-ui/core";
import dayjs from "dayjs";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { useHistory } from "react-router-dom";
import ProgressBar from "react-customizable-progressbar";

import { ProposalWithStatus } from "services/bakingBad/proposals/types";
import { toShortAddress } from "services/contracts/utils";

const progressColorMap = {
  success: "#81FEB7",
  warning: "#DBDE39",
  danger: "#DE3939",
};

const ProposalTableRowContainer = styled(Grid)({
  height: 155,
  borderBottom: "2px solid #3D3D3D",
  cursor: "pointer",
});

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
    paddingLeft: 20,
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

const ArrowButton = styled(IconButton)({
  color: "#3D3D3D",
});

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
  const color = support ? "success" : "danger";
  const formattedDate = dayjs(date).format("MM/DD/YYYY");

  return (
    <ProposalTableRowContainer
      item
      container
      alignItems="center"
      onClick={() => history.push(`/explorer/dao/${daoId}/proposal/${id}`)}
    >
      <Grid item xs={5}>
        <Box>
          <Typography variant="body1" color="textSecondary">
            {toShortAddress(title)}
          </Typography>
        </Box>
        <Box>
          <Link href={`https://forum.tezosagora.org/t/${number}`}>
            <Typography variant="body1" color="textSecondary">
              #{number} • {formattedDate}
            </Typography>
          </Link>
        </Box>
      </Grid>
      <Grid item xs={2}>
        <Typography variant="body1" color="textSecondary">
          {cycle || "-"}
        </Typography>
      </Grid>
      <Grid item xs={5} container justify="space-between" alignItems="center">
        <Grid item>
          <Grid container alignItems="center">
            <Grid item>
              <ProgressBar
                progress={value}
                radius={32}
                strokeWidth={4}
                strokeColor={progressColorMap[color]}
                trackStrokeWidth={2}
                trackStrokeColor={"#3d3d3d"}
              >
                <div className="indicator">
                  <ProgressText textColor={progressColorMap[color]}>
                    {value}%
                  </ProgressText>
                </div>
              </ProgressBar>
            </Grid>
            <Grid item>
              <SupportText textColor={progressColorMap[color]}>
                {color === "danger" ? "OPPOSE" : "SUPPORT"}
              </SupportText>
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
