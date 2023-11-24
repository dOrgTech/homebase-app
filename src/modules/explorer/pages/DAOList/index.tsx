import {
  Button,
  CircularProgress,
  Grid,
  Link,
  styled,
  Typography,
  useMediaQuery,
  Theme,
  useTheme,
  Icon
} from "@material-ui/core"
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

const PageContainer = styled("div")(({ theme }) => ({
  width: "1000px",
  height: "100%",
  margin: "auto",

  ["@media (max-width: 1425px)"]: {},

  ["@media (max-width:1335px)"]: {},

  ["@media (max-width:1167px)"]: {
    width: "86vw"
  },

  ["@media (max-width:1030px)"]: {},

  ["@media (max-width:960px)"]: {}
}))

const StyledTab = styled(Button)(({ theme, isSelected }: { theme: Theme; isSelected: boolean }) => ({
  "fontSize": 18,
  "height": 40,
  "fontWeight": 400,
  "paddingLeft": 20,
  "paddingRight": 20,
  "paddingTop": 0,
  "paddingBottom": 0,
  "borderRadius": 8,
  "color": isSelected ? theme.palette.secondary.main : "#fff",
  "backgroundColor": isSelected ? "rgba(129, 254, 183, 0.20)" : "inherit",
  "&:hover": {
    backgroundColor: isSelected ? "rgba(129, 254, 183, 0.20)" : theme.palette.secondary.dark,
    borderRadius: 8,
    borderTopLeftRadius: "8px !important",
    borderTopRightRadius: "8px !important",
    borderBottomLeftRadius: "8px !important",
    borderBottomRightRadius: "8px !important"
  }
}))

const Search = styled(Grid)({
  width: "49.5%",

  ["@media (max-width: 645px)"]: {
    width: "100%",
    marginTop: "14px"
  }
})

const DAOItemGrid = styled(Grid)({
  gap: "30px",
  justifyContent: "space-between",
  ["@media (max-width: 1155px)"]: {
    gap: "32px"
  },

  ["@media (max-width:960px)"]: {
    gap: "14px"
  },

  ["@media (max-width:830px)"]: {
    width: "86vw",
    gap: "12px"
  }
})

const DAOItemCard = styled(Grid)({
  flexBasis: "48.5%",

  ["@media (max-width:1500px)"]: {
    flexBasis: "48.5%"
  },

  ["@media (max-width:1200px)"]: {
    flexBasis: "47.5%"
  },

  ["@media (max-width:760px)"]: {
    minWidth: "100%"
  }
})

const TabsContainer = styled(Grid)(({ theme }) => ({
  borderRadius: 8,
  gap: 30
}))

export const DAOList: React.FC = () => {
  const { network, account, tezos } = useTezos()
  const { data: daos, isLoading } = useAllDAOs(network)

  console.log(daos)

  const theme = useTheme()
  const isMobileExtraSmall = useMediaQuery(theme.breakpoints.down("xs"))
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("mobile"))

  const [searchText, setSearchText] = useState("")
  const [selectedTab, setSelectedTab] = React.useState(0)
  const [currentPage, setCurrentPage] = useState(0)

  const [offset, setOffset] = useState(0)
  const pageCount = Math.ceil(daos ? daos.length / 16 : 0)

  const currentDAOs = useMemo(() => {
    if (daos) {
      const formattedDAOs = daos
        .map(dao => ({
          id: dao.address,
          name: dao.name,
          description: dao.description,
          symbol: dao.token.symbol,
          votingAddresses: dao.ledgers ? dao.ledgers.map(l => l.holder.address) : [],
          votingAddressesCount:
            dao.dao_type.name === "lite" ? dao.votingAddressesCount : dao.ledgers ? dao.ledgers?.length : 0,
          dao_type: {
            name: dao.dao_type.name
          },
          allowPublicAccess: dao.dao_type.name === "lite" ? dao.allowPublicAccess : true
        }))
        .sort((a, b) => b.votingAddressesCount - a.votingAddressesCount)

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
  }, [daos, searchText, offset])

  const myDAOs = useMemo(() => {
    if (daos) {
      const formattedDAOs = daos
        .map(dao => ({
          id: dao.address,
          name: dao.name,
          symbol: dao.token.symbol,
          votingAddresses: dao.ledgers ? dao.ledgers.map(l => l.holder.address) : [],
          votingAddressesCount:
            dao.dao_type.name === "lite" ? dao.votingAddressesCount : dao.ledgers ? dao.ledgers?.length : 0,
          dao_type: {
            name: dao.dao_type.name
          },
          description: dao.description,
          allowPublicAccess: dao.dao_type.name === "lite" ? dao.allowPublicAccess : true
        }))
        .sort((a, b) => b.votingAddresses.length - a.votingAddresses.length)

      if (searchText) {
        return formattedDAOs.filter(
          formattedDao =>
            (formattedDao.name && formattedDao.name.toLowerCase().includes(searchText.toLowerCase())) ||
            (formattedDao.symbol && formattedDao.symbol.toLowerCase().includes(searchText.toLowerCase()))
        )
      }
      return formattedDAOs
    }

    return []
  }, [daos, searchText])

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
          <Grid item>
            <Grid
              container
              justifyContent={isMobileExtraSmall ? "center" : "space-between"}
              alignItems="center"
              style={{ gap: 42 }}
            >
              <Search>
                <SearchInput search={filterDAOs} />
              </Search>
              <Grid item>
                <Grid container style={{ gap: 22 }} justifyContent="center">
                  <Grid item>
                    <Grid container justifyContent="center" alignItems="center" style={{ height: "100%" }}>
                      <Grid item>
                        <Typography style={{ fontSize: "18px" }} color="textPrimary">
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
              </Grid>
            </Grid>
          </Grid>
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
                  />
                </Grid>

                {isLoading ? (
                  <Grid item>
                    <CircularProgress color="secondary" />
                  </Grid>
                ) : null}
              </DAOItemGrid>
            </TabPanel>
            <TabPanel value={selectedTab} index={1}>
              <DAOItemGrid container justifyContent={isMobileSmall ? "center" : "flex-start"}>
                {!account ? (
                  <ConnectMessage />
                ) : (
                  myDAOs
                    .filter(dao => dao.votingAddresses.includes(account))
                    .map((dao, i) => (
                      <DAOItemCard key={`mine-${i}`} item>
                        <DAOItem dao={dao} />
                      </DAOItemCard>
                    ))
                )}
              </DAOItemGrid>
            </TabPanel>
          </Grid>
        </Grid>
      </PageContainer>
    </>
  )
}
