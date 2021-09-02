import {
  Redirect,
  Route,
  RouteProps,
  Switch,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";

import { DAO } from "modules/explorer/pages/DAO";
import { Holdings } from "modules/explorer/pages/Holdings";
import { Proposals } from "modules/explorer/pages/Proposals";
import { Registry } from "./Registry/pages/Registry";
import { Grid, styled, useMediaQuery, useTheme } from "@material-ui/core";
import { ProposalDetails } from "./components/ProposalDetails";
import { useTezos } from "services/beacon/hooks/useTezos";
import { useDAO } from "services/indexer/dao/hooks/useDAO";
import { NotFound } from "./components/NotFound";
import { NotIndexed } from "./components/NotIndexed";
import { User } from "./pages/User";
import { SideBar } from "./components";
import { Navbar } from "modules/common/Toolbar";
import { UserBalancesWidget } from "./components/UserBalancesWidget";

const PageLayout = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.main,
  minHeight: "calc(100vh - 102px)",
  [theme.breakpoints.down("xs")]: {
    minHeight: "calc(100vh - 102px)",
    marginBottom: 53,
  },
}));

enum DAOState {
  NOT_FOUND = 0,
  NOT_INDEXED = 1,
  FOUND = 2,
}

const DAORouteContent: React.FC = ({ children }) => {
  const daoId = useDAOID();
  const { tezos } = useTezos();
  const { data, error } = useDAO(daoId);
  const [state, setState] = useState<DAOState>(DAOState.FOUND);

  useEffect(() => {
    (async () => {
      if (!data && !!error) {
        try {
          await tezos.contract.at(daoId);
          setState(DAOState.NOT_INDEXED);
        } catch (e) {
          setState(DAOState.NOT_FOUND);
        }
      }
    })();
  }, [data, error, daoId, tezos.contract]);

  return (
    <>
      {state === DAOState.NOT_FOUND ? (
        <NotFound />
      ) : state === DAOState.NOT_INDEXED ? (
        <NotIndexed address={daoId} />
      ) : (
        children
      )}
    </>
  );
};

const DAORoute: React.FC<RouteProps> = ({ children, ...props }) => {
  return (
    <Route {...props}>
      <DAORouteContent>{children}</DAORouteContent>
    </Route>
  );
};

const DAOContext = React.createContext("");

const DAOProvider: React.FC<{ daoId: string }> = ({ daoId, children }) => {
  return <DAOContext.Provider value={daoId}>{children}</DAOContext.Provider>;
};

export const useDAOID = () => {
  return useContext(DAOContext);
};

export const DAORouter = (): JSX.Element => {
  const match = useRouteMatch();
  const theme = useTheme();
  const isMobileExtraSmall = useMediaQuery(theme.breakpoints.down("xs"));
  const { id: daoId } = useParams<{ id: string }>();

  return (
    <DAOProvider daoId={daoId}>
      <Navbar mode="explorer">
        <Grid item>
          <UserBalancesWidget />
        </Grid>
      </Navbar>
      <PageLayout
        container
        wrap="nowrap"
        direction={isMobileExtraSmall ? "column" : "row"}
      >
        <SideBar />
        <Switch>
          <DAORoute path={`${match.url}/proposal/treasury/:proposalId`}>
            <ProposalDetails />
          </DAORoute>
          <DAORoute path={`${match.url}/proposal/registry/:proposalId`}>
            <ProposalDetails />
          </DAORoute>
          <DAORoute path={`${match.url}/proposals`}>
            <Proposals />
          </DAORoute>
          <DAORoute path={`${match.url}/treasury`}>
            <Holdings />
          </DAORoute>
          <DAORoute path={`${match.url}/registry`}>
            <Registry />
          </DAORoute>
          <DAORoute path={`${match.url}/user`}>
            <User />
          </DAORoute>
          <DAORoute path={`${match.url}/overview`}>
            <DAO />
          </DAORoute>
          <Redirect from={`${match.url}`} to={`${match.url}/overview`} />
        </Switch>
      </PageLayout>
    </DAOProvider>
  );
};
