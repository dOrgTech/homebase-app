import {
  Redirect,
  Route,
  RouteProps,
  Switch,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";

import { DAO } from "modules/explorer/v2/pages/DAO";
import { Holdings } from "modules/explorer/pages/Holdings";
import { Proposals } from "modules/explorer/pages/Proposals";
import { Box, Grid, styled, useMediaQuery, useTheme } from "@material-ui/core";
import { useTezos } from "services/beacon/hooks/useTezos";
import { useDAO } from "services/indexer/dao/hooks/useDAO";
import { Navbar } from "modules/common/Toolbar";
import { NotFound } from "modules/explorer/components/NotFound";
import { NotIndexed } from "modules/explorer/components/NotIndexed";
import { ProposalDetails } from "modules/explorer/components/ProposalDetails";
import { UserBalancesWidget } from "modules/explorer/components/UserBalancesWidget";
import { User } from "modules/explorer/pages/User";
import { Registry } from "modules/explorer/Registry/pages/Registry";

const PageLayout = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.dark,
  width: 1028,
  maxWidth: "100%",
  margin: "auto",
}));

const NavbarContainer = styled(Box)({
  width: 1028,
  maxWidth: "100%",
});

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
