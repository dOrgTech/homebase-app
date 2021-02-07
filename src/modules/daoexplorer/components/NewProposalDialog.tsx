import React, { useMemo } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
  Grid,
  styled,
  Switch,
  Typography,
  withTheme,
  Paper,
} from "@material-ui/core";
import { Formik, Form, Field, FieldArray } from "formik";
import { TextField } from "formik-material-ui";
import { usePropose } from "../../../services/contracts/baseDAO/hooks/usePropose";
import { useDAO } from "../../../services/contracts/baseDAO/hooks/useDAO";
import { useParams } from "react-router";
import { useVote } from "../../../services/contracts/baseDAO/hooks/useVote";

const StyledButton = styled(withTheme(Button))((props) => ({
  height: 53,
  color: props.theme.palette.text.secondary,
  borderColor: props.theme.palette.secondary.main,
  minWidth: 171,
}));

const CloseButton = styled(Typography)({
  fontWeight: 900,
  cursor: "pointer",
});

const Title = styled(DialogTitle)({
  borderBottom: "2px solid #3D3D3D",
  height: 30,
  paddingTop: 28,
  minWidth: 500,
});

const ListItem = styled(Grid)({
  height: 70,
  display: "flex",
  alignItems: "center",
  borderBottom: "2px solid #3D3D3D",
  padding: "0px 24px",
});

const SendContainer = styled(Grid)({
  height: 55,
});

const BatchBar = styled(Grid)({
  height: 55,
  display: "flex",
  alignItems: "center",
  borderBottom: "2px solid #3D3D3D",
  padding: "0px 24px",
  cursor: "pointer",
});

const SwitchContainer = styled(Grid)({
  textAlign: "end",
});

