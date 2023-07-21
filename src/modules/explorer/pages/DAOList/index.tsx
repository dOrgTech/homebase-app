import {
  Button,
  CircularProgress,
  Grid,
  Link,
  styled,
  Typography,
  useMediaQuery,
  Theme,
  useTheme
} from "@material-ui/core"
import { Navbar } from "../../components/Toolbar"
import { TabPanel } from "modules/explorer/components/TabPanel"
import React, { useEffect, useMemo, useState } from "react"
import { useTezos } from "services/beacon/hooks/useTezos"
import { useAllDAOs } from "services/services/dao/hooks/useAllDAOs"
import { ConnectMessage } from "./components/ConnectMessage"
import { DAOItem } from "./components/DAOItem"
import { SearchInput } from "./components/Searchbar"
import { MainButton } from "../../../common/MainButton"
import { EnvKey, getEnv } from "services/config"
import { LaunchOutlined } from "@material-ui/icons"

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
  "fontSize": 16,
  "color": isSelected ? theme.palette.primary.dark : "#fff",

  "backgroundColor": isSelected ? theme.palette.secondary.main : theme.palette.primary.main,

  "&:hover": {
    backgroundColor: isSelected ? theme.palette.secondary.main : theme.palette.secondary.dark
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
  gap: "18px",

  ["@media (max-width: 1155px)"]: {
    gap: "16px"
  },

  ["@media (max-width:960px)"]: {
    gap: "14px"
  },

  ["@media (max-width:830px)"]: {
    gap: "12px"
  }
})

const DAOItemCard = styled(Grid)({
  flexBasis: "49%",

  ["@media (max-width:760px)"]: {
    minWidth: "100%"
  }
})

const BannerContainer = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.main,
  padding: "30px 48px",
  borderRadius: 8,
  display: "inline-block",
  [theme.breakpoints.down("md")]: {
    padding: "28px 38px"
  }
}))

const LinkText = styled(Typography)(({ theme }) => ({
  fontSize: 18,
  fontWeight: 200,
  lineHeight: "146.3%",
  cursor: "default",
  [theme.breakpoints.down("sm")]: {
    fontSize: 16
  },
  [theme.breakpoints.down("xs")]: {
    fontSize: 13
  }
}))

const ExternalLink = styled(Typography)({
  "display": "inline",
  "cursor": "pointer",
  "fontWeight": 200,
  "&:hover": {
    textDecoration: "underline"
  }
})

export const DAOList: React.FC = () => {
  const { network, account, tezos } = useTezos()
  const { data: daos, isLoading } = useAllDAOs(network)

  const theme = useTheme()
  const isMobileExtraSmall = useMediaQuery(theme.breakpoints.down("xs"))
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("mobile"))

  const [searchText, setSearchText] = useState("")
  const [selectedTab, setSelectedTab] = React.useState(0)

  const currentDAOs = useMemo(() => {
    if (daos) {
      const formattedDAOs = daos
        .map(dao => ({
          id: dao.address,
          name: dao.name,
          symbol: dao.token.symbol,
          votingAddresses: dao.ledgers ? dao.ledgers.map(l => l.holder.address) : [],
          dao_type: {
            name: dao.dao_type.name
          }
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

  return (
    <>
      <Navbar disableMobileMenu />
      <PageContainer>
        <Grid container style={{ gap: 42 }} direction="column">
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
                <Grid container>
                  <Grid item>
                    <StyledTab
                      variant="contained"
                      style={
                        selectedTab !== 0
                          ? { borderTopRightRadius: 0, borderBottomRightRadius: 0, zIndex: 0 }
                          : { borderRadius: 4, zIndex: 1 }
                      }
                      disableElevation={true}
                      onClick={() => handleChangeTab(0)}
                      isSelected={selectedTab === 0}
                    >
                      All
                    </StyledTab>
                  </Grid>
                  <Grid item>
                    <StyledTab
                      disableElevation={true}
                      variant="contained"
                      style={
                        selectedTab !== 1
                          ? { borderTopLeftRadius: 0, borderBottomLeftRadius: 0, marginLeft: -1, zIndex: 0 }
                          : { borderRadius: 4, marginLeft: -1, zIndex: 1 }
                      }
                      onClick={() => handleChangeTab(1)}
                      isSelected={selectedTab === 1}
                    >
                      My DAOs
                    </StyledTab>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <TabPanel value={selectedTab} index={0}>
              <DAOItemGrid container justifyContent={isMobileSmall ? "center" : "flex-start"}>
                {currentDAOs.map((dao, i) => (
                  <DAOItemCard key={`dao-${i}`} item>
                    <DAOItem dao={dao} />
                  </DAOItemCard>
                ))}

                {isLoading ? (
                  <Grid item>
                    <CircularProgress color="secondary" />
                  </Grid>
                ) : null}
              </DAOItemGrid>
            </TabPanel>
            <TabPanel value={selectedTab} index={1}>
              <DAOItemGrid container style={{ gap: 18 }} justifyContent={isMobileSmall ? "center" : "flex-start"}>
                {!account ? (
                  <ConnectMessage />
                ) : (
                  currentDAOs
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
