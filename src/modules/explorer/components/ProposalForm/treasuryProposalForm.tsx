import { Dialog, Grid, styled, Typography } from "@material-ui/core";
import { Field, Formik } from "formik";
import {
  INITIAL_TRANSFER_FORM_VALUES,
  NewTreasuryProposalDialog,
  TreasuryProposalFormValues,
  treasuryValidationSchema,
} from "modules/explorer/Treasury";
import React, { useCallback, useRef } from "react";
import { TreasuryDAO } from "services/contracts/baseDAO";
import { useDAO } from "services/indexer/dao/hooks/useDAO";
import { SendButton } from "../ProposalFormSendButton";
import { ProposalFormListItem } from "../styled/ProposalFormListItem";
import { TextField } from "formik-material-ui";
import { useDAOHoldings } from "services/contracts/baseDAO/hooks/useDAOHoldings";
import { useTreasuryPropose } from "services/contracts/baseDAO/hooks/useTreasuryPropose";
import { DAOHolding } from "services/bakingBad/tokenBalances/types";
import { useDAOID } from "modules/explorer/daoRouter";

interface Props {
  open: boolean;
  handleClose: () => void;
}

const SwitchContainer = styled(Grid)({
  textAlign: "end",
});

const CustomTextField = styled(TextField)({
  textAlign: "end",
  "& .MuiInputBase-input": {
    textAlign: "end",
    paddingRight: 12,
  },
});

export const TreasuryProposalFormContainer: React.FC<Props> = ({
  open,
  handleClose,
}) => {
  const daoId = useDAOID();
  const { data: daoData } = useDAO(daoId);
  const { data: daoHoldings } = useDAOHoldings(daoId);
  const dao = daoData as TreasuryDAO | undefined;
  const { mutate } = useTreasuryPropose();
  const valuesRef = useRef<any>();

  const onSubmit = useCallback(
    async (
      values: TreasuryProposalFormValues,
      { setSubmitting }: { setSubmitting: (b: boolean) => void }
    ) => {
      if (dao && daoHoldings && valuesRef.current) {
        setSubmitting(true);
        mutate({
          dao,
          args: {
            transfers: values.transferForm.transfers.map((transfer) => ({
              ...transfer,
              amount: transfer.amount,
              asset: daoHoldings.find(
                (balance) => balance.contract === transfer.asset?.contract
              ) as DAOHolding,
              type:
                !transfer.asset || transfer.asset.symbol === "XTZ"
                  ? "XTZ"
                  : "FA2",
            })),
            agoraPostId: valuesRef.current.agoraPostId,
          },
        });

        handleClose();
      }
    },
    [dao, handleClose, mutate, daoHoldings]
  );

  const initialValues = {
    ...INITIAL_TRANSFER_FORM_VALUES,
    agoraPostId: "0",
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      {dao && daoHoldings && (
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={treasuryValidationSchema}
          validateOnChange={false}
        >
          {(formikProps) => {
            valuesRef.current = formikProps.values;

            return (
              <>
                <NewTreasuryProposalDialog />

                <ProposalFormListItem container direction="row">
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
                </ProposalFormListItem>

                <ProposalFormListItem container direction="row">
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
                      {dao && dao.data.extra.frozen_extra_value.toString()}{" "}
                      {dao ? dao.data.token.symbol : ""}
                    </Typography>
                  </Grid>
                </ProposalFormListItem>

                <SendButton onClick={formikProps.submitForm} disabled={!dao}>
                  SEND
                </SendButton>
              </>
            );
          }}
        </Formik>
      )}
    </Dialog>
  );
};
