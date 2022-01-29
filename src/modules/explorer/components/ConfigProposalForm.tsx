/* eslint-disable react/display-name */
import { Grid, Typography, TextField} from "@material-ui/core";
import React, {useCallback} from "react";
import {useDAO} from "services/indexer/dao/hooks/useDAO";
import {SendButton} from "./ProposalFormSendButton";
import {useDAOHoldings} from "services/contracts/baseDAO/hooks/useDAOHoldings";
import {Controller, FormProvider, useForm} from "react-hook-form";
import {useDAOID} from "../pages/DAO/router";
import {ProposalFormInput} from "./ProposalFormInput";
import {useProposeConfigChange} from "../../../services/contracts/baseDAO/hooks/useProposeConfigChange";
import {ResponsiveDialog} from "./ResponsiveDialog";

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

type Values = {
  frozen_extra_value: number
  returnedPercentage: number
};

export type ProposalFormDefaultValues = RecursivePartial<Values>;

interface Props {
  open: boolean;
  handleClose: () => void;
  defaultValues?: ProposalFormDefaultValues;
  defaultTab?: number;
}

// const validationSchema: Yup.SchemaOf<Values> = Yup.object({
//   frozen_extra_value: Yup.number().required("Required"),
//   slash_scale_value: Yup.number().min(0, "Cannot be lesser than 0").max(100, "Cannot be greater than 100")
// });

export const ConfigProposalForm: React.FC<Props> = ({
                                                      open,
                                                      handleClose,
                                                    }) => {
  const daoId = useDAOID();
  const {data: dao} = useDAO(daoId);
  const {data: daoHoldings} = useDAOHoldings(daoId);

  const methods = useForm<Values>();

  const {mutate} = useProposeConfigChange();

  const onSubmit = useCallback(
    (values: Values) => {
      if (dao) {
        mutate({
          dao, args: {
            frozen_extra_value: values.frozen_extra_value,
            slash_scale_value: values.returnedPercentage ? 100 - values.returnedPercentage : undefined
          }
        })
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
        title={"Change DAO configuration"}
      >
        <Grid container direction={"column"} style={{gap: 18}}>
          <Grid item>
            <Typography variant={'body1'} color={"secondary"}>All fields are optional. Leave empty what you wish to leave unchanged</Typography>
          </Grid>
          <Grid item>
            <ProposalFormInput label={`Proposal fee (Current: ${dao?.data.extra.frozen_extra_value.toString()})`}>
              <Controller
                control={methods.control}
                name={`frozen_extra_value`}
                render={({field}) => (
                  <TextField
                    {...field}
                    type="number"
                    placeholder="Proposal fee"
                    InputProps={{disableUnderline: true}}
                  />
                )}
              />
            </ProposalFormInput>
          </Grid>
          <Grid item>
            <ProposalFormInput label={`Percentage of tokens returned after rejection (Current: ${dao?.data.extra.returnedPercentage.toString()}%)`}>
              <Controller
                control={methods.control}
                name={`returnedPercentage`}
                render={({field}) => (
                  <TextField
                    {...field}
                    type="number"
                    placeholder="Returned tokens percentage"
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
        </Grid>
      </ResponsiveDialog>
    </FormProvider>
  )
    ;
};
