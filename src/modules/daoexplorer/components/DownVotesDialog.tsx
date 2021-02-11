import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
  createStyles,
  Grid,
  LinearProgress,
  styled,
  Theme,
  Typography,
  withStyles,
} from "@material-ui/core";

interface DownVotesDialogData {
  totalVotes: number;
  downVotesPercentage: number;
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
  color: "#ED254E !important",
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

const NoTokens = styled(Grid)({
  padding: "33px 64px",
  borderTop: "2px solid #3D3D3D",
  paddingBottom: 0,
  display: "flex",
  alignItems: "end",
});

const TableHeader = styled(Grid)({
  padding: "23px 64px",
});

const LinearBar = styled(LinearProgress)({
  marginBottom: "-3px",
  marginTop: 30,
});

const PercentageText = styled(Typography)({
  color: "rgba(255, 255, 255, 0.8)",
});

const VotesContainer = styled(Grid)({
  marginTop: 66,
});

const BorderLinearProgress = withStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: 10,
    },
    colorPrimary: {
      backgroundColor: theme.palette.secondary.main,
    },
    bar: {
      backgroundColor: "#ED254E",
    },
  })
)(LinearProgress);

const OpposeText = styled(Typography)({
  color: "#FF5151 !important",
});

const TokenHolders = [
  {
    address: "tz1bQgEea45ciBpYdFj4y4P3hNyDM8aMF6WB",
    tokens: 2,
  },
  {
    address: "fz1bQgEea45ciBpYdFj4y4P3hNyDM8aMF6T",
    tokens: 1,
  },
  {
    address: "ro1bQgEea45ciBpYdFj4y4P3hNyDM8aMF7P",
    tokens: 3,
  },
  {
    address: "ro1bQgEea45ciBpYdFj4y4P3hNyDM8aMF7P",
    tokens: 1.5,
  },
  {
    address: "ro1bQgEea45ciBpYdFj4y4P3hNyDM8aMF7P",
    tokens: 2.5,
  },
];

export const DownVotesDialog: React.FC<DownVotesDialogData> = ({
  totalVotes,
  downVotesPercentage,
}) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <ViewButton variant="subtitle1" onClick={handleClickOpen}>
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
                <OpposeText variant="subtitle1" color="secondary">
                  OPPOSE
                </OpposeText>
              </Grid>
              <Grid item xs={12}>
                <TextHeader variant="h3" color="textSecondary">
                  {totalVotes}
                </TextHeader>
              </Grid>
              <Grid item xs={12}>
                <Grid container direction="row" alignItems="center">
                  <Grid item xs={10}>
                    <BorderLinearProgress
                      value={
                        downVotesPercentage === 0 ? 100 : downVotesPercentage
                      }
                      variant="determinate"
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <PercentageText align="right">
                      {downVotesPercentage}%
                    </PercentageText>
                  </Grid>
                </Grid>
              </Grid>
              <VotesContainer item xs={12}>
                <Grid item container direction="row" alignItems="center">
                  <Grid xs={6}>
                    <Typography variant="subtitle1" color="textSecondary">
                      {TokenHolders.length} Addresses
                    </Typography>
                  </Grid>

                  <Grid xs={6}>
                    <Typography
                      variant="subtitle1"
                      color="textSecondary"
                      align="right"
                    >
                      % of Votes
                    </Typography>
                  </Grid>
                </Grid>
              </VotesContainer>
            </TableHeader>

            {downVotesPercentage > 0 ? (
              TokenHolders.map((holder: any, index: any) => {
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
                        value={(holder.tokens * 100) / totalVotes}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="subtitle1"
                        color="textSecondary"
                        align="right"
                      >
                        {(holder.tokens * 100) / totalVotes}
                      </Typography>
                    </Grid>
                  </Row>
                );
              })
            ) : (
              <NoTokens container direction="row" alignItems="center">
                <Grid item xs={12}>
                  <Typography>No opposed votes</Typography>
                </Grid>
              </NoTokens>
            )}
          </DialogContentText>
        </DialogContent>
      </CustomDialog>
    </div>
  );
};
