import React, { useCallback } from "react";
import {
  Grid,
  styled,
  Typography,
  Paper,
  DialogContent,
  DialogContentText,
  TextField as MaterialTextField,
  InputAdornment,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import { Form, Field, FieldArray, useFormikContext } from "formik";
import { TextField, Switch } from "formik-material-ui";
import { Autocomplete } from "formik-material-ui-lab";

import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import { TreasuryDAO } from "services/contracts/baseDAO";
import {
  fromMigrationParamsFile,
  validateTransactionsJSON,
} from "modules/explorer/Treasury/utils";
import { useNotification } from "modules/common/hooks/useNotification";
import { useDAOHoldings } from "services/contracts/baseDAO/hooks/useDAOHoldings";
import { DAOHolding } from "services/bakingBad/tokenBalances/types";
import { ErrorText } from "modules/explorer/components/styled/ErrorText";
import { ProposalFormListItem } from "modules/explorer/components/styled/ProposalFormListItem";
import { useParams } from "react-router-dom";
import * as Yup from "yup";

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

export interface TreasuryProposalFormValues {
  transferForm: {
    transfers: FormTransferParams[];
    isBatch: boolean;
  };
}

export const EMPTY_TRANSFER: FormTransferParams = {
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
  },
};

export const INITIAL_TRANSFER_FORM_VALUES: TreasuryProposalFormValues = {
  transferForm: {
    transfers: [EMPTY_TRANSFER],
    isBatch: false,
  },
};

export const treasuryValidationSchema = Yup.object().shape({
  transferForm: Yup.object().shape({
    transfers: Yup.array().of(
      Yup.object().shape({
        amount: Yup.number().required("Required").positive("Should be positive"),
        recipient: Yup.string().required("Required"),
      })
    ),
  }),
});

