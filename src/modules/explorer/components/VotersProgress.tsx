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
import { MultiColorBar as CustomBar } from "modules/explorer/components";

interface VotersData {
  showButton: boolean;
  daoId: string;
  proposalId: string;
  wrapAll?: boolean;
}

const BlueDot = styled(Paper)(() => ({
  width: 9,
  height: 9,
  marginRight: 9,
  background: "#3866F9"
}));

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
  proposalId,
  wrapAll
}) => {
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const { data: proposalData } = useProposal(daoId, proposalId);
  const proposal = proposalData as TreasuryProposalWithStatus | undefined;
  const { data: dao } = useDAO(daoId);
  const quorumThreshold =  Number(Number(proposal?.quorumThreshold).toFixed(2)) || 0

  const upVotes = proposal ? proposal.upVotes : 0;
  const downVotes = proposal ? proposal.downVotes : 0;
  const upVotesQuorumPercentage = dao && (upVotes * 100) / quorumThreshold || 0;
  const downVotesQuorumPercentage =
    dao && (downVotes * 100) / quorumThreshold;
  const totalVotes = upVotes + downVotes;
  const upVotesPercentage = dao && (totalVotes > 0? (upVotes * 100) / totalVotes : 0);

  return (
    <>
      <Grid item xs={12} container direction="row" alignItems="center" spacing={1}>
        <Grid item xs container direction="row" alignItems="baseline" justify="flex-start" >
          <Grid
            item
            md={isMobileSmall || wrapAll ? 12 : true}
            container
            direction="row"
            alignItems="baseline"
            wrap="nowrap"
          >
            <GreenDot />
            <StatusTitle color="textSecondary">SUPPORT: </StatusTitle>
            <Typography color="textSecondary">
              {proposal? upVotes: "-"} ({ upVotesQuorumPercentage && upVotesQuorumPercentage > 100 ? 100 : formatNumber(Number(upVotesQuorumPercentage))}%){" "}
            </Typography>
          </Grid>

          <Grid
            md={isMobileSmall || wrapAll ? 12 : true}
            container
            direction="row"
            alignItems="center"
            wrap="nowrap"
          >
            <RedDot />
            <StatusTitle color="textSecondary">OPPOSE: </StatusTitle>
            <Typography color="textSecondary">
              {proposal? downVotes: "-"} ({downVotesQuorumPercentage && downVotesQuorumPercentage > 100 ? 100 : formatNumber(Number(downVotesQuorumPercentage))}%){" "}
            </Typography>
          </Grid>

          <Grid
            md={isMobileSmall || wrapAll ? 12 : true}
            container
            direction="row"
            alignItems="center"
            wrap="nowrap"
          >
            <BlueDot/>
            <StatusTitle color="textSecondary">THRESHOLD: </StatusTitle>
            <Typography color="textSecondary">
              {proposal? quorumThreshold: "-"}
            </Typography>
          </Grid>
        </Grid>

        {showButton ? (
          <Grid
            xs={2}
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
          variant="determinate"
          value={upVotesPercentage}
          color="secondary"
        />
      </Grid>
    </>
  );
};
