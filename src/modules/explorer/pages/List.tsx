import {
  Box,
  CircularProgress,
  Grid,
  Link,
  makeStyles,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
  withTheme,
} from "@material-ui/core";
import React, { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";

import { SearchInput } from "modules/explorer/components/SearchInput";
import { PrimaryButton } from "../components/styled/PrimaryButton";
import { AppTabBar } from "../components/AppTabBar";
import { TabPanel } from "../components/TabPanel";
import { useTezos } from "services/beacon/hooks/useTezos";
import { useAllDAOs } from "services/indexer/dao/hooks/useAllDAOs";
import { Navbar } from "modules/common/Toolbar";
import mixpanel from "mixpanel-browser";

const GridContainer = styled(Grid)({
  background: "inherit",
  padding: 37,
});

const styles = makeStyles({
  root: {
    borderRadius: "4px 4px 0px 0px",
    maxWidth: 135,
    marginRight: 10,
    background: "#3D3D3D",
    "&:before": {
      opacity: 0.5,
    },
  },
  selected: {
    background: "rgba(124, 255, 181, 0.15)",
    "&:before": {
      opacity: 0.15,
    },
  },
});

const TotalDao = styled(Typography)({
  padding: "0 37px",
  lineHeight: "124.3%",
  letterSpacing: "-0.01em",
});

const DaoContainer = styled(withTheme(Grid))((props) => ({
  minHeight: 179,
  border: `2px solid ${props.theme.palette.primary.light}`,
  boxSizing: "border-box",
  background: props.theme.palette.primary.main,
  boxShadow: "none",
  borderRadius: 0,
  padding: "50px 37px",
  borderTop: "none",
  wordBreak: "break-all",
  "&:nth-child(odd)": {
    borderLeft: "none",
  },
  "&:nth-child(even)": {
    borderRight: "none",
    borderLeft: "none",
  },
  "&:hover": {
    background: "rgba(129, 254, 183, 0.03)",
    borderLeft: `2px solid ${props.theme.palette.secondary.light}`,
    cursor: "pointer",
  },
}));

const GridBackground = styled(Grid)(({ theme }) => ({
  background: "inherit",
  borderTop: `2px solid ${theme.palette.primary.light}`,
}));

const LoaderContainer = styled(Grid)({
  paddingTop: 40,
  paddingBottom: 40,
});

const DaoTotalContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    order: 2,
  },
}));

const CreateDaoContainer = styled(Grid)({
  margin: "20px 0",
});

interface DAOItem {
  id: string;
  name: string;
  symbol: string;
  votingAddresses: string[];
}

const DAOItem: React.FC<{ dao: DAOItem }> = ({ dao }) => {
  const theme = useTheme();
  const isMobileExtraSmall = useMediaQuery(theme.breakpoints.down("xs"));
  const history = useHistory();

  return (
    <DaoContainer
      item
      xs={12}
      sm={6}
      onClick={() => history.push(`/explorer/dao/${dao.id}`)}
    >
      <Typography
        variant="subtitle1"
        color="secondary"
        align={isMobileExtraSmall ? "center" : "left"}
      >
        {dao.symbol}
      </Typography>
      <Grid container direction="row" alignItems="center" spacing={2}>
        <Grid item xs={12} lg={6}>
          <Typography
            variant="h5"
            color="textSecondary"
            align={isMobileExtraSmall ? "center" : "left"}
          >
            {dao.name}
          </Typography>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Typography
            variant="subtitle1"
            color="textSecondary"
            align={isMobileExtraSmall ? "center" : "left"}
          >
            {dao.votingAddresses.length} VOTING ADDRESSES
          </Typography>
        </Grid>
      </Grid>
    </DaoContainer>
  );
};

export const DAOsList: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedTab, setSelectedTab] = React.useState(0);
  const style = styles();
  const { network, account, connect } = useTezos();
  const { data: daos, isLoading } = useAllDAOs(network);
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isMobileExtraSmall = useMediaQuery(theme.breakpoints.down("xs"));

  const currentDAOs = useMemo(() => {
    if (daos) {
      const formattedDAOs = daos.map((dao) => ({
        id: dao.address,
        name: dao.name,
        symbol: dao.token.symbol,
        votingAddresses: dao.ledgers.map((l) => l.holder.address),
      }));

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

  const history = useHistory();

  const filterDAOs = (filter: string) => {
    setSearchText(filter.trim());
  };

  useEffect(() => {
    mixpanel.unregister("daoAddress")
    mixpanel.unregister("daoType")
  }, [])

  return (
    <>
      <Navbar mode="explorer" />
      <Box bgcolor="primary.main" width="100%" height="100%">
        <GridContainer
          container
          direction="row"
          alignItems="center"
          justify="center"
        >
          <Grid item xs={12} md={6}>
            <SearchInput search={filterDAOs} />
          </Grid>
          <Grid
            container
            item
            direction="row"
            justify={isMobileSmall ? "center" : "flex-end"}
            alignItems="center"
            alignContent="center"
            xs={12}
            md={6}
          >
            <DaoTotalContainer item>
              <TotalDao color="textSecondary" variant="subtitle1" align="right">
                {currentDAOs.length} DAOs
              </TotalDao>
            </DaoTotalContainer>
            <CreateDaoContainer item>
              <PrimaryButton
                color="secondary"
                variant="outlined"
                onClick={() => history.push("/creator")}
                fullWidth={isMobileExtraSmall}
              >
                Create DAO
              </PrimaryButton>
            </CreateDaoContainer>
          </Grid>
        </GridContainer>

        <>
          <AppTabBar
            class1={style}
            value={selectedTab}
            setValue={setSelectedTab}
            labels={["ALL", "MY DAOS"]}
          />
          <TabPanel value={selectedTab} index={0}>
            <GridBackground container direction="row">
              {currentDAOs.map((dao, i) => (
                <DAOItem key={`current-${i}`} dao={dao} />
              ))}
              {isLoading ? (
                <LoaderContainer container direction="row" justify="center">
                  <CircularProgress color="secondary" />
                </LoaderContainer>
              ) : null}
            </GridBackground>
          </TabPanel>
          <TabPanel value={selectedTab} index={1}>
            <GridBackground container direction="row">
              {!account ? (
                <Box width="100%" padding="50px">
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    align={"center"}
                  >
                    <Link
                      color="secondary"
                      onClick={() => connect()}
                      style={{ cursor: "pointer" }}
                    >
                      Connect your wallet
                    </Link>{" "}
                    to see which DAOs you hold a stake in
                  </Typography>
                </Box>
              ) : (
                currentDAOs
                  .filter((dao) => dao.votingAddresses.includes(account))
                  .map((dao, i) => <DAOItem key={`mine-${i}`} dao={dao} />)
              )}
            </GridBackground>
          </TabPanel>
        </>
      </Box>
    </>
  );
};
