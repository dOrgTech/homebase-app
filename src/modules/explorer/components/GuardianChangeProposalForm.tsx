/* eslint-disable react/display-name */
import { Grid, styled, Typography, TextField } from "@material-ui/core"
import React, { useCallback, useEffect, useMemo } from "react"
import { useDAO } from "services/indexer/dao/hooks/useDAO"
import { SendButton } from "./ProposalFormSendButton"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { useDAOID } from "../pages/DAO/router"
import { ProposalFormInput } from "./ProposalFormInput"
import { useProposeGuardianChange } from "../../../services/contracts/baseDAO/hooks/useProposeGuardianChange"
import { ResponsiveDialog } from "./ResponsiveDialog"

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>
}

type Values = {
  newGuardianAddress: string
}

export type ProposalFormDefaultValues = RecursivePartial<Values>

interface Props {
  open: boolean
  handleClose: () => void
  defaultValues?: ProposalFormDefaultValues
  defaultTab?: number
}

const Content = styled(Grid)({})

export const GuardianChangeProposalForm: React.FC<Props> = ({ open, handleClose, defaultValues }) => {
  const daoId = useDAOID()
  const { data: dao } = useDAO(daoId)

  const methods = useForm<Values>({
    defaultValues: useMemo(
      () => ({
        newGuardianAddress: "",
        ...defaultValues
      }),
      [defaultValues]
    )
    // resolver: yupResolver(validationSchema as any),
  })

  const newGuardianAddress = methods.watch("newGuardianAddress")

  useEffect(() => {
    methods.reset(defaultValues)
  }, [defaultValues, methods])

  const { mutate } = useProposeGuardianChange()

  const onSubmit = useCallback(
    (values: Values) => {
      if (dao) {
        mutate({ dao, newGuardianAddress: values.newGuardianAddress })
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
        title={"Update Guardian"}
      >
        <Content container direction={"column"} style={{ gap: 18 }}>
          {dao && (
            <Grid item>
              <Typography color={"inherit"} style={{ marginBottom: "7px" }}>
                Current Guardian:{" "}
                <span style={{ fontWeight: 300, fontSize: "16px", marginLeft: "-5px" }}>{dao.data.guardian}</span>
              </Typography>
            </Grid>
          )}
          <Grid item>
            <ProposalFormInput label={"New Guardian Address"}>
              <Controller
                control={methods.control}
                name={`newGuardianAddress`}
                render={({ field }) => (
                  <TextField {...field} type="text" placeholder=" tz1..." InputProps={{ disableUnderline: true }} />
                )}
              />
            </ProposalFormInput>
          </Grid>

          <Grid item>
            <Typography align="left" variant="subtitle2" color="textPrimary" display={"inline"}>
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

          <SendButton onClick={methods.handleSubmit(onSubmit as any)} disabled={!dao || !newGuardianAddress}>
            Submit
          </SendButton>
        </Content>
      </ResponsiveDialog>
    </FormProvider>
  )
}
