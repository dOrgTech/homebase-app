import React, { useCallback, useContext } from "react";
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
  TextField as MaterialTextField,
  InputAdornment,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import { Formik, Form, Field, FieldArray, FormikErrors } from "formik";
import { TextField } from "formik-material-ui";
import { Autocomplete } from "formik-material-ui-lab";

import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import { useTezos } from "services/beacon/hooks/useTezos";
import { connectIfNotConnected } from "services/contracts/utils";
import { useTransferPropose } from "services/contracts/baseDAO/hooks/useTransferPropose";
import { TreasuryDAO } from "services/contracts/baseDAO";
import {
  fromMigrationParamsFile,
  validateTransactionsJSON,
} from "modules/explorer/Treasury/utils";
import { ActionTypes, ModalsContext } from "modules/explorer/ModalsContext";
import { useNotification } from "modules/common/hooks/useNotification";
// import { ProposalTextContainer } from "modules/explorer/components/ProposalTextContainer";
import { useDAOHoldings } from "services/contracts/baseDAO/hooks/useDAOHoldings";
import { DAOHolding } from "services/bakingBad/tokenBalances/types";
import { ErrorText } from "modules/explorer/components/styled/ErrorText";
import { SendButton } from "modules/explorer/components/ProposalFormSendButton";
import { ProposalFormListItem } from "modules/explorer/components/styled/ProposalFormListItem";

const CloseButton = styled(Typography)({
  fontWeight: 900,
  cursor: "pointer",
});

const Title = styled(DialogTitle)(({ theme }) => ({
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  height: 30,
  paddingTop: 28,
  minWidth: 500,
  padding: "24px 65px",
  boxSizing: "border-box",
  minHeight: 65,
  [theme.breakpoints.down("sm")]: {
    minWidth: 250,
    padding: "24px 24px",
  },
}));

const AmountItem = styled(Grid)(({ theme }) => ({
  minHeight: 137,
  display: "flex",
  alignItems: "center",
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  paddingTop: 24,
  paddingLeft: 65,
  paddingRight: 65,
  [theme.breakpoints.down("sm")]: {
    padding: "24px 24px",
  },
}));

const UploadButtonContainer = styled(Grid)(({ theme }) => ({
  minHeight: 70,
  display: "flex",
  alignItems: "center",
  padding: "0px 65px",
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  [theme.breakpoints.down("sm")]: {
    padding: "24px 24px",
  },
}));

const FileInput = styled("input")({
  display: "none",
});

const BatchBar = styled(Grid)(({ theme }) => ({
  height: 60,
  alignItems: "center",
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  padding: "0px 65px",
  cursor: "pointer",
  overflowX: "auto",
  [theme.breakpoints.down("sm")]: {
    padding: "24px 24px",
  },
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

const UploadFileLabel = styled("label")(({ theme }) => ({
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

const CustomTextFieldAmount = styled(TextField)(({ theme }) => ({
  border: "1px solid #434242",
  padding: 6,
  minHeight: 31,
  marginTop: 16,
  width: "auto",
  "& .MuiInputBase-input": {
    textAlign: "initial",
    paddingLeft: 40,
    paddingRight: 10,
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 0,
      paddingRight: 0,
      textAlign: "center",
    },
  },
  [theme.breakpoints.down("sm")]: {
    paddingLeft: "inherit",
    paddingRight: "inherit",
    width: "100%",
  },
}));

const AmountText = styled(Typography)({
  color: "rgba(255, 255, 255, 0.7)",
  fontSize: 14,
  lineHeight: "146.3%",
  marginRight: 10,
});

const AmountContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    paddingRight: 0,
  },
}));

const AutoCompleteField = styled(Autocomplete)({
  "& .MuiInputLabel-root": {
    display: "none",
  },
  "& .MuiInput-root": {
    border: "1px solid #434242",
    padding: 6,
  },
});

const DaoBalance = styled(Grid)({
  minHeight: 50,
});

const CurrentAsset = styled(Typography)({
  opacity: 0.7,
});

const AmountSmallText = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    marginTop: 14,
  },
}));

export interface FormTransferParams {
  recipient: string;
  amount: number;
  asset: DAOHolding;
}

interface Values {
  transfers: FormTransferParams[];
  description: string;
  agoraPostId: number;
  title: string;
}

const EMPTY_TRANSFER: FormTransferParams = {
  recipient: "",
  amount: 0,
  asset: {
    contract: "",
    level: 0,
    token_id: -1,
    symbol: "XTZ",
    name: "XTZ",
    decimals: 6,
    balance: "0",
  }
};

