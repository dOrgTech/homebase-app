import { Grid, styled, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import { RegistryProposalFormValues } from "modules/explorer/components/UpdateRegistryDialog"
import { TreasuryProposalFormValues } from "modules/explorer/components/NewTreasuryProposalDialog"
import React, { useCallback, useEffect, useState } from "react"
import { NFTTransferFormValues } from "./NFTTransfer"
import { useDAOID } from "../pages/DAO/router"
import { ConfigProposalForm } from "./ConfigProposalForm"
import { ResponsiveDialog } from "./ResponsiveDialog"
import { GuardianChangeProposalForm } from "./GuardianChangeProposalForm"
import { DelegationChangeProposalForm } from "./DelegationChangeProposalForm"
import { SupportedLambdaProposalKey } from "services/bakingBad/lambdas"
import { ProposalAction, ProposalFormLambda } from "modules/explorer/components/ConfigProposalFormLambda"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { ProposalCreatorModal } from "modules/lite/explorer/pages/CreateProposal/ProposalCreatorModal"
import { useIsProposalButtonDisabled } from "services/contracts/baseDAO/hooks/useCycleInfo"
import { ProposalFormContainer } from "./ProposalForm"
import { useQueryParams } from "../hooks/useQueryParams"
import { EvmProposalsActionDialog } from "modules/etherlink/explorer/EvmProposalsActionDialog"

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>
}

type Values = {
  agoraPostId: string
} & TreasuryProposalFormValues &
  RegistryProposalFormValues &
  NFTTransferFormValues

export type ProposalFormDefaultValues = RecursivePartial<Values>

