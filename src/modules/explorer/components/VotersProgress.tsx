import React from "react";
import {
  Grid,
  Paper,
  styled,
  Typography,
  useMediaQuery,
  useTheme
} from "@material-ui/core";
import { formatNumber } from "../utils/FormatNumber";
import { UpVotesDialog } from "./VotersDialog";
import { useProposal } from "services/contracts/baseDAO/hooks/useProposal";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import { TreasuryProposalWithStatus } from "services/bakingBad/proposals/types";
import { ProgressBar as CustomBar } from "modules/explorer/components";
import { useQuorumThreshold } from "../hooks/useQuorumThreshold";

interface VotersData {
  showButton: boolean;
  daoId: string;
  proposalId: string;
}

const GreenDot = styled(Paper)(({ theme }) => ({
  width: 9,
  height: 9,
  marginRight: 9,
  background: theme.palette.secondary.main
}));

const RedDot = styled(Paper)(({ theme }) => ({
  width: 9,
  height: 9,
  marginRight: 9,
  background: theme.palette.error.main
}));

const StatusTitle = styled(Typography)({
  fontWeight: "bold",
  marginRight: 12
});

export const VotersProgress: React.FC<VotersData> = ({
  showButton,
  daoId,
  proposalId
}) => {
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const { data: proposalData } = useProposal(daoId, proposalId);
  const proposal = proposalData as TreasuryProposalWithStatus | undefined;
  const { data: dao } = useDAO(daoId);
  const quorumThreshold = useQuorumThreshold(dao);

  const upVotes = proposal ? proposal.upVotes : 0;
  const downVotes = proposal ? proposal.downVotes : 0;
  const upVotesPercentage = dao && (upVotes * 100) / quorumThreshold;
  const downVotesPercentage =
    dao && (downVotes * 100) / quorumThreshold;

  return (
    <>
      <Grid item xs={12} container direction="row" alignItems="center" spacing={1}>
        <Grid item xs={showButton ? 8 : 12} container direction="row" alignItems="baseline" >
          <Grid
            item
            md={isMobileSmall ? 12 : showButton ? 4 : 6}
            container
            direction="row"
            alignItems="baseline"
          >
            <GreenDot />
            <StatusTitle color="textSecondary">SUPPORT: </StatusTitle>
            <Typography color="textSecondary">
              {upVotes} ({ upVotesPercentage && upVotesPercentage > 100 ? 100 : formatNumber(Number(upVotesPercentage))}%){" "}
            </Typography>
          </Grid>

          <Grid
            md={isMobileSmall ? 12 : showButton ? 3 : 6}
            container
            direction="row"
            alignItems="center"
          >
            <RedDot />
            <StatusTitle color="textSecondary">OPPOSE: </StatusTitle>
            <Typography color="textSecondary">
              {downVotes} ({downVotesPercentage && downVotesPercentage > 100 ? 100 : formatNumber(Number(downVotesPercentage))}%){" "}
            </Typography>
          </Grid>

          <Grid
            md={isMobileSmall ? 12 : showButton ? 3 : 6}
            container
            direction="row"
            alignItems="center"
          >
            <StatusTitle color="textSecondary">THRESHOLD: </StatusTitle>
            <Typography color="textSecondary">
              {quorumThreshold}
            </Typography>
          </Grid>
        </Grid>

        {showButton ? (
          <Grid
            xs={4}
            container
            direction="row"
            alignItems="center"
            justify="flex-end"
          >
            <UpVotesDialog
              daoAddress={daoId}
              proposalAddress={proposalId}
              favor={true}
            />
          </Grid>
        ) : null}
      </Grid>
      <Grid item xs={12}>
        <CustomBar
          favor={true}
          variant="determinate"
          value={upVotesPercentage}
          color="secondary"
        />
      </Grid>
    </>
  );
};
