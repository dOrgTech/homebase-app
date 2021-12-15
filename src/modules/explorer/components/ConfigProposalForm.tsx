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
import {useProposeConfigChange} from "../../../services/contracts/baseDAO/hooks/useProposeConfigChange";
import { ResponsiveDialog } from "../v2/components/ResponsiveDialog";

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

type Values = {
  frozen_extra_value: number
  frozen_scale_value: number
  max_proposal_size: number
  slash_division_value: number
  slash_scale_value: number
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

export const ConfigProposalForm: React.FC<Props> = ({
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

  const {mutate} = useProposeConfigChange();

  const onSubmit = useCallback(
    (values: Values) => {
      if (dao) {
        mutate({
          dao, args: {
            frozen_extra_value: values.frozen_extra_value,
            frozen_scale_value: values.frozen_scale_value,
            max_proposal_size: values.max_proposal_size,
            slash_division_value: values.slash_division_value,
            slash_scale_value: values.slash_scale_value
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
      >
        <Content container direction={"column"} style={{gap: 18}}>
          <Grid item>
            <ProposalFormInput label={"Frozen extra value"}>
              <Controller
                control={methods.control}
                name={`frozen_extra_value`}
                render={({field}) => (
                  <TextField
                    {...field}
                    type="number"
                    placeholder="Frozen extra value"
                    InputProps={{disableUnderline: true}}
                  />
                )}
              />
            </ProposalFormInput>
          </Grid>
          <Grid item>
            <ProposalFormInput label={"Frozen scale value"}>
              <Controller
                control={methods.control}
                name={`frozen_scale_value`}
                render={({field}) => (
                  <TextField
                    {...field}
                    type="number"
                    placeholder="Frozen scale value"
                    InputProps={{disableUnderline: true}}
                  />
                )}
              />
            </ProposalFormInput>
          </Grid>
          <Grid item>
            <ProposalFormInput label={"Max proposal size"}>
              <Controller
                control={methods.control}
                name={`max_proposal_size`}
                render={({field}) => (
                  <TextField
                    {...field}
                    type="number"
                    placeholder="Max proposal size"
                    InputProps={{disableUnderline: true}}
                  />
                )}
              />
            </ProposalFormInput>
          </Grid>
          <Grid item>
            <ProposalFormInput label={"Slash division value"}>
              <Controller
                control={methods.control}
                name={`slash_division_value`}
                render={({field}) => (
                  <TextField
                    {...field}
                    type="number"
                    placeholder="Slash division value"
                    InputProps={{disableUnderline: true}}
                  />
                )}
              />
            </ProposalFormInput>
          </Grid>
          <Grid item>
            <ProposalFormInput label={"Slash scale value"}>
              <Controller
                control={methods.control}
                name={`slash_scale_value`}
                render={({field}) => (
                  <TextField
                    {...field}
                    type="number"
                    placeholder="Slash scale value"
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
      </ResponsiveDialog>
    </FormProvider>
  )
    ;
};
