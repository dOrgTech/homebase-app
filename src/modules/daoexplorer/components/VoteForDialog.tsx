import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Grid, styled, Typography, withTheme } from "@material-ui/core";

const StyledButton = styled(withTheme(Button))((props) => ({
  height: 53,
  color: props.theme.palette.text.secondary,
  borderColor: props.theme.palette.secondary.main,
  minWidth: 171,
  marginTop: 5,
}));

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
    minHeight: "700px !important",
  },
});

const Content = styled(Grid)({
  padding: "0px 66px",
});

const TitleText = styled(Typography)({
  marginTop: 8,
  lineHeight: "146.3% !important",
  marginBottom: 45,
});

const ProposalInfo = styled(Grid)({
  minHeight: 100,
});

const ProposalInfoExtra = styled(Grid)({
  minHeight: 200,
});

const FeeContainer = styled(Grid)({
  borderTop: "2px solid #3D3D3D",
  padding: "30px 66px",
  borderBottom: "2px solid #3D3D3D",
});

const SubmitContainer = styled(Grid)({
  height: 80,
  display: "flex",
  cursor: "pointer",
});

export const VoteForDialog: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = () => {
    console.log("submit");
  };

  return (
    <div>
      <StyledButton variant="outlined" onClick={handleClickOpen}>
        VOTE FOR
      </StyledButton>
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
            <Content container direction="row">
              <Grid item xs={12}>
                <Typography variant="subtitle1" color="secondary">
                  SUPPORT
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TitleText variant="h3" color="textSecondary">
                  Confirm your vote to support Proposal #45
                </TitleText>
              </Grid>

              <ProposalInfo item xs={12}>
                <Typography color="textSecondary" variant="subtitle1">
                  This Proposal was created to fund a new project as the
                  governing body of such and such and other can go here.
                </Typography>
              </ProposalInfo>

              <ProposalInfoExtra item xs={12}>
                <Typography color="textSecondary" variant="subtitle1">
                  More data about the proposal
                </Typography>
              </ProposalInfoExtra>
            </Content>

            <FeeContainer container direction="row">
              <Grid item xs={6}>
                <Typography variant="subtitle1" color="textSecondary">
                  Fee
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1" color="secondary" align="right">
                  15 MYGT
                </Typography>
              </Grid>
            </FeeContainer>
            <SubmitContainer
              container
              direction="row"
              alignItems="center"
              justify="center"
              onClick={onSubmit}
            >
              <Typography color="textSecondary" variant="subtitle1">
                SUBMIT VOTE
              </Typography>
            </SubmitContainer>
          </DialogContentText>
        </DialogContent>
      </CustomDialog>
    </div>
  );
};
