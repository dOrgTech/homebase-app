/* eslint-disable react/display-name */
import { Grid, styled, Button, Typography } from "@material-ui/core"
import { RegistryProposalFormValues } from "modules/explorer/components/UpdateRegistryDialog"
import { TreasuryProposalFormValues } from "modules/explorer/components/NewTreasuryProposalDialog"
import React, { useState } from "react"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { NFTTransferFormValues } from "./NFTTransfer"
import { useDAOID } from "../pages/DAO/router"
import { ProposalFormContainer } from "./ProposalForm"
import { ConfigProposalForm } from "./ConfigProposalForm"
import { ResponsiveDialog } from "./ResponsiveDialog"
import { GuardianChangeProposalForm } from "./GuardianChangeProposalForm"
import { DelegationChangeProposalForm } from "./DelegationChangeProposalForm"
import { MainButton } from "../../common/MainButton"

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

enum ProposalModalKey {
  config,
  guardian,
  transfer,
  registry,
  delegation
}

export const ProposalSelectionMenu: React.FC<Props> = ({ open, handleClose }) => {
  const daoId = useDAOID()
  const { data: dao } = useDAO(daoId)
  const [openModal, setOpenModal] = useState<ProposalModalKey>()

  const handleOptionSelected = (key: ProposalModalKey) => {
    setOpenModal(key)
    handleClose()
  }

  const handleCloseModal = () => {
    setOpenModal(undefined)
  }

  return (
    <>
      <ResponsiveDialog open={open} onClose={handleClose} title={"Add New Proposal"}>
        {dao && (
          <>
            <Content container direction={"column"} style={{ gap: 32 }}>
              <Grid item>
                <Typography style={{ fontWeight: 300 }} color={"textPrimary"}>
                  Which proposal would you like to create?
                </Typography>
              </Grid>
              <Grid container justifyContent="center" style={{ gap: 20 }} direction={"column"}>
                <MainButton variant={"contained"} onClick={() => handleOptionSelected(ProposalModalKey.transfer)}>
                  Assets / Registry
                </MainButton>

                <MainButton
                  variant={"contained"}
                  color={"secondary"}
                  onClick={() => handleOptionSelected(ProposalModalKey.config)}
                >
                  Configuration
                </MainButton>

                <MainButton
                  variant={"contained"}
                  color={"secondary"}
                  onClick={() => handleOptionSelected(ProposalModalKey.guardian)}
                >
                  Change Guardian
                </MainButton>

                <MainButton
                  variant={"contained"}
                  color={"secondary"}
                  onClick={() => handleOptionSelected(ProposalModalKey.delegation)}
                >
                  Change Delegate
                </MainButton>
              </Grid>
            </Content>
          </>
        )}
      </ResponsiveDialog>
      <ProposalFormContainer
        defaultTab={0}
        open={ProposalModalKey.transfer === openModal || ProposalModalKey.registry === openModal}
        handleClose={() => handleCloseModal()}
      />
      <ConfigProposalForm open={ProposalModalKey.config === openModal} handleClose={() => handleCloseModal()} />
      <GuardianChangeProposalForm
        open={ProposalModalKey.guardian === openModal}
        handleClose={() => handleCloseModal()}
      />
      <DelegationChangeProposalForm
        open={ProposalModalKey.delegation === openModal}
        handleClose={() => handleCloseModal()}
      />
    </>
  )
}
