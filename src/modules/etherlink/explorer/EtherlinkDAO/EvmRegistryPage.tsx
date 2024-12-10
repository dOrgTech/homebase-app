import { Button, Grid, Tooltip, useMediaQuery, useTheme } from "@material-ui/core"
import { CopyAddress } from "modules/common/CopyAddress"
import { ProposalFormContainer, ProposalFormDefaultValues } from "modules/explorer/components/ProposalForm"

import React, { useContext, useMemo, useState } from "react"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { useProposals } from "services/services/dao/hooks/useProposals"
import { LambdaProposal } from "services/services/dao/mappers/proposal/types"
import { Hero } from "modules/explorer/components/Hero"
import { HeroTitle } from "modules/explorer/components/HeroTitle"
import { RegistryTable } from "modules/explorer/pages/Registry/components/RegistryTable"
import { useIsProposalButtonDisabled } from "../../../../services/contracts/baseDAO/hooks/useCycleInfo"
import { InfoIcon } from "modules/explorer/components/styled/InfoIcon"
import { MainButton } from "modules/common/MainButton"
import { LambdaDAO } from "services/contracts/baseDAO/lambdaDAO"
import { useEtherlinkDAOID } from "../router"
import { EtherlinkContext } from "services/wagmi/context"

export const EvmRegistryPage: React.FC = () => {
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))
  const daoId = useEtherlinkDAOID()
  const { data: dao } = useDAO(daoId)
  const { daoSelected } = useContext(EtherlinkContext)
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

  const registryList = Object.entries(daoSelected?.registry).map(([key, value]) => ({
    key,
    value: value as string,
    onClick: () => {},
    lastUpdated: ""
  }))

  console.log("registryList", registryList)

  return (
    <>
      <Grid container direction="column" style={{ gap: 42 }}>
        <Hero>
          <Grid item>
            <HeroTitle>Registry</HeroTitle>
            {dao && (
              <CopyAddress
                address={daoSelected?.registryAddress}
                justifyContent={isMobileSmall ? "center" : "flex-start"}
                typographyProps={{
                  variant: "subtitle2"
                }}
              />
            )}
          </Grid>
          <Grid item>
            <MainButton
              variant="contained"
              color="secondary"
              onClick={() => setUpdateRegistryOpen(true)}
              disabled={shouldDisable}
            >
              New Item
            </MainButton>
            {shouldDisable && (
              <Tooltip placement="bottom" title="Not on proposal creation period">
                <InfoIcon color="secondary" />
              </Tooltip>
            )}
          </Grid>
        </Hero>
        <Grid item>
          <RegistryTable data={registryList} />
        </Grid>
      </Grid>
      {/* <ProposalFormContainer
        open={updateRegistryOpen}
        handleClose={onCloseRegistryUpdate}
        defaultTab={2}
        defaultValues={defaultData}
      /> */}
    </>
  )
}
