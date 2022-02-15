/* eslint-disable react/display-name */
import { Grid, styled, Typography, TextField } from "@material-ui/core";
import React, { useCallback, useEffect, useMemo } from "react";
import { useDAO } from "services/indexer/dao/hooks/useDAO";
import { SendButton } from "./ProposalFormSendButton";
import { useDAOHoldings } from "services/contracts/baseDAO/hooks/useDAOHoldings";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useDAOID } from "../pages/DAO/router";
import { ProposalFormInput } from "./ProposalFormInput";
import { ResponsiveDialog } from "./ResponsiveDialog";
import { useProposeDelegationChange } from "services/contracts/baseDAO/hooks/useProposeDelegationChange";

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

type Values = {
  newDelegationAddress: string;
};

export type ProposalFormDefaultValues = RecursivePartial<Values>;

interface Props {
  open: boolean;
  handleClose: () => void;
  defaultValues?: ProposalFormDefaultValues;
  defaultTab?: number;
}

const Content = styled(Grid)({
  padding: "10px 0",
});

export const DelegationChangeProposalForm: React.FC<Props> = ({ open, handleClose, defaultValues }) => {
  const daoId = useDAOID();
  const { data: dao } = useDAO(daoId);
  const { data: daoHoldings } = useDAOHoldings(daoId);

  const methods = useForm<Values>({
    defaultValues: useMemo(
      () => ({
        newDelegationAddress: "",
        ...defaultValues,
      }),
      [defaultValues]
    ),
    // resolver: yupResolver(validationSchema as any),
  });

  const newDelegationAddress = methods.watch("newDelegationAddress");

  useEffect(() => {
    methods.reset(defaultValues);
  }, [defaultValues, methods]);

  const { mutate } = useProposeDelegationChange();

  const onSubmit = useCallback(
    (values: Values) => {
      if (dao) {
        mutate({ dao, newDelegationAddress: values.newDelegationAddress });
        handleClose();
      }
    },
    [dao, handleClose, mutate]
  );

  return (
    <FormProvider {...methods}>
      <ResponsiveDialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        title={"Change Delegation"}>
        <Content container direction={"column"} style={{ gap: 18 }}>
          <Grid item>
            <ProposalFormInput label={"New Delegation Address"}>
              <Controller
                control={methods.control}
                name={`newDelegationAddress`}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type='text'
                    placeholder=' tz1...'
                    InputProps={{ disableUnderline: true }}
                  />
                )}
              />
            </ProposalFormInput>
          </Grid>

          <Grid item>
            <Typography align='left' variant='subtitle2' color='textPrimary' display={"inline"}>
              Proposal Fee:{" "}
            </Typography>
            <Typography align='left' variant='subtitle2' color='secondary' display={"inline"}>
              {dao && dao.data.extra.frozen_extra_value.toString()} {dao ? dao.data.token.symbol : ""}
            </Typography>
          </Grid>

          <SendButton
            onClick={methods.handleSubmit(onSubmit as any)}
            disabled={!dao || !daoHoldings || !newDelegationAddress}>
            Submit
          </SendButton>
        </Content>
      </ResponsiveDialog>
    </FormProvider>
  );
};
