/* eslint-disable react/display-name */
import {Dialog, Grid, styled, Typography, TextField} from "@material-ui/core";
import React, {useCallback, useEffect, useMemo} from "react";
import {useDAO} from "services/indexer/dao/hooks/useDAO";
import {SendButton} from "./ProposalFormSendButton";
import {useDAOHoldings} from "services/contracts/baseDAO/hooks/useDAOHoldings";
import {Controller, FormProvider, useForm} from "react-hook-form";
import {useDAOID} from "../v2/pages/DAO/router";
import {ProposalFormInput} from "./ProposalFormInput";
import {useProposeGuardianChange} from "../../../services/contracts/baseDAO/hooks/useProposeGuardianChange";

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

type Values = {
  newGuardianAddress: string;
};

export type ProposalFormDefaultValues = RecursivePartial<Values>;

interface Props {
  open: boolean;
  handleClose: () => void;
  defaultValues?: ProposalFormDefaultValues;
  defaultTab?: number;
}

const Content = styled(Grid)({
  padding: "54px 54px 0 54px"
})

export const GuardianChangeProposalForm: React.FC<Props> = ({
                                                         open,
                                                         handleClose,
                                                         defaultValues,
                                                       }) => {
  const daoId = useDAOID();
  const {data: dao} = useDAO(daoId);
  const {data: daoHoldings} = useDAOHoldings(daoId);

  const methods = useForm<Values>({
    defaultValues: useMemo(() => ({
      newGuardianAddress: "",
      ...defaultValues
    }), [defaultValues]),
    // resolver: yupResolver(validationSchema as any),
  });

  useEffect(() => {
    methods.reset(defaultValues)
  }, [defaultValues, methods])

  const {mutate} = useProposeGuardianChange();

  const onSubmit = useCallback(
    (values: Values) => {
      if (dao) {
        mutate({dao, newGuardianAddress: values.newGuardianAddress})
        handleClose();
      }
    },
    [dao, handleClose, mutate]
  );

  return (
    <FormProvider {...methods}>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Content container direction={"column"} style={{gap: 18}}>
          <Grid item>
            <ProposalFormInput label={"New Guardian Address"}>
              <Controller
                control={methods.control}
                name={`newGuardianAddress`}
                render={({field}) => (
                  <TextField
                    {...field}
                    type="text"
                    placeholder="New guardian address"
                    InputProps={{disableUnderline: true}}
                  />
                )}
              />
            </ProposalFormInput>
          </Grid>
          <Grid item>
            <Typography align="left" variant="subtitle2" color="textPrimary" display={"inline"}>Proposal
              Fee: </Typography>
            <Typography
              align="left" variant="subtitle2" color="secondary" display={"inline"}>
              {dao && dao.data.extra.frozen_extra_value.toString()}{" "}
              {dao ? dao.data.token.symbol : ""}
            </Typography>
          </Grid>

          <SendButton
            onClick={methods.handleSubmit(onSubmit as any)}
            disabled={!dao || !daoHoldings}
          >
            Submit
          </SendButton>
        </Content>
      </Dialog>
    </FormProvider>
  )
    ;
};
