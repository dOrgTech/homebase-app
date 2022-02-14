import {
  Redirect,
  Route,
  RouteProps,
  Switch,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";

import { DAO } from "modules/explorer/pages/DAO/index";
import { Grid, styled, useMediaQuery, useTheme } from "@material-ui/core";
import { useTezos } from "services/beacon/hooks/useTezos";
import { useDAO } from "services/indexer/dao/hooks/useDAO";
import { NotFound } from "modules/explorer/components/NotFound";
import { NotIndexed } from "modules/explorer/components/NotIndexed";
import { UserBalancesWidget } from "modules/explorer/components/UserBalancesWidget";
import { User } from "modules/explorer/pages/User";
import { ProposalDetails } from "../ProposalDetails";
import { Treasury } from "../Treasury";
import { Registry } from "../Registry";
import { Proposals } from "../Proposals";
import { NFTs } from "../NFTs";
import { Navbar } from "../../components/Toolbar";
import {useHistory} from "react-router";

const PageLayout = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.dark,
  width: 1100,
  maxWidth: "100%",
  margin: "55px auto 0 auto",
  padding: "0 25px 32px 25px",

  [theme.breakpoints.down("xs")]: {
    margin: "25px auto 0 auto",
  }
}));

enum DAOState {
  NOT_FOUND = 0,
  NOT_INDEXED = 1,
  FOUND = 2,
}

const DAORouteContent: React.FC = ({ children }) => {
  const daoId = useDAOID();
  const { tezos, network } = useTezos();
  const { data, error } = useDAO(daoId);
  const [state, setState] = useState<DAOState>(DAOState.FOUND);
  const history = useHistory();

  console.log(history)

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

  useEffect(() => {
    if(history && data && data.data.network.toLowerCase() !== network.toLowerCase()) {
      history.push("/explorer")
    }
  }, [data, history, network])

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
      <Navbar>
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
          <DAORoute path={`${match.url}/proposal/:proposalId`}>
            <ProposalDetails />
          </DAORoute>
          <DAORoute path={`${match.url}/proposals`}>
            <Proposals />
          </DAORoute>
          <DAORoute path={`${match.url}/treasury`}>
            <Treasury />
          </DAORoute>
          <DAORoute path={`${match.url}/registry`}>
            <Registry />
          </DAORoute>
          <DAORoute path={`${match.url}/nfts`}>
            <NFTs />
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
