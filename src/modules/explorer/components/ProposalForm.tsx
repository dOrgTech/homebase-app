/* eslint-disable react/display-name */
import { Grid, styled, Typography, TextField } from "@material-ui/core"
import {
  registryProposalFormInitialState,
  RegistryProposalFormValues,
  UpdateRegistryDialog
} from "modules/explorer/components/UpdateRegistryDialog"
import {
  Asset,
  NewTreasuryProposalDialog,
  treasuryProposalFormInitialState,
  TreasuryProposalFormValues
} from "modules/explorer/components/NewTreasuryProposalDialog"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { AppTabBar } from "./AppTabBar"
import { SendButton } from "./ProposalFormSendButton"
import { TabPanel } from "./TabPanel"
import { useDAOHoldings } from "services/contracts/baseDAO/hooks/useDAOHoldings"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { DAOTemplate } from "modules/creator/state"
import { useRegistryPropose } from "services/contracts/baseDAO/hooks/useRegistryPropose"
import { BaseDAO } from "services/contracts/baseDAO"
import { NFTTransferForm, nftTransferFormInitialState, NFTTransferFormValues } from "./NFTTransfer"
import { Token } from "models/Token"
import { useDAOID } from "../pages/DAO/router"
import { ProposalFormInput } from "./ProposalFormInput"
import { ProposalFormResponsiveDialog } from "./ResponsiveDialog"
import { LambdaDAO } from "services/contracts/baseDAO/lambdaDAO"
import CloseButton from "modules/common/CloseButton"
import { ReactComponent as SwapIcon } from "assets/img/swap.svg"

const CustomContainer = styled(Grid)({
  padding: "42px 54px 0px 54px"
})

const IconSwap = styled(SwapIcon)({
  marginLeft: 16,
  marginRight: 16,
  cursor: "pointer"
})

const DialogTitle = styled(Typography)({
  fontSize: 20,
  fontWeight: 500,
  textTransform: "capitalize"
})

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>
}

type Values = {
  agoraPostId: string
} & TreasuryProposalFormValues &
  RegistryProposalFormValues &
  NFTTransferFormValues

export type ProposalFormDefaultValues = RecursivePartial<Values>

interface Props {
  open: boolean
  handleClose: () => void
  defaultValues?: ProposalFormDefaultValues
  defaultTab: number
  handleChangeTab?: (value: number) => void
}

const enabledForms: Record<
  DAOTemplate,
  {
    label: string
    component: React.FC<{ open: boolean }>
  }[]
> = {
  "lambda": [
    {
      label: "TRANSFER FUNDS",
      component: ({ open }) => <NewTreasuryProposalDialog open={open} />
    },
    {
      label: "TRANSFER NFTs",
      component: ({ open }) => <NFTTransferForm open={open} />
    },
    {
      label: "UPDATE REGISTRY",
      component: ({ open }) => <UpdateRegistryDialog open={open} />
    }
  ],
  "": [],
  "lite": []
}

const Content = styled(Grid)({
  padding: "0 54px",
  paddingBottom: 24
})

const SwapText = styled(Typography)({
  opacity: 0.65
})

export const ProposalFormContainer: React.FC<Props> = ({
  open,
  handleClose,
  defaultValues,
  defaultTab,
  handleChangeTab
}) => {
  const daoId = useDAOID()
  const { data: dao } = useDAO(daoId)
  const { data: daoHoldings } = useDAOHoldings(daoId)
  const [state, setState] = useState(defaultTab)

  const methods = useForm<Values>({
    defaultValues: useMemo(
      () => ({
        agoraPostId: "0",
        ...treasuryProposalFormInitialState,
        ...nftTransferFormInitialState,
        ...registryProposalFormInitialState,
        ...defaultValues
      }),
      [defaultValues]
    )
    // resolver: yupResolver(validationSchema as any),
  })

  useEffect(() => {
    methods.reset({
      agoraPostId: "0",
      ...treasuryProposalFormInitialState,
      ...nftTransferFormInitialState,
      ...registryProposalFormInitialState,
      ...defaultValues
    })
  }, [defaultValues, methods])

  const forms = enabledForms[dao?.data.type || "lambda"]
  const { mutate: registryMutate } = useRegistryPropose()

  const onSubmit = useCallback(
    (values: Values) => {
      const agoraPostId = Number(values.agoraPostId)

      const mappedTransfers = [...values.transferForm.transfers, ...values.nftTransferForm.transfers]
        .filter(transfer => !!transfer.amount && !!transfer.asset && !!transfer.recipient)
        .map(transfer => {
          const type = (transfer.asset as Token).standard === "fa2" ? "FA2" : "FA1.2"
          return (transfer.asset as Asset).symbol === "XTZ"
            ? { ...transfer, amount: transfer.amount, type: "XTZ" as const }
            : {
                ...transfer,
                amount: transfer.amount,
                asset: transfer.asset as Token,
                type: type
              }
        })

      const mappedList = values.registryUpdateForm.list.filter(item => !!item.key && !!item.value)

      if ((dao as BaseDAO).data.type === "lambda") {
        registryMutate({
          dao: dao as LambdaDAO,
          args: {
            agoraPostId,
            transfer_proposal: {
              transfers: mappedTransfers,
              registry_diff: mappedList
            }
          }
        })
      }

      methods.reset()
      handleClose()
    },
    [dao, handleClose, methods, registryMutate]
  )

  const getLabel = (selectedTab: number) => {
    switch (selectedTab) {
      case 0:
        return "NFT"
      case 1:
        return "Funds"
      case 2:
        return ""
    }
  }

  const changeTab = (state: number) => {
    setState(state)
    if (state === 0) {
      handleChangeTab?.(1)
    } else if (state === 1) {
      handleChangeTab?.(0)
    } else {
      return
    }
  }

  return (
    <FormProvider {...methods}>
      <ProposalFormResponsiveDialog open={open} onClose={handleClose}>
        {dao && daoHoldings && (
          <>
            <CustomContainer container direction="row" justifyContent="space-between" alignItems="center">
              <Grid item container direction="row" alignItems="center" style={{ width: "80%" }}>
                <DialogTitle>{forms[defaultTab].label.toLowerCase()}</DialogTitle>
                {defaultTab === 0 || defaultTab === 1 ? <IconSwap onClick={() => changeTab(defaultTab)} /> : null}
                <SwapText>{getLabel(defaultTab)}</SwapText>
              </Grid>
              <Grid item>
                <CloseButton onClose={handleClose} />
              </Grid>
            </CustomContainer>
            {forms.map((form, i) => (
              <TabPanel key={`tab-${i}`} value={defaultTab} index={i}>
                <form.component open={open} />
              </TabPanel>
            ))}

            <Content container direction={"column"} style={{ gap: 20 }}>
              <Grid item>
                <ProposalFormInput label={"Agora Post ID"}>
                  <Controller
                    control={methods.control}
                    name={`agoraPostId`}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        placeholder="Type an Agora Post ID"
                        InputProps={{ disableUnderline: true }}
                      />
                    )}
                  />
                </ProposalFormInput>
              </Grid>
              <Grid item container direction="row" alignItems="center" justifyContent="space-between">
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

                <Grid item>
                  <SendButton onClick={methods.handleSubmit(onSubmit as any)} disabled={!dao || !daoHoldings}>
                    Submit
                  </SendButton>
                </Grid>
              </Grid>
            </Content>
          </>
        )}
      </ProposalFormResponsiveDialog>
    </FormProvider>
  )
}
