import { Grid, Tooltip } from "@mui/material"
import { ProposalFormContainer, ProposalFormDefaultValues } from "modules/explorer/components/ProposalForm"

import React, { useMemo, useState } from "react"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { useProposals } from "services/services/dao/hooks/useProposals"
import { LambdaProposal } from "services/services/dao/mappers/proposal/types"
import { Hero } from "../../components/Hero"
import { useDAOID } from "../DAO/router"
import { RegistryTable } from "./components/RegistryTable"
import { UpdatesTable } from "./components/UpdatesTable"
import { useIsProposalButtonDisabled } from "../../../../services/contracts/baseDAO/hooks/useCycleInfo"
import { SmallButton } from "../../../common/SmallButton"
import { LambdaDAO } from "services/contracts/baseDAO/lambdaDAO"

export const Registry: React.FC = () => {
  const daoId = useDAOID()
  const { data: dao } = useDAO(daoId)
  const [updateRegistryOpen, setUpdateRegistryOpen] = useState(false)
  const { data: proposalsData } = useProposals(daoId)
  const [defaultData, setDefaultData] = useState<ProposalFormDefaultValues>()
  const shouldDisable = useIsProposalButtonDisabled(daoId)

  const onCloseRegistryUpdate = () => {
    setUpdateRegistryOpen(false)
    setDefaultData(undefined)
  }

  const proposals = useMemo(() => {
    if (!proposalsData || !dao) {
      return []
    }

    const registryDAO = dao as LambdaDAO
    const registryProposalsData = proposalsData as LambdaProposal[]

    const registryAffectedKeysProposalIds = registryDAO.decoded.decodedRegistryAffected.map(r => r.proposalId)

    return registryProposalsData
      .filter(proposal => registryAffectedKeysProposalIds.includes(proposal.id))
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .map(proposal => ({
        ...proposal,
        description: "Proposal description",
        address: proposal.id,
        lastUpdated: proposal.startDate,
        list: proposal.metadata.list,
        proposalId: proposal.id,
        agoraPostId: Number(proposal.metadata.agoraPostId)
      }))
      .flatMap(proposal =>
        proposal.list.map(({ key }) => ({
          ...proposal,
          key
        }))
      )
  }, [dao, proposalsData])

  const onClickItem = (item: { key: string; value: string }) => {
    setDefaultData({
      registryUpdateForm: {
        isBatch: false,
        list: [item]
      }
    })
    setUpdateRegistryOpen(true)
  }

  const registryList = useMemo(() => {
    return (dao as LambdaDAO)?.decoded.decodedRegistry.map(d => ({
      ...d,
      lastUpdated: proposals.find(proposal => proposal.key === d.key)?.startDate,
      onClick: () => onClickItem(d)
    }))
  }, [dao, proposals])

  return (
    <>
      <Grid container direction="column" style={{ gap: 42, minHeight: "calc(100vh - 40px)" }}>
        <Hero>
          <Grid item xs container justifyContent="flex-end">
            {shouldDisable ? (
              <Tooltip placement="bottom" title="Not on proposal creation period">
                <span>
                  <SmallButton variant="contained" color="secondary" disabled>
                    Edit/Add Item
                  </SmallButton>
                </span>
              </Tooltip>
            ) : (
              <SmallButton variant="contained" color="secondary" onClick={() => setUpdateRegistryOpen(true)}>
                Edit/Add Item
              </SmallButton>
            )}
          </Grid>
        </Hero>
        <Grid item>
          <RegistryTable data={registryList} />
        </Grid>
        <Grid item>
          <UpdatesTable data={proposals} />
        </Grid>
      </Grid>
      <ProposalFormContainer
        open={updateRegistryOpen}
        handleClose={onCloseRegistryUpdate}
        defaultTab={2}
        defaultValues={defaultData}
      />
    </>
  )
}
