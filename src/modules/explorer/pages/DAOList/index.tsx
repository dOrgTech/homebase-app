import {
  Button,
  CircularProgress,
  Grid,
  Link,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Navbar } from "../../components/Toolbar";
import { TabPanel } from "modules/explorer/components/TabPanel";
import React, { useMemo, useState } from "react";
import { useTezos } from "services/beacon/hooks/useTezos";
import { useAllDAOs } from "services/indexer/dao/hooks/useAllDAOs";
import { ConnectMessage } from "./components/ConnectMessage";
import { DAOItem } from "./components/DAOItem";
import { SearchInput } from "./components/Searchbar";

const PageContainer = styled("div")(({ theme }) => ({
  width: "100%",
  maxWidth: 1186,
  height: "100%",
  margin: "auto",

  [theme.breakpoints.down("md")]: {
    padding: "18px",
    boxSizing: "border-box",
  },
}));

const StyledTab = styled(Button)({
  fontSize: 16,
});

export const DAOList: React.FC = () => {
  const { network, account } = useTezos();
  const { data: daos, isLoading } = useAllDAOs(network);

  const theme = useTheme();
  const isMobileExtraSmall = useMediaQuery(theme.breakpoints.down("xs"));
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const [searchText, setSearchText] = useState("");
  const [selectedTab, setSelectedTab] = React.useState(0);

  const currentDAOs = useMemo(() => {
    if (daos) {
      const formattedDAOs = daos.map((dao) => ({
        id: dao.address,
        name: dao.name,
        symbol: dao.token.symbol,
        votingAddresses: dao.ledgers.map((l) => l.holder.address),
      })).sort((a, b) => b.votingAddresses.length - a.votingAddresses.length);

      if (searchText) {
        return formattedDAOs.filter(
          (formattedDao) =>
            formattedDao.name
              .toLowerCase()
              .includes(searchText.toLowerCase()) ||
            formattedDao.symbol.toLowerCase().includes(searchText.toLowerCase())
        );
      }

      return formattedDAOs;
    }

    return [];
  }, [daos, searchText]);

  const filterDAOs = (filter: string) => {
    setSearchText(filter.trim());
  };

  const handleChangeTab = (newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <>
      <Navbar disableMobileMenu/>
      <PageContainer>
        <Grid container style={{ gap: 42 }} direction="column">
          <Grid item>
            <Grid
              container
              justifyContent={isMobileExtraSmall ? "center" : "space-between"}
              alignItems="center"
              style={{ gap: 42 }}
            >
              <Grid item xs={8} sm={6}>
                <SearchInput search={filterDAOs} />
              </Grid>
              <Grid item>
                <Grid container style={{ gap: 22 }} justifyContent="center">
                  <Grid item>
                    <Grid
                      container
                      justifyContent="center"
                      alignItems="center"
                      style={{ height: "100%" }}
                    >
                      <Grid item>
                        <Typography color="textPrimary">
                          {daos?.length || 0} DAOs
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Link underline="none" href={`/creator`}>
                      <Button variant="contained" color="secondary">
                        Create DAO
                      </Button>
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
                      color={selectedTab !== 0 ? "primary" : "secondary"}
                      style={selectedTab !==0 ? {borderTopRightRadius: 0, borderBottomRightRadius: 0, zIndex:0} : {borderRadius: 4, zIndex: 1}}
                      disableRipple={true}
                      disableElevation={true}
                      onClick={() => handleChangeTab(0)}
                    >
                      All
                    </StyledTab>
                  </Grid>
                  <Grid item>
                  
                    <StyledTab
                      disableRipple={true}
                      disableElevation={true}
                      variant="contained"
                      color={selectedTab !== 1 ? "primary" : "secondary"}
                      style={selectedTab !==1 ? {borderTopLeftRadius: 0, borderBottomLeftRadius: 0, marginLeft: -1, zIndex: 0} : {borderRadius: 4, marginLeft: -1, zIndex: 1}}
                      onClick={() => handleChangeTab(1)}
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
              <Grid
                container
                style={{ gap: 18 }}
                justifyContent={isMobileSmall ? "center" : "flex-start"}
              >
                {currentDAOs.map((dao, i) => (
                  <Grid key={`dao-${i}`} item>
                    <DAOItem dao={dao} />
                  </Grid>
                ))}

                {isLoading ? (
                  <Grid item>
                    <CircularProgress color="secondary" />
                  </Grid>
                ) : null}
              </Grid>
            </TabPanel>
            <TabPanel value={selectedTab} index={1}>
              <Grid
                container
                style={{ gap: 18 }}
                justifyContent={isMobileSmall ? "center" : "flex-start"}
              >
                {!account ? (
                  <ConnectMessage />
                ) : (
                  currentDAOs
                    .filter((dao) => dao.votingAddresses.includes(account))
                    .map((dao, i) => (
                      <Grid key={`mine-${i}`} item>
                        <DAOItem dao={dao} />
                      </Grid>
                    ))
                )}
              </Grid>
            </TabPanel>
          </Grid>
        </Grid>
      </PageContainer>
    </>
  );
};