export const NewTreasuryProposalDialog: React.FC = () => {
  const {
    values,
    errors,
    touched,
    setFieldValue,
  } = useFormikContext<TreasuryProposalFormValues>();
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const [activeTransfer, setActiveTransfer] = React.useState(1);
  const { id: daoId } = useParams<{
    id: string;
  }>();
  const { data: daoData } = useDAO(daoId);
  const dao = daoData as TreasuryDAO | undefined;
  const openNotification = useNotification();
  const { data: daoHoldings } = useDAOHoldings(daoId);

  const currentAssetSymbol = useCallback(
    (transfers: FormTransferParams[]) => {
      const currentTransfer = transfers[activeTransfer - 1];

      if (!daoHoldings || !currentTransfer.asset) {
        return "-";
      }

      if ((currentTransfer.asset as DAOHolding).symbol === "XTZ") {
        return "XTZ";
      }

      const currentAsset = (daoHoldings as DAOHolding[]).find(
        (balance) =>
          balance.contract === (currentTransfer.asset as DAOHolding).contract
      );

      return currentAsset ? currentAsset.symbol : "-";
    },
    [activeTransfer, daoHoldings]
  );

  const getBalance = useCallback(
    (values: TreasuryProposalFormValues): string => {
      if (daoHoldings) {
        const currentTransfer =
          values.transferForm.transfers[activeTransfer - 1];

        if (!currentTransfer.asset) {
          return "-";
        }

        if (currentTransfer.asset.symbol === "XTZ") {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return daoHoldings.find((balance) => balance.symbol === "XTZ")!
            .balance;
        }

        const fa2Token = daoHoldings.find(
          (balance) => balance.contract === currentTransfer.asset?.contract
        );

        if (fa2Token) {
          return fa2Token.balance;
        }

        return "-";
      }

      return "-";
    },
    [activeTransfer, daoHoldings]
  );

  const recipientError = (errors.transferForm?.transfers?.[
    activeTransfer - 1
  ] as any)?.recipient;
  const amountError = (errors.transferForm?.transfers?.[
    activeTransfer - 1
  ] as any)?.amount;

  const importTransactions = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.currentTarget.files) {
        try {
          const file = event.currentTarget.files[0];
          const transactionsParsed = await fromMigrationParamsFile(file);
          const errors = validateTransactionsJSON(transactionsParsed);
          console.log(errors);

          if (errors.length) {
            openNotification({
              message: "Error while parsing JSON",
              persist: true,
              variant: "error",
            });
            return;
          }

          setFieldValue("transferForm.isBatch", true);
          values.transferForm.transfers = transactionsParsed;
        } catch (e) {
          openNotification({
            message: "Error while parsing JSON",
            persist: true,
            variant: "error",
          });
        }
      }
    },
    [openNotification, setFieldValue, values.transferForm]
  );

  return (
    <>
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
                <Field
                  component={Switch}
                  type="checkbox"
                  name="transferForm.isBatch"
                />
              </SwitchContainer>
            </Grid>
          </ProposalFormListItem>

          <Form autoComplete="off">
            <>
              <FieldArray
                name="transferForm.transfers"
                render={(arrayHelpers) => (
                  <>
                    {values.transferForm.isBatch ? (
                      <BatchBar container direction="row" wrap="nowrap">
                        {values.transferForm.transfers.map((_, index) => {
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
                              values.transferForm.transfers.length + 1,
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
                        <Typography variant="subtitle1" color="textSecondary">
                          Recipient
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <SwitchContainer item xs={12} justify="flex-end">
                          <Field
                            name={`transferForm.transfers.${
                              activeTransfer - 1
                            }.recipient`}
                            type="string"
                            placeholder="Type an Address Here"
                            component={CustomTextField}
                          />
                          {recipientError &&
                          touched.transferForm?.transfers?.[activeTransfer - 1]
                            ?.recipient ? (
                            <ErrorText>{recipientError}</ErrorText>
                          ) : null}
                        </SwitchContainer>
                      </Grid>
                    </ProposalFormListItem>

                    <AmountItem container direction="row" alignItems="center">
                      <Grid item xs={isMobileSmall ? 12 : 5}>
                        <Grid container direction="column">
                          <Typography variant="subtitle1" color="textSecondary">
                            Asset
                          </Typography>
                          <Field
                            component={AutoCompleteField}
                            name={`transferForm.transfers.${
                              activeTransfer - 1
                            }.asset`}
                            options={
                              daoHoldings
                                ? daoHoldings.map((option) => option)
                                : []
                            }
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

                          <SwitchContainer item xs={12} justify="flex-end">
                            <Field
                              name={`transferForm.transfers.${
                                activeTransfer - 1
                              }.amount`}
                              type="tel"
                              placeholder="0"
                              component={CustomTextFieldAmount}
                              InputProps={{
                                inputProps: {
                                  step: 0.01,
                                  min: dao && dao.extra.minXtzAmount,
                                  max: dao && dao.extra.maxXtzAmount,
                                },
                                endAdornment: (
                                  <InputAdornment position="start">
                                    <CurrentAsset
                                      color="textSecondary"
                                      variant="subtitle1"
                                    >
                                      {" "}
                                      {currentAssetSymbol(
                                        values.transferForm.transfers
                                      )}
                                    </CurrentAsset>
                                  </InputAdornment>
                                ),
                              }}
                            />
                            {amountError &&
                            touched.transferForm?.transfers?.[
                              activeTransfer - 1
                            ]?.amount ? (
                              <ErrorText>{amountError}</ErrorText>
                            ) : null}
                          </SwitchContainer>
                        </Grid>
                      </Grid>

                      {values.transferForm.transfers[activeTransfer - 1] ? (
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
                                <AmountText>{getBalance(values)}</AmountText>
                                <AmountText>
                                  {currentAssetSymbol(
                                    values.transferForm.transfers
                                  )}
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
            </>
          </Form>
        </DialogContentText>
      </DialogContent>
    </>
  );
};
