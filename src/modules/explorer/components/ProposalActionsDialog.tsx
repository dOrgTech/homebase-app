/* eslint-disable react/display-name */
import { Grid, styled, Button, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import { RegistryProposalFormValues } from "modules/explorer/components/UpdateRegistryDialog"
import { TreasuryProposalFormValues } from "modules/explorer/components/NewTreasuryProposalDialog"
import React, { useState } from "react"
import { useDAO } from "services/indexer/dao/hooks/useDAO"
import { NFTTransferFormValues } from "./NFTTransfer"
import { useDAOID } from "../pages/DAO/router"
import { ProposalFormContainer } from "./ProposalForm"
import { ConfigProposalForm } from "./ConfigProposalForm"
import { ResponsiveDialog } from "./ResponsiveDialog"
import { GuardianChangeProposalForm } from "./GuardianChangeProposalForm"
import { DelegationChangeProposalForm } from "./DelegationChangeProposalForm"
import { MainButton } from "../../common/MainButton"
import { SupportedLambdaProposalKey } from "services/bakingBad/lambdas"
import { ProposalAction, ProposalFormLambda } from "modules/explorer/components/ConfigProposalFormLambda"

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>
}

type Values = {
  agoraPostId: string
} & TreasuryProposalFormValues &
  RegistryProposalFormValues &
  NFTTransferFormValues

export type ProposalFormDefaultValues = RecursivePartial<Values>

const OptionContainer = styled(Grid)(({ theme }) => ({
  "minHeight": 80,
  "background": theme.palette.primary.main,
  "borderRadius": 8,
  "padding": "35px 42px",
  "marginBottom": 16,
  "cursor": "pointer",
  "height": 110,
  "&:hover": {
    background: theme.palette.secondary.dark,
    scale: 1.01,
    transition: "0.15s ease-in"
  }
}))

const ActionText = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  fontSize: 20,
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
    name: "Add Lambda",
    description: "Write Michelson code to add Lambda",
    id: ProposalAction.new,
    isLambda: true
  },
  {
    name: "Remove Lambda",
    description: "Choose which Lambda to remove",
    id: ProposalAction.remove,
    isLambda: true
  },
  {
    name: "Execute Lambda",
    description: "Execute a Lambda already installed on DAO",
    id: ProposalAction.execute,
    isLambda: true
  },
  {
    name: "DAO Configuration",
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

export const ProposalActionsDialog: React.FC<Props> = ({ open, handleClose }) => {
  const daoId = useDAOID()
  const { data: dao } = useDAO(daoId)
  const [proposalAction, setProposalAction] = useState<ProposalAction>(ProposalAction.none)
  const [openProposalFormLambda, setOpenProposalFormLambda] = useState(false)
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))

  const handleOpenCustomProposalModal = (key: ProposalAction) => {
    setProposalAction(key)
    setOpenProposalFormLambda(true)
    handleClose()
  }

  const handleCloseCustomProposalModal = () => {
    setProposalAction(ProposalAction.none)
    setOpenProposalFormLambda(false)
    handleClose()
  }

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
      <ResponsiveDialog open={open} onClose={handleClose} title={"New Proposal"} template="xs">
        <Grid container style={{ marginTop: 32 }} spacing={2}>
          {getActions().map((elem, index) => (
            <Grid key={index} item xs={isMobileSmall ? 12 : 4}>
              <OptionContainer
                onClick={() =>
                  elem.isLambda
                    ? handleOpenCustomProposalModal(elem.id)
                    : handleOpenSupportedExecuteProposalModal(elem.id)
                }
              >
                <ActionText color="textPrimary">{elem.name}</ActionText>
                <ActionDescriptionText color="textPrimary"> {elem.description} </ActionDescriptionText>
              </OptionContainer>
            </Grid>
          ))}
        </Grid>
      </ResponsiveDialog>

      <ProposalFormLambda
        action={proposalAction}
        open={openProposalFormLambda}
        handleClose={handleCloseCustomProposalModal}
      />
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
