import React, { useCallback, useContext, useState } from "react";
import {
  Grid,
  styled,
  Switch,
  Typography,
  Paper,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Dialog,
} from "@material-ui/core";
import { Formik, Form, Field, FieldArray } from "formik";
import { TextField } from "formik-material-ui";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import {
  calculateProposalSize,
  getTokensToStakeInPropose,
} from "services/contracts/baseDAO/treasuryDAO/service";
import { useTezos } from "services/beacon/hooks/useTezos";
import { xtzToMutez } from "services/contracts/utils";
import { useTreasuryPropose } from "services/contracts/baseDAO/hooks/useTreasuryPropose";
import { Transfer, TreasuryDAO } from "services/contracts/baseDAO";
import { fromMigrationParamsFile, validateTransactionsJSON } from "../utils";
import { ActionTypes, ModalsContext } from "modules/explorer/ModalsContext";
import { theme } from "theme";
import { ViewButton } from "modules/explorer/components/ViewButton";

const CloseButton = styled(Typography)({
  fontWeight: 900,
  cursor: "pointer",
});

const Title = styled(DialogTitle)(({ theme }) => ({
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  height: 30,
  paddingTop: 28,
  minWidth: 500,
}));

const ListItem = styled(Grid)(({ theme }) => ({
  height: 70,
  display: "flex",
  alignItems: "center",
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  padding: "0px 24px",
}));

const UploadButtonContainer = styled(Grid)(({ theme }) => ({
  height: 70,
  display: "flex",
  alignItems: "center",
  padding: "0px 24px",
  borderBottom: `2px solid ${theme.palette.primary.light}`,
}));

const FileInput = styled("input")({
  display: "none",
});

const SendContainer = styled(Grid)({
  height: 55,
});

const BatchBar = styled(Grid)(({ theme }) => ({
  height: 60,
  alignItems: "center",
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  padding: "0px 24px",
  cursor: "pointer",
  overflowX: "auto",
}));

const SwitchContainer = styled(Grid)({
  textAlign: "end",
});

