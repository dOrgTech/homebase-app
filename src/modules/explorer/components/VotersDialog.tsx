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
} from "@material-ui/core";

import { ProgressBar } from "modules/explorer/components/ProgressBar";
import { useProposal } from "services/contracts/baseDAO/hooks/useProposal";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";

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

const ViewButton = styled(Typography)({
  cursor: "pointer",
  marginTop: -30,
});

const TextHeader = styled(Typography)({
  marginTop: 10,
});

const Row = styled(Grid)({
  padding: "33px 64px",
  borderTop: "2px solid #3D3D3D",
  paddingBottom: 0,
  display: "flex",
  alignItems: "end",
  "&:last-child": {
    marginBottom: 30,
    borderBottom: "2px solid #3D3D3D",
  },
});

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

const NoTokens = styled(Grid)({
  padding: "33px 64px",
  borderTop: "2px solid #3D3D3D",
  paddingBottom: 0,
  display: "flex",
  alignItems: "end",
});

export const UpVotesDialog: React.FC<UpVotesDialogData> = ({
  daoAddress,
  proposalAddress,
  favor,
}) => {
  const [open, setOpen] = React.useState(false);

  const { data: dao } = useDAO(daoAddress);
  const proposal = useProposal(daoAddress, proposalAddress);
  const theme = useTheme();

  const upVotes = proposal ? proposal.upVotes : 0;
  const downVotes = proposal ? proposal.downVotes : 0;
  const totalVotes = upVotes + downVotes;
  const upVotesPercentage =
    upVotes && totalVotes ? (upVotes / totalVotes) * 100 : 0;
  const downVotesPercentage =
    downVotes && totalVotes ? (downVotes / totalVotes) * 100 : 0;

  const upVotesPercentageQuorum =
    upVotes && dao && dao.quorumTreshold
      ? (upVotes / dao.quorumTreshold) * 100
      : 0;
  const downVotesPercentageQuorum =
    downVotes && dao && dao.quorumTreshold
      ? (downVotes / dao.quorumTreshold) * 100
      : 0;

  const favorPercentage = favor ? upVotesPercentage : downVotesPercentage;
  const favorVotes = favor ? upVotes : downVotes;
  const favorPercentageQuorum = favor
    ? upVotesPercentageQuorum
    : downVotesPercentageQuorum;

  const voters = useMemo(() => {
    if (!proposal) {
      return [];
    }

    return proposal.voters;
  }, [proposal]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <ViewButton
        variant="subtitle1"
        style={{
          color: favor ? theme.palette.secondary.main : "#ED254E",
        }}
        onClick={handleClickOpen}
      >
        VIEW ADDRESSES
      </ViewButton>
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
                    color: favor ? theme.palette.secondary.main : "#ED254E",
                  }}
                >
                  {favor ? "FOR" : "OPPOSE"}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextHeader variant="h3" color="textSecondary">
                  {favorVotes}
                </TextHeader>
              </Grid>
              <Grid item xs={12}>
                <Grid container direction="row" alignItems="center">
                  <Grid item xs={10}>
                    <ProgressBar
                      value={favorPercentageQuorum}
                      favor={favor}
                      variant="determinate"
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <PercentageText align="right">
                      {favorPercentageQuorum}%
                    </PercentageText>
                  </Grid>
                </Grid>
              </Grid>
              <VotesContainer item xs={12}>
                <Grid item container direction="row" alignItems="center">
                  <Grid xs={6}>
                    <Typography variant="subtitle1" color="textSecondary">
                      {voters.length} Addresses
                    </Typography>
                  </Grid>

                  <Grid xs={6}>
                    <Typography
                      variant="subtitle1"
                      color="textSecondary"
                      align="right"
                    >
                      Votes
                    </Typography>
                  </Grid>
                </Grid>
              </VotesContainer>
            </TableHeader>

            {favorPercentage > 0 ? (
              voters.map((holder, index) => {
                return (
                  <Row
                    container
                    direction="row"
                    alignItems="center"
                    key={index}
                  >
                    <Grid item xs={6}>
                      <Typography variant="subtitle1" color="textSecondary">
                        {holder.address.slice(0, 6)}...
                        {holder.address.slice(
                          holder.address.length - 4,
                          holder.address.length
                        )}
                      </Typography>
                      <LinearBar
                        color="secondary"
                        variant="determinate"
                        favor={favor}
                        value={100}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="subtitle1"
                        color="textSecondary"
                        align="right"
                      >
                        {favorVotes}
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
