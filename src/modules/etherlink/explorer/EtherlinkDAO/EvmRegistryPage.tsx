import { Grid, Tooltip, useMediaQuery, useTheme } from "@material-ui/core"
import { CopyAddress } from "modules/common/CopyAddress"

import React, { useContext, useMemo } from "react"
import { useDAO } from "services/services/dao/hooks/useDAO"

import { Hero } from "modules/explorer/components/Hero"
import { HeroTitle } from "modules/explorer/components/HeroTitle"
import { useIsProposalButtonDisabled } from "../../../../services/contracts/baseDAO/hooks/useCycleInfo"
import { InfoIcon } from "modules/explorer/components/styled/InfoIcon"
import { MainButton } from "modules/common/MainButton"
import { useEtherlinkDAOID } from "../router"
import { EtherlinkContext } from "services/wagmi/context"
import { useEvmProposalOps } from "services/contracts/etherlinkDAO/hooks/useEvmProposalOps"
import { useHistory } from "react-router-dom"
import { EvmRegistryTable } from "modules/etherlink/components/EvmRegistryTable"

export const EvmRegistryPage: React.FC = () => {
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))
  const daoId = useEtherlinkDAOID()
  const { data: dao } = useDAO(daoId)
  const { daoSelected } = useContext(EtherlinkContext)
  const shouldDisable = useIsProposalButtonDisabled(daoId)
  const { setMetadataFieldValue, setCurrentStep, setDaoRegistry } = useEvmProposalOps()
  const history = useHistory()

  const registryList = useMemo(() => {
    if (!daoSelected?.registry) {
      return []
    }
    return Object.entries(daoSelected?.registry).map(([key, value]) => ({
      key,
      value: value as string,
      onClick: () => {},
      lastUpdated: ""
    }))
  }, [daoSelected?.registry])

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
              onClick={() => {
                setMetadataFieldValue("type", "edit_registry")
                setCurrentStep(1)
                history.push(`${window.location.pathname.slice(0, -8)}proposals`)
              }}
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
          <EvmRegistryTable
            data={registryList.map(rItem => ({
              key: rItem.key,
              value: rItem.value,
              lastUpdated: rItem.lastUpdated,
              onClick: () => {
                setMetadataFieldValue("type", "edit_registry")
                setDaoRegistry("key", rItem.key)
                setDaoRegistry("value", rItem.value)
                setCurrentStep(1)
                history.push(`${window.location.pathname.slice(0, -8)}proposals`)
              }
            }))}
          />
        </Grid>
      </Grid>
    </>
  )
}
