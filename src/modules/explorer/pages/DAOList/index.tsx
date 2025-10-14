import { CircularProgress, Grid, Link, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import { Navbar } from "../../components/Toolbar"
import { TabPanel } from "modules/explorer/components/TabPanel"
import React, { useMemo, useState } from "react"
import { useTezos } from "services/beacon/hooks/useTezos"
import { useAllDAOs } from "services/services/dao/hooks/useAllDAOs"
import { ConnectMessage } from "./components/ConnectMessage"
import { DAOItem } from "./components/DAOItem"
import { SearchInput } from "./components/Searchbar"
import { MainButton } from "../../../common/MainButton"
import { ReactComponent as TabsIcon } from "assets/img/tabs-icon.svg"
import { ReactComponent as TabsSelectedIcon } from "assets/img/tabs-icon-selected.svg"
import { ReactComponent as MyDAOsIcon } from "assets/img/my-daos-icon.svg"
import { ReactComponent as MyDAOsSelectedIcon } from "assets/img/my-daos-selected-icon.svg"
import ReactPaginate from "react-paginate"
import "./styles.css"
import { LoadingLine } from "components/ui/LoadingLine"
import { useQueryParam } from "modules/home/hooks/useQueryParam"
import { PageContainer, StyledTab, Search, DAOItemGrid, DAOItemCard, TabsContainer } from "./styled"

export const DAOList: React.FC = () => {
  const { network, etherlink, account } = useTezos()
  const {
    data: daos,
    isLoading,
    isLoadingWithFirebase,
    signerTokenBalances,
    myEtherlinkDaoAddresses,
    isLoadingMyDaos
  } = useAllDAOs(network)

  const theme = useTheme()
  const isMobileExtraSmall = useMediaQuery(theme.breakpoints.down("xs"))
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("mobile"))

  const [searchText, setSearchText] = useQueryParam("q")
  const [selectedTab, setSelectedTab] = React.useState(0)
  const [currentPage, setCurrentPage] = useState(0)

  const [offset, setOffset] = useState(0)
  const pageCount = Math.ceil(daos ? daos.length / 16 : 0)

  const formattedDAOs = useMemo(() => {
    if (daos) {
      return daos
        .map(dao => {
          const votingAddressesCount =
            dao.dao_type.name === "lite" ? dao.votingAddressesCount : dao.ledgers ? dao.ledgers?.length : 0
          return {
            ...dao,
            id: dao.address,
            name: dao.name,
            description: dao.description,
            symbol: dao.token.symbol,
            token: dao.token?.contract || "",
            dao_type: {
              name: dao.dao_type.name
            },
            votingAddresses: dao.ledgers?.map((l: { holder: { address: any } }) => l.holder.address) || [],
            votingAddressesCount: votingAddressesCount || dao.holders_count || 0,
            allowPublicAccess: dao.dao_type.name === "lite" ? dao.allowPublicAccess : true
          }
        })
        .sort((a, b) => b.votingAddressesCount - a.votingAddressesCount)
    } else {
      return []
    }
  }, [daos])

  const currentDAOs = useMemo(() => {
    if (daos) {
      if (searchText) {
        return formattedDAOs.filter(
          formattedDao =>
            (formattedDao.name && formattedDao.name.toLowerCase().includes(searchText.toLowerCase())) ||
            (formattedDao.symbol && formattedDao.symbol.toLowerCase().includes(searchText.toLowerCase()))
        )
      }

      const slice = formattedDAOs.slice(offset, offset + 16)
      return slice
    }

    return []
  }, [daos, searchText, offset, formattedDAOs])

  const myDAOs = useMemo(() => {
    if (daos) {
      if (searchText) {
        return formattedDAOs.filter(
          formattedDao =>
            (formattedDao.name && formattedDao.name.toLowerCase().includes(searchText.toLowerCase())) ||
            (formattedDao.symbol && formattedDao.symbol.toLowerCase().includes(searchText.toLowerCase()))
        )
      }
      const accountAddress = account || etherlink?.account?.address

      return formattedDAOs.filter(dao => {
        // Tezos and Lite DAOs
        if (dao.dao_type?.name !== "etherlink_onchain") return dao.votingAddresses.includes(accountAddress)

        // Etherlink DAOs: prefer membership from iMembers, fallback to token presence
        const addrLower = (dao?.address || dao?.id || "").toLowerCase()
        const inMembers = (myEtherlinkDaoAddresses || []).includes(addrLower)
        if (inMembers) return true
        return signerTokenBalances.includes(dao.token)
      })
    }

    return []
  }, [
    daos,
    searchText,
    account,
    etherlink?.account?.address,
    formattedDAOs,
    signerTokenBalances,
    myEtherlinkDaoAddresses
  ])

  const filterDAOs = (filter: string) => {
    setSearchText(filter.trim())
  }

  const handleChangeTab = (newValue: number) => {
    setSelectedTab(newValue)
  }

  // Invoke when user click to request another page.
  const handlePageClick = (event: { selected: number }) => {
    if (daos) {
      const newOffset = (event.selected * 16) % daos.length
      setOffset(newOffset)
      setCurrentPage(event.selected)
    }
  }

  return (
    <>
      <Navbar disableMobileMenu />
      <PageContainer>
        <Grid container style={{ gap: 32 }} direction="column">
          <Grid item style={{ width: "inherit" }}>
            <Grid
              container
              justifyContent={isMobileExtraSmall ? "center" : "space-between"}
              alignItems="center"
              style={isMobileExtraSmall ? { gap: 24 } : { gap: 42 }}
            >
              <Search>
                <SearchInput defaultValue={searchText || ""} search={filterDAOs} />
              </Search>
              <Grid item>
                <Grid container style={{ gap: 22 }} justifyContent="center">
                  <Grid item>
                    <Grid container justifyContent="center" alignItems="center" style={{ height: "100%" }}>
                      <Grid item>
                        <Typography
                          style={{ fontSize: "18px", letterSpacing: "-0.18px !important" }}
                          color="textPrimary"
                        >
                          {daos?.length || 0} DAOs
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Link underline="none" href={`/creator`}>
                      <MainButton variant="contained" color="secondary">
                        Create DAO
                      </MainButton>
                    </Link>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container>
              <Grid item>
                {/* Only show tabs on Tezos networks (non-Etherlink). */}
                {!network?.startsWith("etherlink") ? (
                  <TabsContainer container>
                    <Grid item>
                      <StyledTab
                        startIcon={selectedTab === 0 ? <TabsSelectedIcon /> : <TabsIcon />}
                        variant="contained"
                        disableElevation={true}
                        onClick={() => handleChangeTab(0)}
                        isSelected={selectedTab === 0}
                      >
                        All
                      </StyledTab>
                    </Grid>
                    <Grid item>
                      <StyledTab
                        startIcon={selectedTab === 1 ? <MyDAOsSelectedIcon /> : <MyDAOsIcon />}
                        disableElevation={true}
                        variant="contained"
                        onClick={() => handleChangeTab(1)}
                        isSelected={selectedTab === 1}
                      >
                        My DAOs
                      </StyledTab>
                    </Grid>
                  </TabsContainer>
                ) : null}
              </Grid>
            </Grid>
          </Grid>
          {isLoadingWithFirebase ? (
            <Grid item>
              <LoadingLine color={theme.palette.secondary.main} height={3} barWidth={40} />
            </Grid>
          ) : null}
          <Grid item>
            <TabPanel value={selectedTab} index={0}>
              <DAOItemGrid container justifyContent={isMobileSmall ? "center" : "flex-start"}>
                {currentDAOs.map((dao, i) =>
                  dao.allowPublicAccess ? (
                    <DAOItemCard key={`dao-${i}`} item>
                      <DAOItem dao={dao} />
                    </DAOItemCard>
                  ) : null
                )}
                <Grid container direction="row" justifyContent="flex-end">
                  <ReactPaginate
                    previousLabel={"<"}
                    breakLabel="..."
                    nextLabel=">"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={2}
                    pageCount={pageCount}
                    renderOnZeroPageCount={null}
                    containerClassName={"pagination"}
                    activeClassName={"active"}
                    forcePage={currentPage}
                    nextClassName="nextButton"
                    previousClassName="nextButton"
                  />
                </Grid>

                {isLoading ? (
                  <Grid item>
                    <CircularProgress color="secondary" />
                  </Grid>
                ) : null}
              </DAOItemGrid>
            </TabPanel>
            {/* My DAOs tab content is only relevant on Tezos networks. */}
            {!network?.startsWith("etherlink") ? (
              <TabPanel value={selectedTab} index={1}>
                <DAOItemGrid container justifyContent={isMobileSmall ? "center" : "flex-start"}>
                  {network?.includes("etherlink") && isLoadingMyDaos ? (
                    <LoadingLine color={theme.palette.secondary.main} height={3} barWidth={40} />
                  ) : !(account || etherlink?.isConnected) ? (
                    <ConnectMessage />
                  ) : myDAOs.length > 0 ? (
                    myDAOs.map((dao, i) => (
                      <DAOItemCard key={`mine-${i}`} item>
                        <DAOItem dao={dao} />
                      </DAOItemCard>
                    ))
                  ) : (
                    <Typography color="textPrimary">You have not joined any DAO</Typography>
                  )}
                </DAOItemGrid>
              </TabPanel>
            ) : null}
          </Grid>
        </Grid>
      </PageContainer>
    </>
  )
}
