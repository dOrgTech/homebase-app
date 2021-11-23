import React, { useState } from "react";
import {
  Grid,
  styled,
  Typography,
  Paper,
  DialogContent,
  DialogContentText,
  TextField,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Switch,
} from "@material-ui/core";
import { useDAO } from "services/indexer/dao/hooks/useDAO";
import { TreasuryDAO } from "services/contracts/baseDAO";
import { useDAOHoldings } from "services/contracts/baseDAO/hooks/useDAOHoldings";
import { ErrorText } from "modules/explorer/components/styled/ErrorText";
import { ProposalFormListItem } from "modules/explorer/components/styled/ProposalFormListItem";
import * as Yup from "yup";
import BigNumber from "bignumber.js";
import { useDAOID } from "modules/explorer/daoRouter";
import { Autocomplete } from "@material-ui/lab";

import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { useTezosBalance } from "services/contracts/baseDAO/hooks/useTezosBalance";
import { Token } from "models/Token";

export type Asset = Token | { symbol: "XTZ" };

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
  asset?: Asset;
}

export interface TreasuryProposalFormValues {
  transferForm: {
    transfers: FormTransferParams[];
    isBatch: boolean;
  };
}

export const treasuryProposalFormSchema = Yup.object().shape({
  transferForm: Yup.object().shape({
    transfers: Yup.array().of(
      Yup.object().shape({
        amount: Yup.number()
          .required("Required")
          .positive("Should be positive"),
        recipient: Yup.string().required("Required"),
      })
    ),
  }),
});

const emptyTransfer = {
  recipient: "",
  amount: 0,
};

export const treasuryProposalFormInitialState: TreasuryProposalFormValues = {
  transferForm: {
    transfers: [emptyTransfer],
    isBatch: false,
  },
};

export const NewTreasuryProposalDialog: React.FC = () => {
  const {
    control,
    getValues,
    setValue,
    watch,
    formState: { errors, touchedFields: touched },
  } = useFormContext<TreasuryProposalFormValues>();

  const { fields, append } = useFieldArray({
    control,
    name: "transferForm.transfers",
  });
  const values = getValues();
  const [isBatch, setIsBatch] = useState(values.transferForm.isBatch);

  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const [activeTransfer, setActiveTransfer] = React.useState(1);
  const daoId = useDAOID();
  const { data: daoData } = useDAO(daoId);
  const dao = daoData as TreasuryDAO | undefined;
  const { tokenHoldings: daoHoldings } = useDAOHoldings(daoId);
  const { data: tezosBalance } = useTezosBalance(daoId);

  const handleIsBatchChange = () => {
    setIsBatch(!isBatch);
    setValue("transferForm.isBatch", !isBatch);
    setActiveTransfer(1);
  };

  const recipientError = (
    errors.transferForm?.transfers?.[activeTransfer - 1] as any
  )?.recipient;
  const amountError = (
    errors.transferForm?.transfers?.[activeTransfer - 1] as any
  )?.amount;

  const { transfers } = watch("transferForm");

  const currentTransfer = transfers[activeTransfer - 1];

  const daoAssets = daoHoldings
    ? [
        ...daoHoldings,
        { balance: tezosBalance?.div(1000000) || new BigNumber(0), token: { symbol: "XTZ" } },
      ]
    : [];

  const assetOptions = daoAssets.map((a) => a.token);
  const currentAssetBalance = daoAssets.find(asset => asset.token.symbol === currentTransfer.asset?.symbol)

  return (
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
                type="checkbox"
                onChange={handleIsBatchChange}
                checked={isBatch}
              />
            </SwitchContainer>
          </Grid>
        </ProposalFormListItem>

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
                  <Typography variant="subtitle1" color="textSecondary">
                    #{index + 1}
                  </Typography>
                </TransferActive>
              );
            })}

            <AddButton
              onClick={() => {
                append(emptyTransfer);
                setActiveTransfer(activeTransfer + 1);
              }}
            >
              +
            </AddButton>
          </BatchBar>
        ) : null}

        {fields.map(
          (field, index) =>
            index === activeTransfer - 1 && (
              <>
                <ProposalFormListItem container direction="row">
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" color="textSecondary">
                      Recipient
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <SwitchContainer item xs={12} justify="flex-end">
                      <Controller
                        key={field.id}
                        name={`transferForm.transfers.${index}.recipient`}
                        control={control}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            type="string"
                            placeholder="Type an Address Here"
                          />
                        )}
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
                      <Controller
                        key={field.id}
                        name={`transferForm.transfers.${index}.asset`}
                        control={control}
                        render={({ field: { onChange, ...props } }) => (
                          <AutoCompleteField
                            options={assetOptions || []}
                            getOptionLabel={(option) =>
                              (
                                option as
                                  | Token
                                  | {
                                      symbol: string;
                                    }
                              ).symbol
                            }
                            renderInput={(params) => (
                              <TextField {...params} label="Select asset" />
                            )}
                            onChange={(e, data) => onChange(data)}
                            {...props}
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
                        <Controller
                          key={field.id}
                          name={`transferForm.transfers.${index}.amount`}
                          control={control}
                          render={({ field }) => (
                            <CustomTextFieldAmount
                              {...field}
                              type="tel"
                              placeholder="0"
                              InputProps={{
                                inputProps: {
                                  step: 0.01,
                                  min: dao && dao.data.extra.min_xtz_amount,
                                  max: dao && dao.data.extra.max_xtz_amount,
                                },
                                endAdornment: (
                                  <InputAdornment position="start">
                                    <CurrentAsset
                                      color="textSecondary"
                                      variant="subtitle1"
                                    >
                                      {" "}
                                      {values.transferForm.transfers[
                                        activeTransfer - 1
                                      ].asset?.symbol || "-"}
                                    </CurrentAsset>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          )}
                        />

                        {amountError &&
                        touched.transferForm?.transfers?.[activeTransfer - 1]
                          ?.amount ? (
                          <ErrorText>{amountError}</ErrorText>
                        ) : null}
                      </SwitchContainer>
                    </Grid>
                  </Grid>

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
                      {daoAssets ? (
                        <AmountContainer
                          item
                          container
                          direction="row"
                          justify="flex-end"
                        >
                          <AmountText>
                            {currentAssetBalance?.balance.toString() || "-"}
                          </AmountText>
                          <AmountText>
                            {currentTransfer.asset?.symbol.toString() || "-"}
                          </AmountText>
                        </AmountContainer>
                      ) : null}
                    </Grid>
                  </DaoBalance>
                </AmountItem>
              </>
            )
        )}
      </DialogContentText>
    </DialogContent>
  );
};
