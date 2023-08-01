/* eslint-disable react/display-name */
import { Grid, Typography, TextField, styled } from "@material-ui/core"
import React, { useCallback } from "react"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { SendButton } from "./ProposalFormSendButton"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { useDAOID } from "../pages/DAO/router"
import { ProposalFormInput } from "./ProposalFormInput"
import { useProposeConfigChange } from "../../../services/contracts/baseDAO/hooks/useProposeConfigChange"
import { ResponsiveDialog } from "./ResponsiveDialog"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"

const ErrorText = styled(Typography)({
  fontSize: 14,
  color: "red"
})

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>
}

type Values = {
  frozen_extra_value: string
  returnedPercentage: string
}

export type ProposalFormDefaultValues = RecursivePartial<Values>

interface Props {
  open: boolean
  handleClose: () => void
  defaultValues?: ProposalFormDefaultValues
  defaultTab?: number
}

const validationSchema = yup.object({
  frozen_extra_value: yup.number().typeError("Amount must be a number"),
  returnedPercentage: yup
    .number()
    .min(0, "Cannot be lesser than 0")
    .max(100, "Cannot be greater than 100")
    .typeError("Amount must be a number")
})

export const ConfigProposalForm: React.FC<Props> = ({ open, handleClose }) => {
  const daoId = useDAOID()
  const { data: dao } = useDAO(daoId)

  const methods = useForm<Values>({ resolver: yupResolver(validationSchema) })

  const {
    formState: { errors }
  } = methods

  const { mutate } = useProposeConfigChange()

  const onSubmit = useCallback(
    (values: Values) => {
      if (dao) {
        const mutateValues = {
          frozen_extra_value: values.frozen_extra_value,
          slash_scale_value: !Number.isNaN(parseInt(values.returnedPercentage))
            ? 100 - Number(values.returnedPercentage)
            : NaN
        }

        Object.entries(mutateValues).map(([key, value]) => {
          if (Number.isNaN(value)) {
            delete mutateValues[key as keyof typeof mutateValues]
          }
        })

        mutate({
          dao,
          args: mutateValues
        })
        methods.reset()
        handleClose()
      }
    },
    [dao, mutate, methods, handleClose]
  )

  return (
    <FormProvider {...methods}>
      <ResponsiveDialog open={open} onClose={handleClose} title={"Fee Configuration"}>
        <Grid container direction={"column"} style={{ gap: 18 }}>
          <Grid item>
            <Typography style={{ fontWeight: 300, fontSize: "16px" }} color={"secondary"}>
              All fields are optional. Leave empty what you wish to leave unchanged
            </Typography>
          </Grid>
          {/* <Grid item>
            <ProposalFormInput label={`Proposal Title`}>
              <Controller
                control={methods.control}
                name={`to_be_changed`}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    placeholder="Change Proposal Fee"
                    InputProps={{ disableUnderline: true }}
                  />
                )}
              />
            </ProposalFormInput>
          </Grid> */}
          <Grid item>
            <ProposalFormInput label={`Proposal Fee`}>
              <Controller
                control={methods.control}
                name={`frozen_extra_value`}
                render={({ field }) => (
                  <TextField {...field} type="number" placeholder="0" InputProps={{ disableUnderline: true }} />
                )}
              />
            </ProposalFormInput>
            <Grid item style={{ marginTop: 12 }}>
              <Typography align="left" variant="subtitle2" color="textPrimary" display={"inline"}>
                Current:{" "}
              </Typography>
              <Typography
                align="left"
                variant="subtitle2"
                color="secondary"
                display={"inline"}
                style={{ fontWeight: 300 }}
              >
                {dao && dao?.data.extra.frozen_extra_value.toString()} {dao ? dao.data.token.symbol : ""}
              </Typography>
            </Grid>
          </Grid>
          <Grid item>
            <ProposalFormInput label={`Percentage of tokens returned after rejection`}>
              <Controller
                control={methods.control}
                name={`returnedPercentage`}
                render={({ field }) => (
                  <TextField {...field} type="number" placeholder="0" InputProps={{ disableUnderline: true }} />
                )}
              />
            </ProposalFormInput>
            <ErrorText>{errors.returnedPercentage?.message}</ErrorText>
            <Grid item style={{ marginTop: 12 }}>
              <Typography align="left" variant="subtitle2" color="textPrimary" display={"inline"}>
                Current:{" "}
              </Typography>
              <Typography
                align="left"
                variant="subtitle2"
                color="secondary"
                display={"inline"}
                style={{ fontWeight: 300 }}
              >
                {dao && dao?.data.extra.returnedPercentage.toString()}%
              </Typography>
            </Grid>
          </Grid>
          <Grid item container direction="row" alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography
                style={{ fontWeight: 500 }}
                align="left"
                variant="subtitle2"
                color="textPrimary"
                display={"inline"}
              >
                Proposal Fee:{" "}
              </Typography>
              <Typography
                align="left"
                variant="subtitle2"
                color="secondary"
                display={"inline"}
                style={{ fontWeight: 300 }}
              >
                {dao && dao.data.extra.frozen_extra_value.toString()} {dao ? dao.data.token.symbol : ""}
              </Typography>
            </Grid>
            <Grid item>
              <SendButton onClick={methods.handleSubmit(onSubmit as any)} disabled={!dao}>
                Submit
              </SendButton>
            </Grid>
          </Grid>
        </Grid>
      </ResponsiveDialog>
    </FormProvider>
  )
}
