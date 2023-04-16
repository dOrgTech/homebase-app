import { styled, useTheme } from "@material-ui/core"
import { NotFound } from "modules/explorer/components/NotFound"
import { NotIndexed } from "modules/explorer/components/NotIndexed"
import { DAO } from "modules/explorer/pages/DAO/index"
import { User } from "modules/explorer/pages/User"
import React, { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router"
import { Redirect, Route, RouteProps, Switch, useParams, useRouteMatch } from "react-router-dom"
import { Network } from "services/beacon"
import { useTezos } from "services/beacon/hooks/useTezos"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { Navbar } from "../../components/Toolbar"
import { Config } from "../Config"
import { ProposalDetails } from "../ProposalDetails"
import { Proposals } from "../Proposals"
import { Registry } from "../Registry"
import { Treasury } from "../Treasury"

const PageLayout = styled("div")(({ theme }) => ({
  background: theme.palette.primary.dark,
  width: "1000px",
  margin: "42px auto 0px auto",

  ["@media (max-width: 1425px)"]: {},

  ["@media (max-width:1335px)"]: {},

  ["@media (max-width:1167px)"]: {
    width: "86vw"
  },

  ["@media (max-width:1030px)"]: {},

  ["@media (max-width:960px)"]: {
    marginTop: 0
  }
}))

enum DAOState {
  NOT_FOUND = 0,
  NOT_INDEXED = 1,
  FOUND = 2
}

const DAORouteContent: React.FC = ({ children }) => {
  const daoId = useDAOID()
  const { tezos, network, changeNetwork } = useTezos()
  const { data, error } = useDAO(daoId)
  const [state, setState] = useState<DAOState>(DAOState.FOUND)
  const history = useHistory()

  useEffect(() => {
    ;(async () => {
      if (!data && !!error) {
        try {
          await tezos.contract.at(daoId)
          setState(DAOState.NOT_INDEXED)
        } catch (e) {
          setState(DAOState.NOT_FOUND)
        }
      }
    })()
  }, [data, error, daoId, tezos.contract])

  useEffect(() => {
    if (history && data && data.data.network.toLowerCase() !== network.toLowerCase()) {
      changeNetwork(data.data.network.toLowerCase() as Network)
    }
  }, [data, history, network, changeNetwork])

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
  )
}

const DAORoute: React.FC<RouteProps> = ({ children, ...props }) => {
  return (
    <Route {...props}>
      <DAORouteContent>{children}</DAORouteContent>
    </Route>
  )
}

const DAOContext = React.createContext("")

const DAOProvider: React.FC<{ daoId: string }> = ({ daoId, children }) => {
  return <DAOContext.Provider value={daoId}>{children}</DAOContext.Provider>
}

export const useDAOID = () => {
  return useContext(DAOContext)
}

export const DAORouter = (): JSX.Element => {
  const match = useRouteMatch()
  const theme = useTheme()
  const { id: daoId } = useParams<{ id: string }>()

  return (
    <DAOProvider daoId={daoId}>
      <Navbar />
      <PageLayout>
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
          <DAORoute path={`${match.url}/user`}>
            <User />
          </DAORoute>
          <DAORoute path={`${match.url}/config`}>
            <Config />
          </DAORoute>
          <DAORoute path={`${match.url}/overview`}>
            <DAO />
          </DAORoute>
          <Redirect from={`${match.url}`} to={`${match.url}/overview`} />
        </Switch>
      </PageLayout>
    </DAOProvider>
  )
}
