import { Grid, Tooltip, useMediaQuery, useTheme } from "components/ui"
import { ContentContainer } from "components/ui/Table"

import React, { useContext, useMemo, useState, useEffect } from "react"

import { useIsProposalButtonDisabled } from "../../../../services/contracts/baseDAO/hooks/useCycleInfo"
import { InfoIcon } from "modules/explorer/components/styled/InfoIcon"
import { SmallButton } from "modules/common/SmallButton"
import { useEtherlinkDAOID } from "../router"
import { EtherlinkContext } from "services/wagmi/context"
import { useEvmProposalOps } from "services/contracts/etherlinkDAO/hooks/useEvmProposalOps"
import { useHistory } from "react-router-dom"
import { EvmRegistryTable } from "modules/etherlink/components/EvmRegistryTable"
import { SearchInput } from "modules/explorer/pages/DAOList/components/Searchbar"
import { styled } from "@material-ui/core"
import { useRegistry } from "services/wagmi/etherlink/hooks/useRegistry"

const ShellHeroContainer = styled(ContentContainer)({
  background: "inherit !important",
  paddingTop: 0,
  padding: "0px",
  display: "inline-flex",
  alignItems: "center"
})

export const EvmRegistryPage: React.FC = () => {
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("xs"))
  const daoId = useEtherlinkDAOID()
  const { daoSelected, provider, network } = useContext(EtherlinkContext)
  const shouldDisable = useIsProposalButtonDisabled(daoId)
  const { setMetadataFieldValue, setCurrentStep, setDaoRegistry } = useEvmProposalOps()
  const history = useHistory()
  const [searchText, setSearchText] = useState("")
  const [debouncedSearchText, setDebouncedSearchText] = useState("")

  const {
    data: rpcRegistryEntries,
    isLoading: isRpcLoading,
    error: rpcError
  } = useRegistry(provider, daoSelected?.registryAddress, network || "")

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchText])

  const firestoreRegistryList = useMemo(() => {
    if (!daoSelected?.registry) {
      return []
    }
    return Object.entries(daoSelected?.registry).map(([key, value]) => ({
      key,
      value: value as string,
      onClick: () => {
        setMetadataFieldValue("type", "edit_registry")
        setDaoRegistry("key", key)
        setDaoRegistry("value", value as string)
        setCurrentStep(1)
        history.push(`${window.location.pathname.slice(0, -8)}proposals`)
      }
    }))
  }, [daoSelected?.registry, setMetadataFieldValue, setDaoRegistry, setCurrentStep, history])

  const registryList = useMemo(() => {
    const rpcEntries = rpcRegistryEntries || []
    const firestoreEntries = firestoreRegistryList || []

    console.log("[Registry Source] RPC entries:", rpcEntries)
    console.log("[Registry Source] Firestore entries:", firestoreEntries)
    console.log("[Registry Source] RPC loading:", isRpcLoading)
    console.log("[Registry Source] RPC error:", rpcError)

    if (rpcEntries.length > 0 && !isRpcLoading && !rpcError) {
      console.log("[Registry Source] Using: RPC")
      return rpcEntries.map(entry => ({
        key: entry.key,
        value: entry.value,
        onClick: () => {
          setMetadataFieldValue("type", "edit_registry")
          setDaoRegistry("key", entry.key)
          setDaoRegistry("value", entry.value)
          setCurrentStep(1)
          history.push(`${window.location.pathname.slice(0, -8)}proposals`)
        }
      }))
    } else {
      console.log("[Registry Source] Using: Firestore")
      return firestoreEntries
    }
  }, [
    rpcRegistryEntries,
    firestoreRegistryList,
    isRpcLoading,
    rpcError,
    setMetadataFieldValue,
    setDaoRegistry,
    setCurrentStep,
    history
  ])

  const filteredRegistryList = useMemo(() => {
    if (!debouncedSearchText) {
      return registryList
    }
    return registryList.filter(item => item.key.toLowerCase().includes(debouncedSearchText.toLowerCase()))
  }, [registryList, debouncedSearchText])

  return (
    <>
      <Grid container direction="column" style={{ gap: 16 }}>
        <ShellHeroContainer item xs={12}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item container direction="row">
              <Grid
                container
                style={{ gap: 20 }}
                alignItems={isMobileSmall ? "baseline" : "center"}
                direction={isMobileSmall ? "column" : "row"}
              >
                <Grid item xs={isMobileSmall ? undefined : 6}>
                  <SearchInput search={setSearchText} defaultValue="" placeholder="Search Registry Items by Key..." />
                </Grid>
                <Grid
                  item
                  container
                  justifyContent="flex-end"
                  style={{ gap: 15 }}
                  direction={isMobileSmall ? "column" : "row"}
                  xs={isMobileSmall ? undefined : true}
                >
                  <SmallButton
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
                  </SmallButton>
                  {shouldDisable && (
                    <Tooltip placement="bottom" title="Not on proposal creation period">
                      <InfoIcon color="secondary" />
                    </Tooltip>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </ShellHeroContainer>
        <Grid item>
          <EvmRegistryTable data={filteredRegistryList} />
        </Grid>
      </Grid>
    </>
  )
}
