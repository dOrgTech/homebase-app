import React, { useCallback } from "react";
import {
  styled,
  Grid,
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import dayjs from "dayjs";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { useHistory } from "react-router-dom";
import ProgressBar from "react-customizable-progressbar";

import { ProposalWithStatus } from "services/bakingBad/proposals/types";
import { toShortAddress } from "services/contracts/utils";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import { useVotesStats } from "../hooks/useVotesStats";
import { RowContainer } from "./tables/RowContainer";

export interface ProposalTableRowData {
  cycle: number;
  upVotes: number;
  downVotes: number;
  quorumTreshold: number;
  daoId?: string;
  id: string;
}

const ArrowContainer = styled(Grid)(({ theme }) => ({
  display: "block",
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

const SupportText = styled(Typography)(
  ({ textColor }: { textColor: string }) => ({
    paddingLeft: 2,
    paddingRight: 18,
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

const CycleText = styled(Typography)({
  padding: "20px 0",
});

const ArrowButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.light,
}));

export const ProposalTableRow: React.FC<
  ProposalWithStatus & { quorumTreshold: number; daoId: string | undefined }
> = ({ quorumTreshold, cycle, upVotes, downVotes, daoId, id, startDate }) => {
  const history = useHistory();
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const formattedDate = dayjs(startDate).format("MM/DD/YYYY");
  const { data: dao } = useDAO(daoId);
  const onClick = useCallback(() => {
    if (dao) {
      history.push(`/explorer/dao/${daoId}/proposal/${dao.template}/${id}`);
    }
  }, [dao, daoId, history, id]);

  const { support, votesQuorumPercentage, votesSumPercentage } = useVotesStats({
    upVotes,
    downVotes,
    quorumTreshold,
  });
  const color = support
    ? theme.palette.secondary.main
    : theme.palette.error.main;

  return (
    <RowContainer item container alignItems="center" onClick={onClick}>
      <Grid item xs={12} md={3}>
        <Box>
          <Typography
            variant="body1"
            color="textSecondary"
            align={isMobileSmall ? "center" : "left"}
          >
            Proposal Title
          </Typography>
        </Box>
        <Box>
          <Typography
            variant="body1"
            color="textSecondary"
            align={isMobileSmall ? "center" : "left"}
          >
            {toShortAddress(id)} • {formattedDate}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={2}>
        <CycleText variant="body1" color="textSecondary" align="center">
          {isMobileSmall ? (
            <Typography style={{ fontWeight: "bold" }}>Cycle</Typography>
          ) : null}
          {Number.isInteger(cycle) ? cycle : "-"}
        </CycleText>
      </Grid>

      <Grid
        item
        container
        alignItems="baseline"
        xs={12}
        md={6}
        justify="center"
      >
        <Grid item container alignItems="center" xs md={8} justify="flex-end">
          <Grid item>
            <ProgressBar
              progress={votesSumPercentage}
              radius={32}
              strokeWidth={4}
              strokeColor={color}
              trackStrokeWidth={2}
              trackStrokeColor={theme.palette.primary.light}
            >
              <div className="indicator">
                <ProgressText textColor={color}>
                  {Number(votesSumPercentage.toFixed(1))}%
                </ProgressText>
              </div>
            </ProgressBar>
          </Grid>
          <Grid item xs={12} md={3}>
            <SupportText
              textColor={color}
              align={isMobileSmall ? "right" : "left"}
            >
              {support ? "SUPPORT" : "OPPOSE"}
            </SupportText>
          </Grid>
        </Grid>

        <Grid item container alignItems="center" xs md={4} justify="flex-start">
          <Grid item>
            <ProgressBar
              progress={votesQuorumPercentage}
              radius={32}
              strokeWidth={4}
              strokeColor="#3866F9"
              trackStrokeWidth={2}
              trackStrokeColor={theme.palette.primary.light}
            >
              <div className="indicator">
                <ProgressText textColor="#3866F9">
                  {Number(votesQuorumPercentage.toFixed(1))}%
                </ProgressText>
              </div>
            </ProgressBar>
          </Grid>
          {isMobileSmall && (
            <Grid item xs={12} md={3}>
              <SupportText textColor={"#3866F9"}>TRESHOLD %</SupportText>
            </Grid>
          )}
        </Grid>
      </Grid>
      <ArrowContainer item md={1}>
        <ArrowButton>
          <ArrowForwardIcon fontSize={"large"} color="inherit" />
        </ArrowButton>
      </ArrowContainer>
    </RowContainer>
  );
};
