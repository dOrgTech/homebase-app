import { Button, Grid, styled, Tooltip, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import React, { useCallback, useState } from "react"

import { useFlush } from "services/contracts/baseDAO/hooks/useFlush"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { useProposals } from "services/services/dao/hooks/useProposals"
import { useDAOID } from "../DAO/router"

import { useDropAllExpired } from "../../../../services/contracts/baseDAO/hooks/useDropAllExpired"
import { SmallButton } from "../../../common/SmallButton"
import { ContentContainer } from "../../components/ContentContainer"
import { InfoIcon } from "../../components/styled/InfoIcon"
import { CopyAddress } from "modules/common/CopyAddress"
import { HeroTitle } from "modules/explorer/components/HeroTitle"
import { ProposalAction, ProposalFormLambda } from "modules/explorer/components/ConfigProposalFormLambda"
import { ConfigProposalForm } from "modules/explorer/components/ConfigProposalForm"
import { GuardianChangeProposalForm } from "modules/explorer/components/GuardianChangeProposalForm"
import { SupportedLambdaProposalKey } from "services/bakingBad/lambdas"
import { DelegationChangeProposalForm } from "modules/explorer/components/DelegationChangeProposalForm"
import { DaoInfoTables } from "./components/DAOInfoTable"
import { ProposalStatus } from "services/services/dao/mappers/proposal/types"
import { ProposalCreator } from "modules/lite/explorer/pages/CreateProposal"
import { ProposalCreatorModal } from "modules/lite/explorer/pages/CreateProposal/ProposalCreatorModal"

interface Action {
  id: any
  name: string
  description: string
  isLambda: boolean
}

const getActions = (): Action[] => [
  {
    name: "Off Chain Poll",
    description: "Create an inconsequential poll for your community",
    id: "off-chain",
    isLambda: true
  },
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

const HeroContainer = styled(ContentContainer)(({ theme }) => ({
  padding: "38px",
  display: "inline-flex",
  alignItems: "center",
  maxHeight: 132,
  [theme.breakpoints.down("sm")]: {
    maxHeight: "fit-content"
  }
}))

export const DropButton = styled(Button)({
  verticalAlign: "text-bottom",
  fontSize: "16px"
})

const OptionContainer = styled(Grid)(({ theme }) => ({
  "minHeight": 80,
  "background": theme.palette.primary.main,
  "borderRadius": 8,
  "padding": "35px 42px",
  "marginBottom": 16,
  "cursor": "pointer",
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

interface Props {
  open: boolean
  handleClose: () => void
}

const defaultOpenSupportedExecuteProposalModal = "none"

export const Config: React.FC = () => {
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))
  const [openModal, setOpenModal] = useState(false)
  const [openModalLambda, setOpenModalLambda] = useState(false)
  const daoId = useDAOID()
  const { data } = useDAO(daoId)
  const { mutate } = useFlush()
  const { mutate: dropAllExpired } = useDropAllExpired()
  const { data: executableProposals } = useProposals(daoId, ProposalStatus.EXECUTABLE)
  const { data: expiredProposals } = useProposals(daoId, ProposalStatus.EXPIRED)
  const name = data && data.data.name
  const [proposalAction, setProposalAction] = useState<ProposalAction>(ProposalAction.none)
  const [openProposalFormLambda, setOpenProposalFormLambda] = useState(false)
  const [openLiteProposal, setOpenLiteProposal] = useState(false)
  const liteDAOId = data?.liteDAOData?._id

  const handleOpenCustomProposalModal = (key: ProposalAction) => {
    setProposalAction(key)
    setOpenProposalFormLambda(true)
  }

  const handleCloseCustomProposalModal = () => {
    setProposalAction(ProposalAction.none)
    setOpenProposalFormLambda(false)
  }

  const handleOpenSupportedExecuteProposalModal = (lambdaKey: string) => {
    setOpenSupportedExecuteProposalModal(lambdaKey)
  }

  const handleCloseSupportedExecuteProposalModal = () => {
    setOpenLiteProposal(false)
    setOpenSupportedExecuteProposalModal(defaultOpenSupportedExecuteProposalModal)
  }

  const handleLiteProposal = () => {
    setOpenLiteProposal(true)
  }

  const [openSupportedExecuteProposalModalKey, setOpenSupportedExecuteProposalModal] = useState<string>(
    defaultOpenSupportedExecuteProposalModal
  )

  const onFlush = useCallback(async () => {
    if (executableProposals && expiredProposals && executableProposals.length && data) {
      mutate({
        dao: data,
        numOfProposalsToFlush: executableProposals.length,
        expiredProposalIds: expiredProposals.map((p: any) => p.id)
      })
      return
    }
  }, [data, mutate, executableProposals, expiredProposals])

  const onDropAllExpired = useCallback(async () => {
    if (expiredProposals && expiredProposals.length && data) {
      dropAllExpired({
        dao: data,
        expiredProposalIds: expiredProposals.map((p: any) => p.id)
      })
      return
    }
  }, [data, dropAllExpired, expiredProposals])

  return (
    <>
      <Grid container direction="column" style={{ gap: 42 }}>
        <HeroContainer item>
          <Grid container justifyContent="space-between" alignItems={isMobileSmall ? "baseline" : "center"}>
            <Grid item xs={12}>
              <Grid
                container
                style={{ gap: 20 }}
                alignItems="center"
                justifyContent="space-between"
                direction={isMobileSmall ? "column" : "row"}
              >
                <Grid item xs={isMobileSmall ? undefined : 5}>
                  <HeroTitle>{name}</HeroTitle>
                  {data && (
                    <CopyAddress
                      address={data.data.address}
                      justifyContent={isMobileSmall ? "center" : "flex-start"}
                      typographyProps={{
                        variant: "subtitle2"
                      }}
                    />
                  )}
                </Grid>
                <Grid
                  item
                  xs={isMobileSmall ? undefined : 6}
                  container
                  justifyContent={isMobileSmall ? "center" : "flex-end"}
                  alignItems="center"
                  style={{ gap: 20 }}
                >
                  <Grid item>
                    <SmallButton
                      variant="contained"
                      color="secondary"
                      onClick={onFlush}
                      disabled={!executableProposals || !executableProposals.length}
                    >
                      Execute
                    </SmallButton>
                    <Tooltip placement="bottom" title="Execute all passed proposals and drop all expired or rejected">
                      <InfoIcon color="secondary" />
                    </Tooltip>
                  </Grid>
                  <Grid item>
                    <DropButton
                      variant="contained"
                      color="secondary"
                      onClick={onDropAllExpired}
                      disabled={!expiredProposals || !expiredProposals.length}
                    >
                      Drop All Expired
                    </DropButton>
                    <Tooltip placement="bottom" title="Drop all expired proposals">
                      <InfoIcon color="secondary" />
                    </Tooltip>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </HeroContainer>
      </Grid>

      <Grid container style={{ marginTop: 32 }} spacing={2}>
        {getActions().map((elem, index) =>
          !liteDAOId && elem.id === "off-chain" ? null : (
            <Grid key={index} item xs={isMobileSmall ? 12 : 4}>
              <OptionContainer
                onClick={() =>
                  elem.id === "off-chain"
                    ? handleLiteProposal()
                    : elem.isLambda
                    ? handleOpenCustomProposalModal(elem.id)
                    : handleOpenSupportedExecuteProposalModal(elem.id)
                }
              >
                <ActionText color="textPrimary">{elem.name}</ActionText>
                <ActionDescriptionText color="textPrimary"> {elem.description} </ActionDescriptionText>
              </OptionContainer>
            </Grid>
          )
        )}
      </Grid>

      <DaoInfoTables />

      {openProposalFormLambda ? (
        <ProposalFormLambda
          action={proposalAction}
          open={openProposalFormLambda}
          handleClose={handleCloseCustomProposalModal}
        />
      ) : null}

      {openSupportedExecuteProposalModalKey === SupportedLambdaProposalKey.ConfigurationProposal ? (
        <ConfigProposalForm
          open={openSupportedExecuteProposalModalKey === SupportedLambdaProposalKey.ConfigurationProposal}
          handleClose={handleCloseSupportedExecuteProposalModal}
        />
      ) : null}

      {openSupportedExecuteProposalModalKey === SupportedLambdaProposalKey.UpdateGuardianProposal ? (
        <GuardianChangeProposalForm
          open={openSupportedExecuteProposalModalKey === SupportedLambdaProposalKey.UpdateGuardianProposal}
          handleClose={handleCloseSupportedExecuteProposalModal}
        />
      ) : null}

      {openSupportedExecuteProposalModalKey === SupportedLambdaProposalKey.UpdateContractDelegateProposal ? (
        <DelegationChangeProposalForm
          open={openSupportedExecuteProposalModalKey === SupportedLambdaProposalKey.UpdateContractDelegateProposal}
          handleClose={handleCloseSupportedExecuteProposalModal}
        />
      ) : null}

      {openLiteProposal ? (
        <ProposalCreatorModal open={openLiteProposal} handleClose={handleCloseSupportedExecuteProposalModal} />
      ) : null}
    </>
  )
}
