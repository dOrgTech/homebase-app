import _ from "lodash"
import { Grid, styled, Typography } from "@material-ui/core"
import { RegistryProposalFormValues } from "modules/explorer/components/UpdateRegistryDialog"
import { TreasuryProposalFormValues } from "modules/explorer/components/NewTreasuryProposalDialog"
import React, { useState } from "react"
import { useDAO } from "services/indexer/dao/hooks/useDAO"
import { NFTTransferFormValues } from "./NFTTransfer"
import { useDAOID } from "../pages/DAO/router"
import { ResponsiveDialog } from "./ResponsiveDialog"
import { MainButton } from "../../common/MainButton"
import { ProposalAction, ProposalFormLambda } from "./ConfigProposalFormLambda"
import { useDAOLambdas } from "services/contracts/baseDAO/hooks/useDAOLambdas"
import { Lambda } from "services/bakingBad/lambdas/types"

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

type OpenSupportedExecuteProposalModal = [string, boolean]
const defaultOpenSupportedExecuteProposalModal: OpenSupportedExecuteProposalModal = ["none", false]

export const ProposalSelectionMenuLambda: React.FC<Props> = ({ open, handleClose }) => {
  const daoId = useDAOID()
  const { data: dao } = useDAO(daoId)
  const daoLambdas = useDAOLambdas(daoId)
  const [proposalAction, setProposalAction] = useState<ProposalAction>(ProposalAction.none)
  const [isExecuteUI, setIsExecuteUI] = useState(false)
  const [openProposalFormLambda, setOpenProposalFormLambda] = useState(false)
  const [openSupportedExecuteProposalModal, setOpenSupportedExecuteProposalModal] =
    useState<OpenSupportedExecuteProposalModal>(defaultOpenSupportedExecuteProposalModal)

  const toggleExecuteUI = () => {
    setIsExecuteUI(!isExecuteUI)
  }

  const handleOpenCustomProposalModal = (key: ProposalAction) => {
    setProposalAction(key)
    setOpenProposalFormLambda(true)
    handleClose()
  }

  const handleCloseCustomProposalModal = () => {
    setProposalAction(ProposalAction.none)
    setOpenProposalFormLambda(false)
  }

  const handleOpenSupportedExecuteProposalModal = (selectedLambda: Lambda) => {
    setOpenSupportedExecuteProposalModal([selectedLambda.key, true])
  }

  const handleCloseSupportedExecuteProposalModal = (selectedLambda: Lambda) => {
    setOpenSupportedExecuteProposalModal([selectedLambda.key, false])
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
        {_.map(daoLambdas, lambda => (
          <MainButton variant="contained" onClick={() => console.log({ lambda })}>
            {_.startCase(lambda.key)}
          </MainButton>
        ))}

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
      <ResponsiveDialog open={open} onClose={handleClose} title="Add New Proposal">
        {dao ? (
          <Content container direction="column" style={{ gap: 32 }}>
            {isExecuteUI ? renderExecuteMenuContent() : null}
            {!isExecuteUI ? renderMainMenuContent() : null}
          </Content>
        ) : null}
      </ResponsiveDialog>

      <ProposalFormLambda
        action={proposalAction}
        open={openProposalFormLambda}
        handleClose={handleCloseCustomProposalModal}
      />
    </>
  )
}
