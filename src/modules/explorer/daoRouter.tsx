import {
  Redirect,
  Route,
  RouteProps,
  Switch,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import React, { useEffect, useState } from "react";

import { DAO } from "modules/explorer/pages/DAO";
import { Holdings } from "modules/explorer/pages/Holdings";
import { Proposals } from "modules/explorer/pages/Proposals";
import { Registry } from "./Registry/pages/Registry";
import { Grid, styled, useMediaQuery, useTheme } from "@material-ui/core";
import { SideBar } from "./components";
import { ProposalDetails } from "./components/ProposalDetails";
import { useTezos } from "services/beacon/hooks/useTezos";
import { useDAO } from "services/indexer/dao/hooks/useDAO";
import { NotFound } from "./components/NotFound";
import { NotIndexed } from "./components/NotIndexed";

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
  const { id } = useParams<{ id: string }>();
  const { tezos } = useTezos();
  const { data, error } = useDAO(id);
  const [state, setState] = useState<DAOState>(DAOState.FOUND);

  useEffect(() => {
    (async () => {
      if (!data && !!error) {
        try {
          await tezos.contract.at(id);
          setState(DAOState.NOT_INDEXED);
        } catch (e) {
          setState(DAOState.NOT_FOUND);
        }
      }
    })();
  }, [data, error, id, tezos.contract]);

  return (
    <>
      {state === DAOState.NOT_FOUND ? (
        <NotFound />
      ) : state === DAOState.NOT_INDEXED ? (
        <NotIndexed address={id} />
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

export const DAORouter = (): JSX.Element => {
  const match = useRouteMatch();
  const theme = useTheme();
  const isMobileExtraSmall = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <PageLayout
      container
      wrap="nowrap"
      direction={isMobileExtraSmall ? "column" : "row"}
    >
      <Switch>
        <DAORoute path={`${match.url}/:id/proposal/treasury/:proposalId`}>
          <SideBar />
          <ProposalDetails />
        </DAORoute>
        <DAORoute path={`${match.url}/:id/proposal/registry/:proposalId`}>
          <SideBar />
          <ProposalDetails />
        </DAORoute>
        <DAORoute path={`${match.url}/:id/proposals`}>
          <SideBar />
          <Proposals />
        </DAORoute>
        <DAORoute path={`${match.url}/:id/treasury`}>
          <SideBar />
          <Holdings />
        </DAORoute>
        <DAORoute path={`${match.url}/:id/registry`}>
          <SideBar />
          <Registry />
        </DAORoute>
        <DAORoute path={`${match.url}/:id/overview`}>
          <SideBar />
          <DAO />
        </DAORoute>
        <Redirect from={`${match.url}/:id`} to={`${match.url}/:id/overview`} />
      </Switch>
    </PageLayout>
  );
};
