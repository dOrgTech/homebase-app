import React, { useState } from "react";
import {
  Grid,
  styled,
  Typography,
  Paper,
  DialogContent,
  DialogContentText,
  TextField,
  Switch,
} from "@material-ui/core";
import { useDAOHoldings } from "services/contracts/baseDAO/hooks/useDAOHoldings";
import { ErrorText } from "modules/explorer/components/styled/ErrorText";
import { ProposalFormListItem } from "modules/explorer/components/styled/ProposalFormListItem";
import * as Yup from "yup";
import { useDAOID } from "modules/explorer/daoRouter";
import { Autocomplete } from "@material-ui/lab";

import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { NFT } from "modules/explorer/components/NFT";
import { NFT as NFTModel } from "models/Token";

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

const AutoCompleteField = styled(Autocomplete)({
  "& .MuiInputLabel-root": {
    display: "none",
  },
  "& .MuiInput-root": {
    border: "1px solid #434242",
    padding: 6,
  },
});

const NFTContainer = styled(Grid)({
  maxHeight: 246,
  maxWidth: 272,
  padding: 32,
  boxSizing: "border-box",
});

export interface FormTransferParams {
  recipient: string;
  amount: number;
  asset?: NFTModel;
}

export interface NFTTransferFormValues {
  nftTransferForm: {
    transfers: FormTransferParams[];
    isBatch: boolean;
  };
}

export const nftTransferSchema = Yup.object().shape({
  nftTransferForm: Yup.object().shape({
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

const emptyTransfer: FormTransferParams = {
  recipient: "",
  amount: 1,
};

export const nftTransferFormInitialState: NFTTransferFormValues = {
  nftTransferForm: {
    transfers: [emptyTransfer],
    isBatch: false,
  },
};

export const NFTTransferForm: React.FC = () => {
  const {
    control,
    getValues,
    setValue,
    watch,
    formState: { errors, touchedFields: touched },
  } = useFormContext<NFTTransferFormValues>();

  const { fields, append } = useFieldArray({
    control,
    name: "nftTransferForm.transfers",
  });
  const values = getValues();
  const [isBatch, setIsBatch] = useState(values.nftTransferForm.isBatch);
  const [activeTransfer, setActiveTransfer] = React.useState(1);
  const daoId = useDAOID();
  const { nftHoldings } = useDAOHoldings(daoId);

  const handleIsBatchChange = () => {
    setIsBatch(!isBatch);
    setValue("nftTransferForm.isBatch", !isBatch);
    setActiveTransfer(1);
  };

  const recipientError = (
    errors.nftTransferForm?.transfers?.[activeTransfer - 1] as any
  )?.recipient;

  const { transfers } = watch("nftTransferForm");

  const activeAsset = transfers[activeTransfer - 1].asset;
  const takenNFTs = transfers.map(
    (t) => `${t.asset?.contract}-${t.asset?.token_id}`
  );

  const nonSelectedNFTs = nftHoldings
    ? nftHoldings.filter(
        (nft) =>
          !takenNFTs.includes(`${nft?.token?.contract}-${nft?.token?.token_id}`)
      )
    : [];

  const nftOptions = nonSelectedNFTs.map((n) => n.token);

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

        {values.nftTransferForm.isBatch ? (
          <BatchBar container direction="row" wrap="nowrap">
            {values.nftTransferForm.transfers.map((_, index) => {
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
                        name={`nftTransferForm.transfers.${index}.recipient`}
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
                      touched.nftTransferForm?.transfers?.[activeTransfer - 1]
                        ?.recipient ? (
                        <ErrorText>{recipientError}</ErrorText>
                      ) : null}
                    </SwitchContainer>
                  </Grid>
                </ProposalFormListItem>
                <AmountItem container direction="row" alignItems="center">
                  <Grid item xs={12}>
                    <Grid container direction="column">
                      <Typography variant="subtitle1" color="textSecondary">
                        NFT ID
                      </Typography>
                      <Controller
                        key={field.id}
                        name={`nftTransferForm.transfers.${index}.asset`}
                        control={control}
                        render={({ field: { onChange, ...props } }) => (
                          <AutoCompleteField
                            options={nftOptions}
                            getOptionLabel={(option) =>
                              `${(option as NFTModel).symbol}#${
                                (option as NFTModel).token_id
                              }`
                            }
                            renderInput={(params) => (
                              <TextField {...params} label="Select NFT" />
                            )}
                            onChange={(e, data) => onChange(data)}
                            {...props}
                          />
                        )}
                      />
                      {activeAsset && (
                        <Grid item>
                          <Grid container justifyContent="center">
                            <NFTContainer item>
                              <NFT
                                qmHash={activeAsset.artifact_hash}
                                name={activeAsset.name}
                                mimeType={activeAsset.formats[0].mimeType}
                              />
                            </NFTContainer>
                          </Grid>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                </AmountItem>
              </>
            )
        )}
      </DialogContentText>
    </DialogContent>
  );
};