const TransferActive = styled(Grid)({
  height: 53,
  width: 51,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const AddButton = styled(Paper)({
  marginLeft: 12,
  height: 31,
  width: 31,
  textAlign: "center",
  padding: 0,
  background: "#383939",
  color: "#fff",
  alignItems: "center",
  display: "flex",
  justifyContent: "center",
  cursor: "pointer",
});

const styles = {
  visible: {
    display: "none",
  },
  active: {
    background: "#3866F9",
  },
};

const DescriptionContainer = styled(Grid)({
  minHeight: 250,
  paddingLeft: 24,
  paddingRight: 24,
  paddingTop: 24,
  borderBottom: "2px solid #3D3D3D",
});

const CustomTextField = styled(TextField)({
  textAlign: "end",
  "& .MuiInputBase-input": {
    textAlign: "end",
    paddingRight: 12,
  },
});

const CustomTextarea = styled(TextField)({
  textAlign: "end",
  "& .MuiInputBase-multiline": {
    textAlign: "initial",
    border: "1px solid #434242",
    boxSizing: "border-box",
    "& .MuiInputBase-inputMultiline": {
      padding: 12,
      textAlign: "initial",
    },
  },
});

interface Transfer {
  recipient: string;
  amount: 0;
}

interface Values {
  transfers: Transfer[];
  description: string;
  agoraPostId: number;
}

const PROPOSAL_SIZE = 1;
const EMPTY_TRANSFER: Transfer = { recipient: "", amount: 0 };
const INITIAL_FORM_VALUES: Values = {
  transfers: [EMPTY_TRANSFER],
  description: "",
  agoraPostId: 0,
};

export const NewProposalDialog: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [isBatch, setIsBatch] = React.useState(false);
  const [activeTransfer, setActiveTransfer] = React.useState(1);
  const { mutate } = usePropose();
  const { id } = useParams<{ id: string }>();
  const { data: dao } = useDAO(id);
  const { mutate: vote, data: voteData, error: voteError } = useVote();

  const proposalFee = useMemo(() => {
    //TODO: redo calculation when PACK ed size gets figured out
    return dao ? dao.frozenExtraValue : 0;
  }, [dao]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = (values: Values, { setSubmitting }: any) => {
    setSubmitting(true);
    if (dao) {
      mutate({
        contractAddress: dao.address,
        contractParams: {
          transfers: values.transfers,
          tokensToFreeze: proposalFee,
          agoraPostId: values.agoraPostId,
        },
      });
    }
  };

  return (
    <div>
      <StyledButton
        variant="outlined"
        onClick={handleClickOpen}
        disabled={!dao}
      >
        NEW PROPOSAL
      </StyledButton>
      <Button
        onClick={() => {
          console.log(voteData, voteError);

          vote({
            contractAddress: "KT1FvSHdoD6gJX6LgMJRJ1Fr7bXpGLLv6xEP",
            amount: 1,
            proposalKey:
              "70674a2002903eebc7f5780be6a1efa2eed3c619f4eb07be75f4a792a381f8fa",
            support: true,
          });
        }}
      >
        VOTE
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Title id="alert-dialog-title" color="textSecondary">
          <Grid container direction="row">
            <Grid item xs={6}>
              <Typography variant="subtitle1" color="textSecondary">
                SEND FUNDS
              </Typography>
            </Grid>
            <Grid item xs={6}>
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
            <ListItem container direction="row">
              <Grid item xs={6}>
                <Typography variant="subtitle1" color="textSecondary">
                  Batch Transfer?
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <SwitchContainer item xs={12} justify="flex-end">
                  <Switch
                    checked={isBatch}
                    onChange={() => {
                      setIsBatch(!isBatch);
                      return;
                    }}
                    name="checkedA"
                    inputProps={{ "aria-label": "secondary checkbox" }}
                  />
                </SwitchContainer>
              </Grid>
            </ListItem>

            <Formik initialValues={INITIAL_FORM_VALUES} onSubmit={onSubmit}>
              {({ submitForm, values }) => (
                <Form autoComplete="off">
                  <>
                    <FieldArray
                      name="transfers"
                      render={(arrayHelpers) => (
                        <>
                          {isBatch ? (
                            <BatchBar container direction="row">
                              {values.transfers.map((_, index) => {
                                return (
                                  <TransferActive
                                    item
                                    key={index}
                                    onClick={() => setActiveTransfer(index + 1)}
                                    style={
                                      Number(index + 1) === activeTransfer
                                        ? styles.active
                                        : undefined
                                    }
                                  >
                                    <Typography
                                      variant="subtitle1"
                                      color="textSecondary"
                                    >
                                      #{index + 1}
                                    </Typography>
                                  </TransferActive>
                                );
                              })}

                              <AddButton
                                onClick={() => {
                                  arrayHelpers.insert(
                                    values.transfers.length + 1,
                                    EMPTY_TRANSFER
                                  );
                                }}
                              >
                                +
                              </AddButton>
                            </BatchBar>
                          ) : null}

                          <ListItem container direction="row">
                            <Grid item xs={6}>
                              <Typography
                                variant="subtitle1"
                                color="textSecondary"
                              >
                                Recipient
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <SwitchContainer item xs={12} justify="flex-end">
                                <Field
                                  name={`transfers.${
                                    activeTransfer - 1
                                  }.recipient`}
                                  type="string"
                                  placeholder="Type an Address Here"
                                  component={CustomTextField}
                                />
                              </SwitchContainer>
                            </Grid>
                          </ListItem>

                          <ListItem container direction="row">
                            <Grid item xs={6}>
                              <Typography
                                variant="subtitle1"
                                color="textSecondary"
                              >
                                Amount
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <SwitchContainer item xs={12} justify="flex-end">
                                <Field
                                  name={`transfers.${
                                    activeTransfer - 1
                                  }.amount`}
                                  type="number"
                                  placeholder="Type an Amount"
                                  component={CustomTextField}
                                />
                              </SwitchContainer>
                            </Grid>
                          </ListItem>
                        </>
                      )}
                    />
                    <DescriptionContainer container direction="row">
                      <Grid item xs={12}>
                        <Grid
                          container
                          direction="row"
                          alignItems="center"
                          justify="space-between"
                        >
                          <Grid item xs={6}>
                            <Typography
                              variant="subtitle1"
                              color="textSecondary"
                            >
                              Proposal Description
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              align="right"
                              variant="subtitle1"
                              color="textSecondary"
                            >
                              {values.description
                                ? values.description.trim().split(" ").length
                                : 0}{" "}
                              Words
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Field
                          name="description"
                          type="number"
                          multiline
                          rows={6}
                          placeholder="Type a Description"
                          component={CustomTextarea}
                        />
                      </Grid>
                    </DescriptionContainer>

                    <ListItem container direction="row">
                      <Grid item xs={6}>
                        <Typography variant="subtitle1" color="textSecondary">
                          Agora Post ID
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <SwitchContainer item xs={12} justify="flex-end">
                          <Field
                            name={`agoraPostId`}
                            type="number"
                            placeholder="Type an Agora Post ID"
                            component={CustomTextField}
                          />
                        </SwitchContainer>
                      </Grid>
                    </ListItem>

                    <ListItem container direction="row">
                      <Grid item xs={6}>
                        <Typography variant="subtitle1" color="textSecondary">
                          Proposal Fee
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          align="right"
                          variant="subtitle1"
                          color="secondary"
                        >
                          {proposalFee} {dao ? dao.unfrozenToken.symbol : ""}
                        </Typography>
                      </Grid>
                    </ListItem>

                    <SendContainer container direction="row" justify="center">
                      <Button onClick={submitForm}>
                        <Typography variant="subtitle1" color="textSecondary">
                          SEND
                        </Typography>
                      </Button>
                    </SendContainer>
                  </>
                </Form>
              )}
            </Formik>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
};