// TODO: Move this to a shared component
const OptionContainer = styled(Grid)(({ theme }) => ({
  "minHeight": 80,
  "background": theme.palette.primary.main,
  "borderRadius": 8,
  "padding": "35px 42px",
  "marginBottom": 16,
  "cursor": "pointer",
  "height": 80,
  "&:hover:enabled": {
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

const TitleContainer = styled(Grid)({
  marginBottom: 24
})

interface Action {
  id: any
  name: string
  description: string
  isLambda: boolean
}

interface GenericAction {
  name: string
  description: string
  id: string
}

const getActions = (): Action[] => [
  {
    name: "Fee Configuration",
    description: "Change proposal fee and returned token amount.",
    id: SupportedLambdaProposalKey.ConfigurationProposal,
    isLambda: false
  },
  {
    name: "Change Guardian",
    description: "Change the DAO Guardian Address.",
    id: SupportedLambdaProposalKey.UpdateGuardianProposal,
    isLambda: false
  },
  {
    name: "Change Delegate",
    description: "Change the DAO Delegate Address.",
    id: SupportedLambdaProposalKey.UpdateContractDelegateProposal,
    isLambda: false
  },
  {
    name: "Add Function",
    description: "Write Michelson code to add Function.",
    id: ProposalAction.new,
    isLambda: true
  },
  {
    name: "Remove Function",
    description: "Choose which Function to remove.",
    id: ProposalAction.remove,
    isLambda: true
  },
  {
    name: "Execute Function",
    description: "Execute a Function already installed on DAO.",
    id: ProposalAction.execute,
    isLambda: true
  },
  {
    name: "Arbitrary Contract Interaction",
    description: "Interact with any contract on Tezos.",
    id: ProposalAction.aci,
    isLambda: true
  },
  {
    name: "Off Chain Poll",
    description: "Create an off-chain poll for your community.",
    id: "off-chain",
    isLambda: true
  }
]

const getTreasuryActions = (): GenericAction[] => [
  {
    name: "Transfer Tokens",
    description: "Transfer tokens from the DAO Treasury to another account.",
    id: "token"
  },
  {
    name: "Transfer NFTs",
    description: "Transfer NFTs from the DAO Treasury to another account.",
    id: "nft"
  },
  {
    name: "Edit Registry",
    description: "Add or edit a registry item.",
    id: "registry"
  }
]

const defaultOpenSupportedExecuteProposalModal = "none"

const ProposalActionsDialogForTezos: React.FC<{
  open: boolean
  handleClose: () => void
  queryType?: string
}> = ({ open, handleClose, queryType }) => {
  const daoId = useDAOID()
  const { data } = useDAO(daoId)
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))
  const { clearParams } = useQueryParams()

  const [proposalAction, setProposalAction] = useState<ProposalAction>(ProposalAction.none)
  const [openProposalFormLambda, setOpenProposalFormLambda] = useState(false)
  const [openLiteProposal, setOpenLiteProposal] = useState(false)
  const [proposalTreasuryAction, setProposalTreasuryAction] = useState<string>("none")

  const liteDAOId = data?.liteDAOData?._id
  const shouldDisable = useIsProposalButtonDisabled(daoId)
  const proposalActions = getActions()

  const handleOpenCustomProposalModal = useCallback(
    (key: ProposalAction) => {
      setProposalAction(key)
      setOpenProposalFormLambda(true)
      handleClose()
    },
    [handleClose]
  )

  const handleCloseCustomProposalModal = () => {
    clearParams()
    setProposalAction(ProposalAction.none)
    setOpenProposalFormLambda(false)
    handleClose()
  }

  const handleOpenSupportedExecuteProposalModal = (lambdaKey: string) => {
    setOpenSupportedExecuteProposalModal(lambdaKey)
    handleClose()
  }

  const handleCloseSupportedExecuteProposalModal = () => {
    setOpenLiteProposal(false)
    setOpenSupportedExecuteProposalModal(defaultOpenSupportedExecuteProposalModal)
    handleClose()
  }

  const handleLiteProposal = () => {
    setOpenLiteProposal(true)
    handleClose()
  }

  const handleTreasuryProposal = (treasuryKey: string) => {
    setProposalTreasuryAction(treasuryKey)
    handleClose()
  }

  const handleCloseTreasury = () => {
    setProposalTreasuryAction(defaultOpenSupportedExecuteProposalModal)
    handleClose()
  }

  const handleAciProposal = () => {
    handleOpenCustomProposalModal(ProposalAction.aci)
    handleClose()
  }

  const [openSupportedExecuteProposalModalKey, setOpenSupportedExecuteProposalModal] = useState<string>(
    defaultOpenSupportedExecuteProposalModal
  )
  useEffect(() => {
    if (queryType === "add-function") {
      handleOpenCustomProposalModal(ProposalAction.new)
    }
  }, [handleOpenCustomProposalModal, queryType])

  useEffect(() => {
    if (queryType === "add-function") {
      handleOpenCustomProposalModal(ProposalAction.new)
    }
  }, [handleOpenCustomProposalModal, queryType])

  return (
    <>
      <ResponsiveDialog open={open} onClose={handleClose} title={"New Proposal"} template="xs">
        <Grid container>
          <TitleContainer container direction="row">
            <Typography color="textPrimary">Configuration Proposal</Typography>
          </TitleContainer>
          <Grid container spacing={2}>
            {proposalActions.slice(0, 3).map((elem, index) =>
              !liteDAOId && elem.id === "off-chain" ? null : (
                <Grid key={index} item xs={isMobileSmall ? 12 : 4}>
                  <OptionContainer
                    onClick={() =>
                      elem.id === "off-chain"
                        ? handleLiteProposal()
                        : !shouldDisable
                        ? elem.isLambda
                          ? handleOpenCustomProposalModal(elem.id)
                          : handleOpenSupportedExecuteProposalModal(elem.id)
                        : null
                    }
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
        </Grid>
        <Grid container>
          <TitleContainer container direction="row">
            <Typography color="textPrimary">Treasury Proposal</Typography>
          </TitleContainer>
          <Grid container spacing={2}>
            {getTreasuryActions()
              .filter(item => item.id !== "registry")
              .map((elem, index) => (
                <Grid key={index} item xs={isMobileSmall ? 12 : 4}>
                  <OptionContainer onClick={() => (shouldDisable ? null : handleTreasuryProposal(elem.id))}>
                    <ActionText color={shouldDisable ? "textSecondary" : "textPrimary"}>{elem.name}</ActionText>
                    <ActionDescriptionText color={shouldDisable ? "textSecondary" : "textPrimary"}>
                      {elem.description}{" "}
                    </ActionDescriptionText>
                  </OptionContainer>
                </Grid>
              ))}
          </Grid>
        </Grid>
        <Grid container>
          <TitleContainer container direction="row">
            <Typography color="textPrimary">Off-Chain Proposal</Typography>
          </TitleContainer>
          <Grid container spacing={2}>
            {proposalActions
              .filter(item => item.id === "off-chain")
              .map((elem, index) =>
                !liteDAOId && elem.id !== "off-chain" ? null : (
                  <Grid key={index} item xs={isMobileSmall ? 12 : 4}>
                    <OptionContainer onClick={() => handleLiteProposal()}>
                      <ActionText color={"textPrimary"}>{elem.name}</ActionText>
                      <ActionDescriptionText color={"textPrimary"}>{elem.description} </ActionDescriptionText>
                    </OptionContainer>
                  </Grid>
                )
              )}
          </Grid>
        </Grid>
        <Grid container>
          <TitleContainer container direction="row">
            <Typography color="textPrimary">Arbitrary Contract Interaction</Typography>
          </TitleContainer>
          <Grid container spacing={2}>
            <Grid item xs={isMobileSmall ? 12 : 4}>
              <OptionContainer onClick={() => !shouldDisable && handleAciProposal()}>
                <ActionText color={shouldDisable ? "textSecondary" : "textPrimary"}>Contract Call</ActionText>
                <ActionDescriptionText color={shouldDisable ? "textSecondary" : "textPrimary"}>
                  Invoke an endpoint on a deployed contract
                </ActionDescriptionText>
              </OptionContainer>
            </Grid>
          </Grid>
        </Grid>
        <Grid container>
          <TitleContainer container direction="row">
            <Typography color="textPrimary">Function Proposal</Typography>
          </TitleContainer>
          <Grid container spacing={2}>
            {proposalActions.slice(3, 6).map((elem, index) =>
              !liteDAOId && elem.id === "off-chain" ? null : (
                <Grid key={index} item xs={isMobileSmall ? 12 : 4}>
                  <OptionContainer
                    onClick={() =>
                      elem.id === "off-chain"
                        ? handleLiteProposal()
                        : !shouldDisable
                        ? elem.isLambda
                          ? handleOpenCustomProposalModal(elem.id)
                          : handleOpenSupportedExecuteProposalModal(elem.id)
                        : null
                    }
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
        </Grid>
        <Grid container>
          <TitleContainer container direction="row">
            <Typography color="textPrimary">Registry Proposal</Typography>
          </TitleContainer>
          <Grid container spacing={2}>
            {getTreasuryActions()
              .filter(item => item.id === "registry")
              .map((elem, index) => (
                <Grid key={index} item xs={isMobileSmall ? 12 : 4}>
                  <OptionContainer onClick={() => (shouldDisable ? null : handleTreasuryProposal(elem.id))}>
                    <ActionText color={shouldDisable ? "textSecondary" : "textPrimary"}>{elem.name}</ActionText>
                    <ActionDescriptionText color={shouldDisable ? "textSecondary" : "textPrimary"}>
                      {elem.description}{" "}
                    </ActionDescriptionText>
                  </OptionContainer>
                </Grid>
              ))}
          </Grid>
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

      <ProposalFormContainer
        handleClose={() => handleCloseTreasury()}
        defaultTab={proposalTreasuryAction === "token" ? 0 : proposalTreasuryAction === "nft" ? 1 : 2}
        open={
          proposalTreasuryAction === "token" ||
          proposalTreasuryAction === "nft" ||
          proposalTreasuryAction === "registry"
        }
      />

      <ProposalCreatorModal open={openLiteProposal} handleClose={handleCloseSupportedExecuteProposalModal} />
    </>
  )
}

export const ProposalActionsDialog: React.FC<{ open: boolean; handleClose: () => void; queryType?: string }> = ({
  open,
  handleClose,
  queryType
}) => {
  const daoId = useDAOID()
  const { data } = useDAO(daoId)

  return data?.data.network.startsWith("etherlink") ? (
    <EvmProposalsActionDialog open={open} handleClose={handleClose} />
  ) : (
    <ProposalActionsDialogForTezos open={open} handleClose={handleClose} queryType={queryType} />
  )
}
