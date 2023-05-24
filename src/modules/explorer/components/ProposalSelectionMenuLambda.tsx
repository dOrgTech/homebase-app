import _ from "lodash"
import { Grid, styled, Typography } from "@material-ui/core"
import { RegistryProposalFormValues } from "modules/explorer/components/UpdateRegistryDialog"
import { TreasuryProposalFormValues } from "modules/explorer/components/NewTreasuryProposalDialog"
import React, { useState } from "react"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { NFTTransferFormValues } from "./NFTTransfer"
import { useDAOID } from "../pages/DAO/router"
import { ResponsiveDialog } from "./ResponsiveDialog"
import { MainButton } from "../../common/MainButton"
import { ProposalAction, ProposalFormLambda } from "./ConfigProposalFormLambda"
import { useDAOLambdas } from "services/contracts/baseDAO/hooks/useDAOLambdas"
import { ProposalFormContainer } from "modules/explorer/components/ProposalForm"
import { SupportedLambdaProposalKey } from "services/bakingBad/lambdas"
import { GuardianChangeProposalForm } from "./GuardianChangeProposalForm"
import { DelegationChangeProposalForm } from "./DelegationChangeProposalForm"
import { ConfigProposalForm } from "./ConfigProposalForm"

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>
}

type Values = {
  agoraPostId: string
} & TreasuryProposalFormValues &
  RegistryProposalFormValues &
  NFTTransferFormValues

export type ProposalFormDefaultValues = RecursivePartial<Values>

const Content = styled(Grid)({
  padding: "0 25px"
})

interface Props {
  open: boolean
  handleClose: () => void
}

const defaultOpenSupportedExecuteProposalModal = "none"

export const ProposalSelectionMenuLambda: React.FC<Props> = ({ open, handleClose }) => {
  const daoId = useDAOID()
  const { data: dao } = useDAO(daoId)
  const daoLambdas = useDAOLambdas(daoId)
  const [proposalAction, setProposalAction] = useState<ProposalAction>(ProposalAction.none)
  const [isExecuteUI, setIsExecuteUI] = useState(false)
  const [openProposalFormLambda, setOpenProposalFormLambda] = useState(false)
  const [openSupportedExecuteProposalModalKey, setOpenSupportedExecuteProposalModal] = useState<string>(
    defaultOpenSupportedExecuteProposalModal
  )

  const toggleExecuteUI = () => {
    setIsExecuteUI(!isExecuteUI)
  }

  const onClose = () => {
    setIsExecuteUI(false)
    handleClose()
  }

  const handleGoBack = () => {
    setIsExecuteUI(false)
  }

  const handleOpenCustomProposalModal = (key: ProposalAction) => {
    setProposalAction(key)
    setOpenProposalFormLambda(true)
    onClose()
  }

  const handleCloseCustomProposalModal = () => {
    setProposalAction(ProposalAction.none)
    setOpenProposalFormLambda(false)
  }

  const handleOpenSupportedExecuteProposalModal = (lambdaKey: string) => {
    setOpenSupportedExecuteProposalModal(lambdaKey)
    onClose()
  }

  const handleCloseSupportedExecuteProposalModal = () => {
    setOpenSupportedExecuteProposalModal(defaultOpenSupportedExecuteProposalModal)
  }

  const renderMainMenuContent = () => (
    <>
      <Grid item>
        <Typography style={{ fontWeight: 300 }} color="textPrimary">
          Which proposal would you like to create?
        </Typography>
      </Grid>
      <Grid container justifyContent="center" style={{ gap: 20 }} direction="column">
        <MainButton variant="contained" onClick={() => handleOpenCustomProposalModal(ProposalAction.new)}>
          Add Lambda
        </MainButton>

        <MainButton
          variant="contained"
          color="secondary"
          onClick={() => handleOpenCustomProposalModal(ProposalAction.remove)}
        >
          Remove Lambda
        </MainButton>

        <MainButton variant="contained" color="secondary" onClick={toggleExecuteUI}>
          Execute Lambda
        </MainButton>
      </Grid>
    </>
  )

  const renderExecuteMenuContent = () => (
    <>
      <Grid item>
        <Typography style={{ fontWeight: 300 }} color="textPrimary">
          Execute Lambda
        </Typography>
      </Grid>
      <Grid container justifyContent="center" style={{ gap: 20 }} direction="column">
        {_.map(daoLambdas, lambda => {
          // @TODO: Remove when support for SupportedLambdaProposalKey.UpdateReceiversProposal is added
          if (
            lambda.key === SupportedLambdaProposalKey.UpdateReceiversProposal ||
            lambda.key === SupportedLambdaProposalKey.TransferProposal ||
            lambda.key === SupportedLambdaProposalKey.UpdateContractDelegateProposal
          ) {
            return null
          }

          return (
            <MainButton variant="contained" onClick={() => handleOpenSupportedExecuteProposalModal(lambda.key)}>
              {_.startCase(lambda.key)}
            </MainButton>
          )
        })}

        <MainButton
          variant="contained"
          color="secondary"
          onClick={() => handleOpenCustomProposalModal(ProposalAction.execute)}
        >
          Custom Proposal
        </MainButton>
      </Grid>
    </>
  )

  return (
    <>
      <ResponsiveDialog
        open={open}
        onClose={onClose}
        onGoBack={isExecuteUI ? handleGoBack : undefined}
        title="Add New Proposal"
      >
        <Content container direction="column" style={{ gap: 32 }}>
          {dao ? (
            <>
              {isExecuteUI ? renderExecuteMenuContent() : null}
              {!isExecuteUI ? renderMainMenuContent() : null}
            </>
          ) : (
            <>
              <Grid container justifyContent="center" style={{ gap: 20 }} direction="column">
                <Typography color="textPrimary">Something went wrong! please try again later.</Typography>
              </Grid>
            </>
          )}
        </Content>
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
    </>
  )
}