const TransferActive = styled(Grid)({
  height: 53,
  minWidth: 51,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const AddButton = styled(Paper)({
  marginLeft: 12,
  minHeight: 31,
  minWidth: 31,
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
});

const UploadFileLabel = styled("label")(({ theme }) => ({
  height: 53,
  color: theme.palette.secondary.main,
  borderColor: theme.palette.secondary.main,
  minWidth: 171,
  cursor: "pointer",
  margin: "auto",
  display: "block",
}));

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

const SendButton = styled(ViewButton)({
  width: "100%",
  border: "none",
  borderTop: "1px solid #4BCF93",
});

interface Values {
  transfers: Transfer[];
  description: string;
  agoraPostId: number;
}

const EMPTY_TRANSFER: Transfer = { recipient: "", amount: 0 };
const INITIAL_FORM_VALUES: Values = {
  transfers: [EMPTY_TRANSFER],
  description: "",
  agoraPostId: 0,
};

export const NewTreasuryProposalDialog: React.FC = () => {
  const [isBatch, setIsBatch] = React.useState(false);
  const [activeTransfer, setActiveTransfer] = React.useState(1);
  const [proposalFee, setProposalFee] = useState(0);
  const { mutate } = useTreasuryPropose();
  const {
    state: {
      treasuryProposal: { open },
      daoId,
    },
    dispatch,
  } = useContext(ModalsContext);
  const { data: daoData } = useDAO(daoId);
  const dao = daoData as TreasuryDAO | undefined;
  const { tezos, connect } = useTezos();

  const handleClose = useCallback(() => {
    dispatch({
      type: ActionTypes.CLOSE,
      payload: {
        modal: "treasuryProposal",
      },
    });
  }, [dispatch]);

  const onSubmit = useCallback(
    async (values: Values, { setSubmitting }: any) => {
      setSubmitting(true);

      const transfers: Transfer[] = values.transfers.map((transfer) => ({
        ...transfer,
        amount: Number(xtzToMutez(transfer.amount.toString())),
      }));

      if (dao) {
        const proposalSize = await calculateProposalSize(
          dao.address,
          {
            transfers,
            agoraPostId: values.agoraPostId,
          },
          tezos || (await connect())
        );

        const tokensNeeded = getTokensToStakeInPropose(
          {
            frozenExtraValue: dao.storage.frozenExtraValue,
            frozenScaleValue: dao.storage.frozenScaleValue,
          },
          proposalSize
        );

        setProposalFee(tokensNeeded);

        mutate({
          dao,
          transfers,
          tokensToFreeze: tokensNeeded,
          agoraPostId: values.agoraPostId,
        });

        handleClose();
      }
    },
    [connect, dao, handleClose, mutate, tezos]
  );

  return (
    <>
      {dao && (
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
                {({ submitForm, values }) => {
                  const importTransactions = async (
                    event: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    if (event.currentTarget.files) {
                      const file = event.currentTarget.files[0];
                      const transactionsParsed = await fromMigrationParamsFile(
                        file
                      );
                      console.log(transactionsParsed);
                      const errors = validateTransactionsJSON(
                        transactionsParsed
                      );
                      console.log(errors);
                      if (errors.length) {
                        // Show notification with error
                        return;
                      }
                      setIsBatch(true);
                      values.transfers = transactionsParsed;
                    }
                  };

                  return (
                    <Form autoComplete="off">
                      <>
                        <FieldArray
                          name="transfers"
                          render={(arrayHelpers) => (
                            <>
                              {isBatch ? (
                                <BatchBar
                                  container
                                  direction="row"
                                  wrap="nowrap"
                                >
                                  {values.transfers.map((_, index) => {
                                    return (
                                      <TransferActive
                                        item
                                        key={index}
                                        onClick={() =>
                                          setActiveTransfer(index + 1)
                                        }
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
                                  <SwitchContainer
                                    item
                                    xs={12}
                                    justify="flex-end"
                                  >
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
                                    XTZ Amount
                                  </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <SwitchContainer
                                    item
                                    xs={12}
                                    justify="flex-end"
                                  >
                                    <Field
                                      name={`transfers.${
                                        activeTransfer - 1
                                      }.amount`}
                                      type="number"
                                      placeholder="Type an Amount"
                                      component={CustomTextField}
                                      InputProps={{
                                        inputProps: {
                                          step: 0.01,
                                          min: dao.storage.minXtzAmount,
                                          max: dao.storage.maxXtzAmount,
                                        },
                                      }}
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
                                    ? values.description.trim().split(" ")
                                        .length
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

                        <UploadButtonContainer container direction="row">
                          <UploadFileLabel>
                            -OR- UPLOAD JSON FILE
                            <FileInput
                              type="file"
                              accept=".json"
                              onChange={importTransactions}
                            />
                          </UploadFileLabel>
                        </UploadButtonContainer>

                        <ListItem container direction="row">
                          <Grid item xs={6}>
                            <Typography
                              variant="subtitle1"
                              color="textSecondary"
                            >
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
                            <Typography
                              variant="subtitle1"
                              color="textSecondary"
                            >
                              Proposal Fee
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              align="right"
                              variant="subtitle1"
                              color="secondary"
                            >
                              {proposalFee}{" "}
                              {dao ? dao.metadata.unfrozenToken.symbol : ""}
                            </Typography>
                          </Grid>
                        </ListItem>

                        <SendContainer
                          container
                          direction="row"
                          justify="center"
                        >
                          <SendButton
                            customColor={theme.palette.secondary.main}
                            variant="outlined"
                            onClick={submitForm}
                          >
                            {/* <Typography
                              variant="subtitle1"
                              color="textSecondary"
                            >
                              SEND
                            </Typography> */}
                            SEND
                          </SendButton>
                        </SendContainer>
                      </>
                    </Form>
                  );
                }}
              </Formik>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
