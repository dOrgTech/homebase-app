import { Grid, styled, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import { RegistryProposalFormValues } from "modules/explorer/components/UpdateRegistryDialog"
import { TreasuryProposalFormValues } from "modules/explorer/components/NewTreasuryProposalDialog"
import React, { useState } from "react"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { useIsProposalButtonDisabled } from "services/contracts/baseDAO/hooks/useCycleInfo"
import { ResponsiveDialog } from "modules/explorer/components/ResponsiveDialog"
import { ProposalFormContainer } from "modules/explorer/components/ProposalForm"
import { useDAOID } from "../../DAO/router"

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
  "height": 80,
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
    name: "Transfer Tokens",
    description: "Transfer tokens from the DAO Treasury to another account.",
    id: 0,
    isLambda: false
  },
  {
    name: "Transfer NFTs",
    description: "Transfer NFTs from the DAO Treasury to another account.",
    id: 1,
    isLambda: false
  }
]

interface Props {
  open: boolean
  handleClose: () => void
  handleChangeTab: (tab: number) => void
  shouldDisable: boolean
}

const defaultOpenSupportedExecuteProposalModal = "none"

export const TreasuryDialog: React.FC<Props> = ({ open, handleClose, handleChangeTab, shouldDisable }) => {
  const daoId = useDAOID()
  const { data } = useDAO(daoId)
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))
  const [openTransfer, setOpenTransfer] = useState(false)
  const [selectedTab, setSelectedTab] = useState(0)

  const liteDAOId = data?.liteDAOData?._id
  const handleOpenSupportedExecuteProposalModal = (lambdaKey: number) => {
    setSelectedTab(lambdaKey)
    setOpenTransfer(true)
    handleClose()
  }

  const closeTransfer = () => {
    setOpenTransfer(false)
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
                  onClick={() => (!shouldDisable ? handleOpenSupportedExecuteProposalModal(Number(elem.id)) : null)}
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

      <ProposalFormContainer open={openTransfer} handleClose={closeTransfer} defaultTab={selectedTab} />
    </>
  )
}
