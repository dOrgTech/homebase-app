/* eslint-disable react/display-name */
import { Grid, styled, Typography, TextField } from "@material-ui/core"
import React, { useCallback, useEffect, useMemo } from "react"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { SendButton } from "./ProposalFormSendButton"
import { useDAOHoldings } from "services/contracts/baseDAO/hooks/useDAOHoldings"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { useDAOID } from "../pages/DAO/router"
import { ProposalFormInput } from "./ProposalFormInput"
import { ResponsiveDialog } from "./ResponsiveDialog"
import { useProposeDelegationChange } from "services/contracts/baseDAO/hooks/useProposeDelegationChange"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { validateContractAddress, validateAddress } from "@taquito/utils"
import { useDelegate } from "services/contracts/baseDAO/hooks/useDelegate"

const ErrorText = styled(Typography)({
  fontSize: 14,
  color: "red"
})

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>
}

type Values = {
  newDelegationAddress: string
}

export type ProposalFormDefaultValues = RecursivePartial<Values>

interface Props {
  open: boolean
  handleClose: () => void
  defaultValues?: ProposalFormDefaultValues
  defaultTab?: number
}

const Content = styled(Grid)({
  padding: "10px 0"
})

const isInvalidKtOrTzAddress = (address: string | undefined) => {
  if (address !== undefined) {
    return validateContractAddress(address) !== 3 && validateAddress(address) !== 3 ? false : true
  }
  return false
}

const validationSchema = yup.object({
  newDelegationAddress: yup
    .string()
    .test("is-valid-address", "Must be a valid address", value => isInvalidKtOrTzAddress(value))
})

export const DelegationChangeProposalForm: React.FC<Props> = ({ open, handleClose, defaultValues }) => {
  const daoId = useDAOID()
  const { data: dao } = useDAO(daoId)

  const currentDelegate = useDelegate(dao && dao?.data.address ? dao?.data.address : "")
  const methods = useForm<Values>({
    defaultValues: useMemo(
      () => ({
        newDelegationAddress: "",
        ...defaultValues
      }),
      [defaultValues]
    ),
    resolver: yupResolver(validationSchema)
  })

  const {
    formState: { errors }
  } = methods

  const newDelegationAddress = methods.watch("newDelegationAddress")

  useEffect(() => {
    methods.reset(defaultValues)
  }, [defaultValues, methods])

  const { mutate } = useProposeDelegationChange()

  const onSubmit = useCallback(
    (values: Values) => {
      if (dao) {
        mutate({ dao, newDelegationAddress: values.newDelegationAddress })
        handleClose()
      }
    },
    [dao, handleClose, mutate]
  )

  return (
    <FormProvider {...methods}>
      <ResponsiveDialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        title={"Change Delegate"}
      >
        <Content container direction={"column"} style={{ gap: 18 }}>
          {dao && (
            <Grid item>
              <Typography color={"inherit"} style={{ marginBottom: "7px" }}>
                Current Delegate:{" "}
              </Typography>
              <Typography variant="subtitle2" color="secondary">
                {currentDelegate && currentDelegate.data && currentDelegate.data.address
                  ? currentDelegate.data.address
                  : "-"}
              </Typography>
            </Grid>
          )}

          <Grid item>
            <ProposalFormInput label={"New Delegate Address"}>
              <Controller
                control={methods.control}
                name={`newDelegationAddress`}
                render={({ field }) => (
                  <TextField {...field} type="text" placeholder=" tz1..." InputProps={{ disableUnderline: true }} />
                )}
              />
            </ProposalFormInput>
            <ErrorText>{errors.newDelegationAddress?.message}</ErrorText>
          </Grid>

          <Grid container direction="row" alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography align="left" variant="subtitle2" color="textPrimary" display={"inline"}>
                Proposal Fee:{" "}
              </Typography>
              <Typography align="left" variant="subtitle2" color="secondary" display={"inline"}>
                {dao && dao.data.extra.frozen_extra_value.toString()} {dao ? dao.data.token.symbol : ""}
              </Typography>
            </Grid>

            <Grid>
              <SendButton onClick={methods.handleSubmit(onSubmit as any)} disabled={!dao || !newDelegationAddress}>
                Submit
              </SendButton>
            </Grid>
          </Grid>
        </Content>
      </ResponsiveDialog>
    </FormProvider>
  )
}
