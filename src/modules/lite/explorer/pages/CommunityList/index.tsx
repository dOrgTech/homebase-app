import React, { useContext, useEffect, useMemo, useState } from "react"
import { SearchInput } from "./components/SearchBar"
import { DaoCard } from "../../components/DaoCard"
import { useHistory } from "react-router"
import { Button, Grid, styled, Theme, Typography, useMediaQuery, useTheme, CircularProgress } from "@material-ui/core"
import { Community } from "models/Community"
import axios from "axios"
import { DashboardContext } from "../../context/ActionSheets/explorer"
import { useTezos } from "services/beacon/hooks/useTezos"
import { LaunchOutlined } from "@material-ui/icons"

const PageContainer = styled("div")({
  marginBottom: 50,
  width: "1000px",
  height: "100%",
  margin: "auto",
  padding: "28px 0",
  boxSizing: "border-box",
  paddingTop: 0,

  ["@media (max-width: 1425px)"]: {},

  ["@media (max-width:1335px)"]: {},

  ["@media (max-width:1167px)"]: {
    width: "86vw"
  },

  ["@media (max-width:1030px)"]: {},

  ["@media (max-width:960px)"]: {},

  ["@media (max-width:645px)"]: {
    flexDirection: "column"
  }
})

const ButtonLabel = styled(Button)(({ theme }) => ({
  fontSize: 15,
  [theme.breakpoints.down("sm")]: {
    fontSize: 14,
    padding: "8px !important"
  }
}))

const CommunitiesContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    marginTop: 24,
    marginBottom: 24
  }
}))

const BannerContainer = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.main,
  marginBottom: 40,
  padding: "30px 48px",
  borderRadius: 8,
  display: "inline-block",
  [theme.breakpoints.down("md")]: {
    padding: "28px 38px"
  }
}))

const ExternalLink = styled(Typography)({
  "display": "inline",
  "cursor": "pointer",
  "&:hover": {
    textDecoration: "underline"
  }
})

const ExternalLinkIcon = styled(LaunchOutlined)({
  fontSize: 14,
  marginBottom: 2
})

export const CommunityList: React.FC = () => {
  const theme: Theme = useTheme()
  const navigate = useHistory()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"))
  const [communities, setCommunities] = useState<Community[]>([])
  const [communitiesList, setCommunitiesList] = useState<Community[]>([])
  const [error, setError] = useState(false)
  const [isUpdated, setIsUpdated] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const { isConnected } = useContext(DashboardContext)
  const { network } = useTezos()

  const filterData = (list: Community[]) => {
    if (!isConnected) {
      return list.filter(elem => elem.allowPublicAccess)
    }
    return list
  }

  const search = (filter: any) => {
    if (filter !== "") {
      const updatedCommunitiesList = filterData(communitiesList).filter((community: Community) => {
        return community.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1
      })
      setCommunities(updatedCommunitiesList)
    } else {
      setCommunities(filterData(communitiesList))
    }
  }

  const getCommunities = (network: string) => {
    setIsLoading(true)
    axios
      .post(`${process.env.REACT_APP_API_URL}/daos/`, {
        network
      })
      .then(response => {
        if (!response.status) {
          setError(true)
          return
        }
        setCommunities(response.data)
        setCommunitiesList(response.data)
        setIsLoading(false)
      })
      .catch(err => {
        setIsLoading(false)
        setError(true)
      })
  }

  useEffect(() => {
    getCommunities(network)
  }, [isUpdated, network])

  useEffect(() => {
    if (!isConnected) {
      const filteredCommunities = communitiesList.filter(elem => elem.allowPublicAccess)
      setCommunities(filteredCommunities)
    } else {
      setCommunities(communitiesList)
    }
  }, [isConnected, communitiesList])

  const goToHomebase = () => {
    window.open("https://tezos-homebase.io/")
  }

  return (
    <PageContainer>
      <Grid container direction="column">
        <Grid item>
          <BannerContainer container alignItems="center" direction="row">
            <Typography variant="h2" color="textPrimary" style={{ display: "inline" }}>
              Need on-chain execution? Set up a DAO contract{" "}
            </Typography>{" "}
            <ExternalLink variant="h2" color="secondary" onClick={goToHomebase}>
              {" "}
              here
              <ExternalLinkIcon color="secondary" />{" "}
            </ExternalLink>
          </BannerContainer>
        </Grid>
        <Grid item>
          <Grid container justifyContent={isMobile ? "center" : "space-between"} alignItems="center">
            <Grid item xs={12} sm={6}>
              <SearchInput search={search} />
            </Grid>
            <Grid item>
              <Grid container style={{ gap: isMobileSmall ? 10 : isMobile ? 0 : 22 }} justifyContent="center">
                <Grid item>
                  <Grid container justifyContent="center" alignItems="center" style={{ height: "100%" }}>
                    <Grid item>
                      <Typography color="textPrimary">{error ? 0 : communities.length} communities</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <CommunitiesContainer item>
                  <ButtonLabel variant="contained" color="secondary" onClick={() => navigate.push("/creator")}>
                    Create Community
                  </ButtonLabel>
                </CommunitiesContainer>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {error && !isLoading ? (
          <Grid container>
            <Typography variant="body1" color="textPrimary">
              No communities found
            </Typography>
          </Grid>
        ) : null}

        {isLoading ? (
          <Grid container direction="row" justifyContent="center">
            <CircularProgress color="secondary" />
          </Grid>
        ) : null}
        <Grid container spacing={3}>
          {!isLoading &&
            communities &&
            communities.map(elem => (
              <Grid item xs={6} md={4} lg={3} xl={3} key={elem._id}>
                <DaoCard community={elem} setIsUpdated={setIsUpdated} />
              </Grid>
            ))}
        </Grid>
      </Grid>
    </PageContainer>
  )
}
