import React from "react";
import {
  Grid,
  Paper,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { formatNumber } from "../utils/FormatNumber";
import { UpVotesDialog } from "./VotersDialog";
import { MultiColorBar as CustomBar } from "modules/explorer/components";
import { useVotesStats } from "../hooks/useVotesStats";
import BigNumber from "bignumber.js";
import { useProposal } from "services/indexer/dao/hooks/useProposal";
import { TreasuryProposalWithStatus } from "services/indexer/dao/mappers/proposal/types";

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
  background: "#3866F9",
}));

const GreenDot = styled(Paper)(({ theme }) => ({
  width: 9,
  height: 9,
  marginRight: 9,
  background: theme.palette.secondary.main,
}));

const RedDot = styled(Paper)(({ theme }) => ({
  width: 9,
  height: 9,
  marginRight: 9,
  background: theme.palette.error.main,
}));

const StatusTitle = styled(Typography)({
  fontWeight: "bold",
  marginRight: 12,
});

export const VotersProgress: React.FC<VotersData> = ({
  showButton,
  daoId,
  proposalId,
  wrapAll,
}) => {
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const { data: proposalData } = useProposal(daoId, proposalId);
  const proposal = proposalData as TreasuryProposalWithStatus | undefined;
  const quorumThreshold = proposal?.quorumThreshold || new BigNumber(0);
  const upVotes = proposal ? proposal.upVotes : new BigNumber(0);
  const downVotes = proposal ? proposal.downVotes : new BigNumber(0);

  const {
    upVotesQuorumPercentage,
    downVotesQuorumPercentage,
    upVotesSumPercentage,
  } = useVotesStats({
    quorumThreshold,
    upVotes,
    downVotes,
  });

  return (
    <>
      <Grid
        item
        xs={12}
        container
        direction="row"
        alignItems="center"
        spacing={1}
      >
        <Grid
          item
          xs
          container
          direction="row"
          alignItems="baseline"
          justify="flex-start"
        >
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
              {proposal ? upVotes.toString() : "-"} (
              {upVotesQuorumPercentage &&
              upVotesQuorumPercentage.isGreaterThan(100)
                ? 100
                : formatNumber(upVotesQuorumPercentage)}
              %){" "}
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
              {proposal ? downVotes.toString() : "-"} (
              {downVotesQuorumPercentage && downVotesQuorumPercentage.isGreaterThan(100)
                ? 100
                : formatNumber(downVotesQuorumPercentage)}
              %){" "}
            </Typography>
          </Grid>

          <Grid
            md={isMobileSmall || wrapAll ? 12 : true}
            container
            direction="row"
            alignItems="center"
            wrap="nowrap"
          >
            <BlueDot />
            <StatusTitle color="textSecondary">THRESHOLD: </StatusTitle>
            <Typography color="textSecondary">
              {proposal ? quorumThreshold.toString() : "-"}
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
          value={upVotesSumPercentage.toNumber()}
          color="secondary"
        />
      </Grid>
    </>
  );
};