const INITIAL_FORM_VALUES: Values = {
  transfers: [EMPTY_TRANSFER],
  description: "",
  agoraPostId: 0,
  title: "",
};

const validateForm = (values: Values, holdings: DAOHolding[]): FormikErrors<Values> => {
  const errors: Record<string, any> = {
    transfers: values.transfers.map(() => ({}))
  }

  values.transfers.forEach((transfer, i) => {
    const asset = holdings.find(balance => balance.contract === values.transfers[i].asset.contract)

    if(Number.isNaN(transfer.amount)) {
      errors.transfers[i].amount = "Must be a number"
    }

    if(transfer.amount <= 0 ) {
      errors.transfers[i].amount = "Must be a greater than 0"
    }

    if(asset && (transfer.amount > Number(asset.balance))) {
      errors.transfers[i].amount = "Insufficient balance"
    }

    if(!transfer.recipient) {
      errors.transfers[i].recipient = "Required"
    }
  })

  return errors
}

export const NewTreasuryProposalDialog: React.FC = () => {
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const [isBatch, setIsBatch] = React.useState(false);
  const [activeTransfer, setActiveTransfer] = React.useState(1);
  const { mutate } = useTransferPropose();
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
  const openNotification = useNotification();
  const { data: daoHoldings } = useDAOHoldings(daoId);
  const handleClose = useCallback(() => {
    dispatch({
      type: ActionTypes.CLOSE,
      payload: {
        modal: "treasuryProposal",
      },
    });
  }, [dispatch]);

  const currentAssetSymbol = useCallback((transfers: FormTransferParams[]) => {
    const currentTransfer = transfers[activeTransfer - 1]

    if(!daoHoldings || !currentTransfer.asset) {
      return "-"
    }

    if((currentTransfer.asset as DAOHolding).symbol === "XTZ") {
      return "XTZ"
    }

    const currentAsset = (daoHoldings as DAOHolding[]).find(balance => balance.contract === (currentTransfer.asset as DAOHolding).contract)

    return currentAsset? currentAsset.symbol : "-"
  }, [activeTransfer, daoHoldings])

  const onSubmit = useCallback(
    async (values: Values, { setSubmitting }: any) => {
      setSubmitting(true);

      await connectIfNotConnected(tezos, connect);

      if (dao && daoHoldings) {
        mutate({
          dao,
          transfers: values.transfers.map(transfer => ({
            ...transfer,
            asset: daoHoldings.find(balance => balance.contract === transfer.asset?.contract) as DAOHolding,
            type: !transfer.asset || transfer.asset.symbol === "XTZ" ? "XTZ": "FA2"
          })),
          tokensToFreeze: dao.extra.frozenExtraValue,
          agoraPostId: values.agoraPostId,
        });

        handleClose();
      }
    },
    [connect, dao, handleClose, mutate, tezos, daoHoldings]
  );

  const getBalance = useCallback((values: Values): string => {
    if (daoHoldings) {

      const currentTransfer = values.transfers[activeTransfer - 1]

      if(!currentTransfer.asset) {
        return "-"
      }

      if(currentTransfer.asset.symbol === "XTZ") {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return daoHoldings.find(balance => balance.symbol === "XTZ")!.balance
      }

      const fa2Token = daoHoldings.find(
        balance => balance.contract === currentTransfer.asset?.contract
      );

      if (fa2Token) {
        return fa2Token.balance;
      }

      return "-"
    }
    
    return "-"
  }, [activeTransfer, daoHoldings]);

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
              <ProposalFormListItem container direction="row">
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
              </ProposalFormListItem>

              <Formik initialValues={INITIAL_FORM_VALUES} onSubmit={onSubmit} validate={(values) => validateForm(values, daoHoldings || [])}>
                {({ submitForm, values, errors, touched }) => {

                  const recipientError = (errors.transfers?.[activeTransfer - 1] as any)?.recipient
                  const amountError = (errors.transfers?.[activeTransfer - 1] as any)?.amount

                  const importTransactions = async (
                    event: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    if (event.currentTarget.files) {
                      try {
                        const file = event.currentTarget.files[0];
                        const transactionsParsed = await fromMigrationParamsFile(
                          file
                        );
                        const errors = validateTransactionsJSON(
                          transactionsParsed
                        );
                        console.log(errors);

                        if (errors.length) {
                          openNotification({
                            message: "Error while parsing JSON",
                            persist: true,
                            variant: "error",
                          });
                          return;
                        }

                        setIsBatch(true);
                        values.transfers = transactionsParsed;
                      } catch (e) {
                        openNotification({
                          message: "Error while parsing JSON",
                          persist: true,
                          variant: "error",
                        });
                      }
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
                                      setActiveTransfer(activeTransfer + 1);
                                    }}
                                  >
                                    +
                                  </AddButton>
                                </BatchBar>
                              ) : null}

                              <ProposalFormListItem container direction="row">
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
                                    { recipientError && touched.transfers?.[activeTransfer - 1]?.recipient? (
                                      <ErrorText>{recipientError}</ErrorText>
                                    ) : null}
                                  </SwitchContainer>
                                </Grid>
                              </ProposalFormListItem>

                              <AmountItem
                                container
                                direction="row"
                                alignItems="center"
                              >
                                <Grid item xs={isMobileSmall ? 12 : 5}>
                                  <Grid container direction="column">
                                    <Typography
                                      variant="subtitle1"
                                      color="textSecondary"
                                    >
                                      Asset
                                    </Typography>
                                    <Field
                                      component={AutoCompleteField}
                                      name={`transfers.${
                                        activeTransfer - 1
                                      }.asset`}
                                      options={daoHoldings? daoHoldings.map(
                                        (option) => option
                                      ): []}
                                      getOptionLabel={(option: DAOHolding) =>
                                        option.symbol
                                      }
                                      renderInput={(params: any) => (
                                        <MaterialTextField
                                          {...params}
                                          label="Select asset"
                                        />
                                      )}
                                    />
                                  </Grid>
                                </Grid>
                                <Grid item xs={isMobileSmall ? 12 : 2}></Grid>

                                <Grid item xs={isMobileSmall ? 12 : 5}>
                                  <Grid container direction="column">
                                    <AmountSmallText
                                      variant="subtitle1"
                                      color="textSecondary"
                                    >
                                      Amount
                                    </AmountSmallText>

                                    <SwitchContainer
                                      item
                                      xs={12}
                                      justify="flex-end"
                                    >
                                      <Field
                                        name={`transfers.${
                                          activeTransfer - 1
                                        }.amount`}
                                        type="tel"
                                        placeholder="0"
                                        component={CustomTextFieldAmount}
                                        InputProps={{
                                          inputProps: {
                                            step: 0.01,
                                            min: dao.extra.minXtzAmount,
                                            max: dao.extra.maxXtzAmount,
                                          },
                                          endAdornment: (
                                            <InputAdornment position="start">
                                              <CurrentAsset
                                                color="textSecondary"
                                                variant="subtitle1"
                                              >
                                                {" "}
                                                {currentAssetSymbol(values.transfers)}
                                              </CurrentAsset>
                                            </InputAdornment>
                                          ),
                                        }}
                                      />
                                      { amountError && touched.transfers?.[activeTransfer - 1]?.amount? (
                                      <ErrorText>{amountError}</ErrorText>
                                    ) : null}
                                    </SwitchContainer>
                                  </Grid>
                                </Grid>

                                {values.transfers[activeTransfer - 1] ? (
                                  <DaoBalance
                                    container
                                    direction="row"
                                    alignItems="center"
                                    justify="space-between"
                                  >
                                    <Grid item xs={6}>
                                      <AmountText>DAO Balance</AmountText>
                                    </Grid>
                                    <Grid item xs={6}>
                                      {daoHoldings ? (
                                        <AmountContainer
                                          item
                                          container
                                          direction="row"
                                          justify="flex-end"
                                        >
                                          <AmountText>
                                            {getBalance(values)}
                                          </AmountText>
                                          <AmountText>
                                            {
                                              currentAssetSymbol(values.transfers)
                                            }
                                          </AmountText>
                                        </AmountContainer>
                                      ) : null}
                                    </Grid>
                                  </DaoBalance>
                                ) : null}
                              </AmountItem>
                            </>
                          )}
                        />

                        {/* <ProposalTextContainer
                          title="Proposal Title"
                          value={values.title}
                          type="title"
                        />

                        <ProposalTextContainer
                          title="Proposal Description"
                          value={values.description}
                          type="description"
                        /> */}

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

                        <ProposalFormListItem container direction="row">
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
                                type="tel"
                                placeholder="Type an Agora Post ID"
                                component={CustomTextField}
                              />
                            </SwitchContainer>
                          </Grid>
                        </ProposalFormListItem>

                        <ProposalFormListItem container direction="row">
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
                              {dao.extra.frozenExtraValue}{" "}
                              {dao ? dao.metadata.unfrozenToken.symbol : ""}
                            </Typography>
                          </Grid>
                        </ProposalFormListItem>

                        <SendButton
                          customColor={theme.palette.secondary.main}
                          variant="outlined"
                          onClick={submitForm}
                        >
                          SEND
                        </SendButton>
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
