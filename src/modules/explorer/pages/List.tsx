import {
  Box,
  CircularProgress,
  Grid,
  makeStyles,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
  withTheme
} from "@material-ui/core";
import React, { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";

import { SearchInput } from "modules/explorer/components/SearchInput";
import { useDAOs } from "services/contracts/baseDAO/hooks/useDAOs";
import { PrimaryButton } from "../components/styled/PrimaryButton";
import { AppTabBar } from "../components/AppTabBar";
import { TabPanel } from "../components/TabPanel";
import { useCacheDAOs } from "services/contracts/baseDAO/hooks/useCacheDAOs";
import { DAOListMetadata } from "services/contracts/metadataCarrier/types";

const GridContainer = styled(Grid)({
  background: "inherit",
  padding: 37
});

const styles = makeStyles({
  root: {
    borderRadius: "4px 4px 0px 0px",
    maxWidth: 135,
    marginRight: 10,
    background: "#3D3D3D",
    "&:before": {
      opacity:  0.5,
    }
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
  letterSpacing: "-0.01em"
});

const DaoContainer = styled(withTheme(Grid))(props => ({
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
    borderLeft: "none"
  },
  "&:nth-child(even)": {
    borderRight: "none",
    borderLeft: "none"
  },
  "&:hover": {
    background: "rgba(129, 254, 183, 0.03)",
    borderLeft: `2px solid ${props.theme.palette.secondary.light}`,
    cursor: "pointer"
  }
}));

const GridBackground = styled(Grid)(({ theme }) => ({
  background: "inherit",
  borderTop: `2px solid ${theme.palette.primary.light}`
}));

const LoaderContainer = styled(Grid)({
  paddingTop: 40,
  paddingBottom: 40
});

const DaoTotalContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    order: 2
  }
}));

const CreateDaoContainer = styled(Grid)({
  margin: "20px 0"
});

export const DAOsList: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedTab, setSelectedTab] = React.useState(0);
  const style = styles();
  const {
    data,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage
  } = useDAOs();

  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isMobileExtraSmall = useMediaQuery(theme.breakpoints.down("xs"));

  const { daos: recent } = useCacheDAOs();

  const daos = useMemo<DAOListMetadata[]>(() => {
    if (!data) {
      return [];
    }

    return data.pages.flat();
  }, [data]);

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const currentDAOs = useMemo(() => {
    if (daos) {
      const formattedDAOs = daos.map(dao => ({
        id: dao.address,
        name: dao.unfrozenToken.name,
        symbol: dao.unfrozenToken.symbol,
      }));

      if (searchText) {
        return formattedDAOs.filter(
          formattedDao =>
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

  return (
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
          labels={["ALL", "RECENT"]}
        />
        <TabPanel value={selectedTab} index={0}>
          <GridBackground container direction="row">
            {currentDAOs.map((dao, index: any) => {
              return (
                <DaoContainer
                  item
                  xs={12}
                  sm={6}
                  key={index}
                  onClick={() => history.push(`/explorer/dao/${dao.id}`)}
                >
                  <Typography
                    variant="subtitle1"
                    color="secondary"
                    align={isMobileExtraSmall ? "center" : "left"}
                  >
                    {dao.symbol}
                  </Typography>
                  <Grid container direction="row" alignItems="center">
                    <Grid item xs={12} lg={6}>
                      <Typography
                        variant="h5"
                        color="textSecondary"
                        align={isMobileExtraSmall ? "center" : "left"}
                      >
                        {dao.name}
                      </Typography>
                    </Grid>
                    {/* <Grid item xs={12} lg={6}>
                      <Typography
                        variant="subtitle1"
                        color="textSecondary"
                        align={isMobileExtraSmall ? "center" : "left"}
                      >
                        {dao.voting_addresses} VOTING ADDRESSES
                      </Typography>
                    </Grid> */}
                  </Grid>
                </DaoContainer>
              );
            })}
            {isFetchingNextPage || isLoading ? (
              <LoaderContainer container direction="row" justify="center">
                <CircularProgress color="secondary" />
              </LoaderContainer>
            ) : null}
          </GridBackground>
        </TabPanel>
        <TabPanel value={selectedTab} index={1}>
        <GridBackground container direction="row">
            {recent.map((dao: any, index: any) => {
              return (
                <DaoContainer
                  item
                  xs={12}
                  sm={6}
                  key={index}
                  onClick={() => history.push(`/explorer/dao/${dao.id}`)}
                >
                  <Typography
                    variant="subtitle1"
                    color="secondary"
                    align={isMobileExtraSmall ? "center" : "left"}
                  >
                    {dao.symbol}
                  </Typography>
                  <Grid container direction="row" alignItems="center">
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
                        {dao.voting_addresses} VOTING ADDRESSES
                      </Typography>
                    </Grid>
                  </Grid>
                </DaoContainer>
              );
            })}
          </GridBackground>
        </TabPanel>
      </>
    </Box>
  );
};
