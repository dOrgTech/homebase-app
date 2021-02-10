import React, { useMemo } from "react";
import {
  styled,
  Grid,
  Box,
  Typography,
  IconButton,
  Link,
} from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { useHistory } from "react-router-dom";
import ProgressBar from "react-customizable-progressbar";
import dayjs from "dayjs";
import { toShortAddress } from "../../../utils";
import {
  Proposal,
  ProposalWithStatus,
} from "../../../services/bakingBad/proposals/types";

type ProgressColor = "success" | "warning" | "danger";

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
    paddingLeft: 20,
    color: textColor,
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    position: "absolute",
    top: 0,
    width: "100%",
    height: "100%",
    margin: "0px 20px",
    fontSize: 16,
    userSelect: "none",
    boxShadow: "none",
    background: "inherit",
    fontFamily: "Roboto Mono",
  })
);

const ArrowButton = styled(IconButton)({
  color: "#3D3D3D",
});

export const mapProposalData = (
  proposalData: ProposalWithStatus,
  daoId?: string
): ProposalTableRowData => {
  const votes =
    proposalData.upVotes >= proposalData.downVotes
      ? {
          value: Number(proposalData.upVotes),
          support: true,
        }
      : {
          value: Number(proposalData.downVotes),
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

export const TopHoldersTableRow: React.FC<ProposalTableRowData> = ({
  title,
  number,
  date,
  votes: { value, support },
  cycle,
  daoId,
  id
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
          <Link href={`https://forum.tezosagora.org/t/${number}`}>
            <Typography variant="body1" color="textSecondary">
              {toShortAddress(title)}
            </Typography>
          </Link>
        </Box>
        <Box>
          <Typography variant="body1" color="textSecondary">
            #{number} • {formattedDate}
          </Typography>
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
