import React, { useMemo } from "react";
import {
  Grid,
  styled,
  Typography,
  useTheme,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from "@material-ui/core";

import { ProgressBar, ProgressBarMulti } from "modules/explorer/components";
import { useProposal } from "services/contracts/baseDAO/hooks/useProposal";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import { useVotes } from "services/contracts/baseDAO/hooks/useVotes";
import { toShortAddress } from "services/contracts/utils";
import { ViewButton } from "./ViewButton";
import { useVotesStats } from "../hooks/useVotesStats";

interface UpVotesDialogData {
  daoAddress: string;
  proposalAddress: string;
  favor: boolean;
}

const CloseButton = styled(Typography)({
  fontWeight: 900,
  cursor: "pointer",
});

const Title = styled(DialogTitle)({
  height: 30,
  paddingBottom: 0,
  minWidth: 500,
});

const CustomDialog = styled(Dialog)({
  "& .MuiDialog-paperWidthSm": {
    minHeight: "400px !important",
    maxHeight: 600,
  },
});

const StyledViewButton = styled(ViewButton)({
  marginTop: -30,
});

const TextHeader = styled(Typography)({
  marginTop: 10,
});

const Row = styled(Grid)(({ theme }) => ({
  padding: "33px 64px",
  borderTop: `2px solid ${theme.palette.primary.light}`,
  paddingBottom: 0,
  display: "flex",
  alignItems: "end",
  "&:last-child": {
    marginBottom: 30,
    borderBottom: `2px solid ${theme.palette.primary.light}`,
  },
}));

const TableHeader = styled(Grid)({
  padding: "23px 64px",
});

const LinearBar = styled(ProgressBar)({
  marginBottom: "-3px",
  marginTop: 30,
});

const PercentageText = styled(Typography)({
  color: "rgba(255, 255, 255, 0.8)",
});

const VotesContainer = styled(Grid)({
  marginTop: 66,
});

const NoTokens = styled(Grid)(({ theme }) => ({
  padding: "33px 64px",
  borderTop: `2px solid ${theme.palette.primary.light}`,
  paddingBottom: 0,
  display: "flex",
  alignItems: "end",
}));

export const UpVotesDialog: React.FC<UpVotesDialogData> = ({
  daoAddress,
  proposalAddress,
  favor,
}) => {
  const [open, setOpen] = React.useState(false);

  const { data: dao } = useDAO(daoAddress);
  const { data: proposal } = useProposal(daoAddress, proposalAddress);
  const theme = useTheme();
  const { data: votesData, isLoading } = useVotes(proposalAddress, daoAddress);

  const { votesSum, votesQuorumPercentage, votes: votesAmount } = useVotesStats(
    {
      quorumTreshold: dao?.storage.quorumTreshold || 0,
      upVotes: proposal?.upVotes || 0,
      downVotes: proposal?.downVotes || 0,
    }
  );

  const votes = useMemo(() => {
    if (!votesData) {
      return [];
    }

    return votesData.filter((voteData) => voteData.favor === favor);
  }, [votesData, favor]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <StyledViewButton
        variant="outlined"
        customColor={
          favor ? theme.palette.secondary.main : theme.palette.error.main
        }
        onClick={handleClickOpen}
      >
        VIEW VOTES
      </StyledViewButton>
      <CustomDialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Title id="alert-dialog-title" color="textSecondary">
          <Grid container direction="row">
            <Grid item xs={12}>
              <CloseButton
                color="textSecondary"
                align="right"
                onClick={handleClose}
              >
                X
              </CloseButton>
            </Grid>
          </Grid>
        </Title>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <TableHeader container direction="row" alignItems="center">
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  style={{
                    color: favor
                      ? theme.palette.secondary.main
                      : theme.palette.error.main,
                  }}
                >
                  {favor ? "FOR" : "OPPOSE"}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextHeader variant="h3" color="textSecondary">
                  {votesAmount}
                </TextHeader>
              </Grid>
              <Grid item xs={12}>
                <Grid container direction="row" alignItems="center">
                  <Grid item xs={10}>
                    <ProgressBarMulti
                      value={votesQuorumPercentage}
                      favor={favor}
                      variant="determinate"
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <PercentageText align="right">
                      {Number(votesQuorumPercentage.toFixed(1))}%
                    </PercentageText>
                  </Grid>
                </Grid>
              </Grid>
              <VotesContainer item xs={12}>
                <Grid item container direction="row" alignItems="center">
                  <Grid xs={6}>
                    <Typography variant="subtitle1" color="textSecondary">
                      {votes.length} Votes
                    </Typography>
                  </Grid>

                  <Grid xs={6}>
                    <Typography
                      variant="subtitle1"
                      color="textSecondary"
                      align="right"
                    >
                      Value
                    </Typography>
                  </Grid>
                </Grid>
              </VotesContainer>
            </TableHeader>

            {isLoading ? (
              <CircularProgress color="secondary" />
            ) : votes.length > 0 ? (
              votes.map((vote, index) => {
                return (
                  <Row
                    container
                    direction="row"
                    alignItems="center"
                    key={index}
                  >
                    <Grid item xs={6}>
                      <Typography variant="subtitle1" color="textSecondary">
                        {toShortAddress(vote.voter)}
                      </Typography>
                      <LinearBar
                        // against={true}
                        color="secondary"
                        variant="determinate"
                        favor={favor}
                        value={votesSum ? (vote.value / votesSum) * 100 : 0}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="subtitle1"
                        color="textSecondary"
                        align="right"
                      >
                        {vote.value}
                      </Typography>
                    </Grid>
                  </Row>
                );
              })
            ) : (
              <NoTokens container direction="row" alignItems="center">
                <Grid item xs={12}>
                  <Typography>
                    No votes {favor ? "in favor" : "against"}
                  </Typography>
                </Grid>
              </NoTokens>
            )}
          </DialogContentText>
        </DialogContent>
      </CustomDialog>
    </div>
  );
};
