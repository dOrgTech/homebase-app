import { Grid, styled, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import { RegistryProposalFormValues } from "modules/explorer/components/UpdateRegistryDialog"
import { TreasuryProposalFormValues } from "modules/explorer/components/NewTreasuryProposalDialog"
import React, { useState } from "react"
import { SupportedLambdaProposalKey } from "services/bakingBad/lambdas"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { useIsProposalButtonDisabled } from "services/contracts/baseDAO/hooks/useCycleInfo"
import { useDAOID } from "../router"
import { ResponsiveDialog } from "modules/explorer/components/ResponsiveDialog"
import { ConfigProposalForm } from "modules/explorer/components/ConfigProposalForm"
import { GuardianChangeProposalForm } from "modules/explorer/components/GuardianChangeProposalForm"
import { DelegationChangeProposalForm } from "modules/explorer/components/DelegationChangeProposalForm"

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>
}

type Values = {
  agoraPostId: string
} & TreasuryProposalFormValues &
  RegistryProposalFormValues

export type ProposalFormDefaultValues = RecursivePartial<Values>

const OptionContainer = styled(Grid)(({ theme }) => ({
  "minHeight": 80,
  "background": theme.palette.primary.main,
  "borderRadius": 8,
  "padding": "35px 42px",
  "marginBottom": 16,
  "cursor": "pointer",
  "height": 110,
  "&:hover:enabled": {
    background: theme.palette.secondary.dark,
    scale: 1.01,
    transition: "0.15s ease-in"
  }
}))

const ActionText = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: 18,
  marginBottom: 8
}))

const ActionDescriptionText = styled(Typography)(({ theme }) => ({
  fontWeight: 300,
  fontSize: 16
}))

interface Action {
  id: any
  name: string
  description: string
  isLambda: boolean
}

const getActions = (): Action[] => [
  {
    name: "Fee Configuration",
    description: "Change proposal fee and returned token amount",
    id: SupportedLambdaProposalKey.ConfigurationProposal,
    isLambda: false
  },
  {
    name: "Change Guardian",
    description: "Change the DAO Guardian Address",
    id: SupportedLambdaProposalKey.UpdateGuardianProposal,
    isLambda: false
  },
  {
    name: "Change Delegate",
    description: "Change the DAO Delegate Address",
    id: SupportedLambdaProposalKey.UpdateContractDelegateProposal,
    isLambda: false
  }
]

interface Props {
  open: boolean
  handleClose: () => void
}

const defaultOpenSupportedExecuteProposalModal = "none"

export const SettingsDialog: React.FC<Props> = ({ open, handleClose }) => {
  const daoId = useDAOID()
  const { data } = useDAO(daoId)
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))

  const liteDAOId = data?.liteDAOData?._id
  const shouldDisable = useIsProposalButtonDisabled(daoId)

  const handleOpenSupportedExecuteProposalModal = (lambdaKey: string) => {
    setOpenSupportedExecuteProposalModal(lambdaKey)
    handleClose()
  }

  const handleCloseSupportedExecuteProposalModal = () => {
    setOpenSupportedExecuteProposalModal(defaultOpenSupportedExecuteProposalModal)
    handleClose()
  }

  const [openSupportedExecuteProposalModalKey, setOpenSupportedExecuteProposalModal] = useState<string>(
    defaultOpenSupportedExecuteProposalModal
  )

  return (
    <>
      <ResponsiveDialog open={open} onClose={handleClose} title={"Change Settings"} template="xs">
        <Grid container spacing={2}>
          {getActions().map((elem, index) =>
            !liteDAOId && elem.id === "off-chain" ? null : (
              <Grid key={index} item xs={isMobileSmall ? 12 : 4}>
                <OptionContainer
                  onClick={() => (!shouldDisable ? handleOpenSupportedExecuteProposalModal(elem.id) : null)}
                >
                  <ActionText color={shouldDisable && elem.id !== "off-chain" ? "textSecondary" : "textPrimary"}>
                    {elem.name}
                  </ActionText>
                  <ActionDescriptionText
                    color={shouldDisable && elem.id !== "off-chain" ? "textSecondary" : "textPrimary"}
                  >
                    {elem.description}{" "}
                  </ActionDescriptionText>
                </OptionContainer>
              </Grid>
            )
          )}
        </Grid>
      </ResponsiveDialog>

      <ConfigProposalForm
        open={openSupportedExecuteProposalModalKey === SupportedLambdaProposalKey.ConfigurationProposal}
        handleClose={handleCloseSupportedExecuteProposalModal}
      />
      <GuardianChangeProposalForm
        open={openSupportedExecuteProposalModalKey === SupportedLambdaProposalKey.UpdateGuardianProposal}
        handleClose={handleCloseSupportedExecuteProposalModal}
      />

      <DelegationChangeProposalForm
        open={openSupportedExecuteProposalModalKey === SupportedLambdaProposalKey.UpdateContractDelegateProposal}
        handleClose={handleCloseSupportedExecuteProposalModal}
      />
    </>
  )
}
