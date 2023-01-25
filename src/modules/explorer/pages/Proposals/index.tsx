import { Button, Grid, styled, Tooltip, Typography } from "@material-ui/core"
import React, { useCallback, useState } from "react"

import { useFlush } from "services/contracts/baseDAO/hooks/useFlush"
import { useDAO } from "services/indexer/dao/hooks/useDAO"
import { useProposals } from "services/indexer/dao/hooks/useProposals"
import { useDAOID } from "../DAO/router"

import { ProposalSelectionMenuLambda } from "modules/explorer/components/ProposalSelectionMenuLambda"
import { useTezos } from "services/beacon/hooks/useTezos"
import { useUnstakeFromAllProposals } from "services/contracts/baseDAO/hooks/useUnstakeFromAllProposals"
import { ProposalStatus } from "services/indexer/dao/mappers/proposal/types"
import { useIsProposalButtonDisabled } from "../../../../services/contracts/baseDAO/hooks/useCycleInfo"
import { useDropAllExpired } from "../../../../services/contracts/baseDAO/hooks/useDropAllExpired"
import { MainButton } from "../../../common/MainButton"
import { SmallButton } from "../../../common/SmallButton"
import { ContentContainer } from "../../components/ContentContainer"
import { ProposalSelectionMenu } from "../../components/ProposalSelectionMenu"
import { ProposalsList } from "../../components/ProposalsList"
import { InfoIcon } from "../../components/styled/InfoIcon"

const HeroContainer = styled(ContentContainer)({
  padding: "38px 38px"
})

const TitleText = styled(Typography)({
  fontSize: 30,
  fontWeight: 500,
  lineHeight: 0.9,

  ["@media (max-width:1030px)"]: {
    fontSize: 25
  }
})

export const DropButton = styled(Button)({
  verticalAlign: "text-bottom",
  fontSize: "16px"
})

export const Proposals: React.FC = () => {
  const [openModal, setOpenModal] = useState(false)
  const [openModalLambda, setOpenModalLambda] = useState(false)
  const daoId = useDAOID()
  const { data, cycleInfo } = useDAO(daoId)
  const { mutate } = useFlush()
  const { mutate: dropAllExpired } = useDropAllExpired()
  const { mutate: unstakeFromAllProposals } = useUnstakeFromAllProposals()
  const shouldDisable = useIsProposalButtonDisabled(daoId)
  const { data: proposals } = useProposals(daoId)
  const { data: activeProposals } = useProposals(daoId, ProposalStatus.ACTIVE)
  const { data: executableProposals } = useProposals(daoId, ProposalStatus.EXECUTABLE)
  const { data: expiredProposals } = useProposals(daoId, ProposalStatus.EXPIRED)
  const { data: executedProposals } = useProposals(daoId, ProposalStatus.EXECUTED)
  const { data: droppedProposals } = useProposals(daoId, ProposalStatus.DROPPED)
  const { account } = useTezos()

  const onFlush = useCallback(async () => {
    if (executableProposals && expiredProposals && executableProposals.length && data) {
      mutate({
        dao: data,
        numOfProposalsToFlush: executableProposals.length,
        expiredProposalIds: expiredProposals.map(p => p.id)
      })
      return
    }
  }, [data, mutate, executableProposals, expiredProposals])

  const onDropAllExpired = useCallback(async () => {
    if (expiredProposals && expiredProposals.length && data) {
      dropAllExpired({
        dao: data,
        expiredProposalIds: expiredProposals.map(p => p.id)
      })
      return
    }
  }, [data, dropAllExpired, expiredProposals])

  const toggleProposalModal = () => {
    switch (data?.data.dao_type?.name) {
      case "lambda":
        setOpenModalLambda(!openModalLambda)
        break
      default:
        setOpenModal(!openModal)
    }
  }

  return (
    <>
      <Grid container direction="column" style={{ gap: 42 }}>
        <HeroContainer item>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Grid container style={{ gap: 20 }} alignItems="center">
                <Grid item>
                  <TitleText color="textPrimary">Proposals</TitleText>
                </Grid>
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
            <Grid item>
              <MainButton variant="contained" color="secondary" onClick={toggleProposalModal} disabled={shouldDisable}>
                New Proposal
              </MainButton>
              {shouldDisable && (
                <Tooltip placement="bottom" title="Not on proposal creation period">
                  <InfoIcon color="secondary" />
                </Tooltip>
              )}
            </Grid>
          </Grid>
        </HeroContainer>

        {data && cycleInfo && activeProposals && (
          <ProposalsList title={"Active Proposals"} currentLevel={cycleInfo.currentLevel} proposals={activeProposals} />
        )}

        {data && cycleInfo && proposals && (
          <ProposalsList title={"All Proposals"} currentLevel={cycleInfo.currentLevel} proposals={proposals} />
        )}
      </Grid>
      <ProposalSelectionMenu open={openModal} handleClose={toggleProposalModal} />
      <ProposalSelectionMenuLambda open={openModalLambda} handleClose={toggleProposalModal} />
    </>
  )
}
