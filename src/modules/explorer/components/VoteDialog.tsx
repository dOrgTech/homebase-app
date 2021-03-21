import React, { useCallback } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Grid, styled, Typography, TextField, Theme } from "@material-ui/core";
import { useParams } from "react-router-dom";

import { useVote } from "services/contracts/baseDAO/hooks/useVote";
import { useProposal } from "services/contracts/baseDAO/hooks/useProposal";
import { ProposalStatus } from "services/bakingBad/proposals/types";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import { connectIfNotConnected } from "services/contracts/utils";
import { useTezos } from "services/beacon/hooks/useTezos";
import { PrimaryButton } from "./styled/PrimaryButton";

const StyledButton = styled(PrimaryButton)(
  ({ theme, support }: { theme: Theme; support: boolean }) => ({
    borderColor: support
      ? theme.palette.secondary.main
      : theme.palette.error.main,
    marginLeft: 22,
    borderRadius: 4,
    marginTop: 5,
    [theme.breakpoints.down("sm")]: {
      marginLeft: 0,
    },
  })
);

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

const ProposalInfoExtra = styled(Grid)({
  minHeight: 50,
});

const FeeContainer = styled(Grid)(({ theme }) => ({
  borderTop: `2px solid ${theme.palette.primary.light}`,
  padding: "30px 66px",
  borderBottom: `2px solid ${theme.palette.primary.light}`,
}));

const SubmitContainer = styled(Grid)({
  height: 80,
  display: "flex",
  cursor: "pointer",
  borderTop: "1px solid #4BCF93",
  "&:hover": {
    background: "rgba(129, 254, 183, 0.03)",
  },
});

const SupportText = styled(Typography)(
  ({ theme, support }: { theme: Theme; support: boolean }) => ({
    color: support ? theme.palette.secondary.main : "#FF5555",
  })
);

const CustomInput = styled(TextField)({
  "& .MuiInputBase-input": {
    textAlign: "end",
  },
});

export const VoteDialog: React.FC = () => {
  const [support, setSupport] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [amount, setAmount] = React.useState<any>();
  const { proposalId, id: daoId } = useParams<{
    proposalId: string;
    id: string;
  }>();

  const { data: proposal } = useProposal(daoId, proposalId);
  const { data: dao } = useDAO(daoId);
  const { tezos, connect } = useTezos();

  const { mutate } = useVote();

  const handleClickOpen = (isFor: boolean) => {
    setSupport(isFor);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = useCallback(async () => {
    if (dao) {
      await connectIfNotConnected(tezos, connect);

      mutate({
        proposalKey: proposalId,
        dao,
        amount,
        support,
      });

      handleClose();
    }
  }, [amount, connect, dao, mutate, proposalId, support, tezos]);

  return (
    <>
      <StyledButton
        variant="outlined"
        onClick={() => handleClickOpen(true)}
        support={true}
        disabled={proposal?.status !== ProposalStatus.ACTIVE}
      >
        VOTE FOR
      </StyledButton>
      <StyledButton
        variant="outlined"
        onClick={() => handleClickOpen(false)}
        support={false}
        disabled={proposal?.status !== ProposalStatus.ACTIVE}
        style={{ marginLeft: 15 }}
      >
        VOTE AGAINST
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
                <SupportText variant="subtitle1" support={support}>
                  {support ? "SUPPORT" : "OPPOSE"}
                </SupportText>
              </Grid>
              <Grid item xs={12}>
                <TitleText variant="h3" color="textSecondary">
                  Confirm your vote to {support ? "support" : "oppose"} Proposal
                </TitleText>
              </Grid>

              <ProposalInfoExtra item xs={12}>
                <Typography color="textSecondary" variant="subtitle1">
                  More data about the proposal
                </Typography>
              </ProposalInfoExtra>
            </Content>

            <FeeContainer container direction="row">
              <Grid item xs={6}>
                <Typography variant="subtitle1" color="textSecondary">
                  Amount
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <CustomInput
                  id="standard-basic"
                  value={amount}
                  type="number"
                  placeholder="Type an Amount"
                  onChange={(newValue: any) => setAmount(newValue.target.value)}
                />
              </Grid>
            </FeeContainer>
            <SubmitContainer
              container
              direction="row"
              alignItems="center"
              justify="center"
              onClick={onSubmit}
            >
              <Typography color="secondary" variant="subtitle1">
                SUBMIT VOTE
              </Typography>
            </SubmitContainer>
          </DialogContentText>
        </DialogContent>
      </CustomDialog>
    </>
  );
};
