import { Grid, Tooltip, useMediaQuery, useTheme } from "components/ui"
import { ContentContainer } from "components/ui/Table"

import React, { useContext, useMemo, useState, useEffect } from "react"

import { useIsProposalButtonDisabled } from "../../../../services/contracts/baseDAO/hooks/useCycleInfo"
import { InfoIcon } from "modules/explorer/components/styled/InfoIcon"
import { MainButton } from "modules/common/MainButton"
import { useEtherlinkDAOID } from "../router"
import { EtherlinkContext } from "services/wagmi/context"
import { useEvmProposalOps } from "services/contracts/etherlinkDAO/hooks/useEvmProposalOps"
import { useHistory } from "react-router-dom"
import { EvmRegistryTable } from "modules/etherlink/components/EvmRegistryTable"
import { SearchInput } from "modules/explorer/pages/DAOList/components/Searchbar"
import { styled } from "@material-ui/core"

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
  const { daoSelected } = useContext(EtherlinkContext)
  const shouldDisable = useIsProposalButtonDisabled(daoId)
  const { setMetadataFieldValue, setCurrentStep, setDaoRegistry } = useEvmProposalOps()
  const history = useHistory()
  const [searchText, setSearchText] = useState("")
  const [debouncedSearchText, setDebouncedSearchText] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchText])

  const registryList = useMemo(() => {
    if (!daoSelected?.registry) {
      return []
    }
    return Object.entries(daoSelected?.registry).map(([key, value]) => ({
      key,
      value: value as string,
      onClick: () => {}
    }))
  }, [daoSelected?.registry])

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
              </Grid>
            </Grid>
          </Grid>
        </ShellHeroContainer>
        <Grid item>
          <EvmRegistryTable
            data={filteredRegistryList.map(rItem => ({
              key: rItem.key,
              value: rItem.value,
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
