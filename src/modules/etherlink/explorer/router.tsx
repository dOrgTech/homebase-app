import React, { useContext, useEffect, useState } from "react"
import { Redirect, Route, RouteProps, Switch, useParams, useRouteMatch } from "react-router-dom"
import { useHistory } from "react-router"

import { EvmNotFound } from "modules/etherlink/components/EvmNotFound"
import { EvmNotIndexed } from "modules/etherlink/components/EvmNotIndexed"
import { EtherlinkDAOOverview } from "./index"

import { Network } from "services/beacon"
import { useTezos } from "services/beacon/hooks/useTezos"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { PageLayout } from "components/ui/DaoExplorer"
import { Navbar } from "modules/explorer/components/Toolbar"
import { EvmProposalsPage } from "./EtherlinkDAO/EvmProposalsPage"
import { EvmMembersPage } from "./EtherlinkDAO/EvmMembersPage"
import { EvmRegistryPage } from "./EtherlinkDAO/EvmRegistryPage"
import { EvmProposalDetailsPage } from "./EtherlinkDAO/EvmProposalDetailsPage"
import { EvmUserPage } from "./EtherlinkDAO/EvmUserPage"
import { EtherlinkContext } from "services/wagmi/context"
import { EvmOffchainProposalDetailsPage } from "./EtherlinkDAO/EvmOffchainProposalDetailPage"
import { dbg } from "utils/debug"

enum DAOState {
  NOT_FOUND = 0,
  NOT_INDEXED = 1,
  FOUND = 2
}

const EtherlinkDAORouteContent: React.FC = ({ children }) => {
  const daoId = useEtherlinkDAOID()
  const { tezos, network, changeNetwork } = useTezos()
  const { data, isLoading, error } = useDAO(daoId)
  const [state, setState] = useState<DAOState>(DAOState.FOUND)
  const history = useHistory()

  // Ensure a sensible default when landing directly on Etherlink routes
  useEffect(() => {
    const key = "homebase:network"
    const stored = localStorage.getItem(key)
    if (!stored) {
      localStorage.setItem(key, "etherlink_mainnet")
      changeNetwork("etherlink_mainnet" as Network)
    }
  }, [changeNetwork])

  useEffect(() => {
    ;(async () => {
      if (!data && !!error && !isLoading) {
        try {
          await tezos.contract.at(daoId)
          dbg("[ROUTER:existenceCheck]", {
            daoId,
            note: "Tezos contract.at used on Etherlink route → NOT_INDEXED if resolves"
          })
          setState(DAOState.NOT_INDEXED)
        } catch (e) {
          dbg("[ROUTER:existenceCheck]", { daoId, note: "Tezos contract.at failed → NOT_FOUND", error: String(e) })
          setState(DAOState.NOT_FOUND)
        }
      }
    })()
  }, [data, error, daoId, tezos.contract, isLoading])

  useEffect(() => {
    if (history && data && data.data.network.toLowerCase() !== network.toLowerCase()) {
      changeNetwork(data.data.network.toLowerCase() as Network)
    }
  }, [data, history, network, changeNetwork])

  return (
    <>
      {state === DAOState.NOT_FOUND ? (
        <EvmNotFound />
      ) : state === DAOState.NOT_INDEXED ? (
        <EvmNotIndexed address={daoId} />
      ) : (
        children
      )}
    </>
  )
}

const EtherlinkDAORoute: React.FC<RouteProps> = ({ children, ...props }) => {
  return (
    <Route {...props}>
      <EtherlinkDAORouteContent>{children}</EtherlinkDAORouteContent>
    </Route>
  )
}

const EtherlinkDAOContext = React.createContext("")

const EtherlinkDAOProvider: React.FC<{ daoId: string }> = ({ daoId, children }) => {
  // Auto-select the DAO in Etherlink context when route changes
  const { selectDao, daos, isLoadingDaos, network, switchToNetwork, daoSelected } = useContext(EtherlinkContext) as any
  const attemptedSwitchRef = React.useRef(false)

  // Reset the auto-switch guard when the DAO id changes
  useEffect(() => {
    attemptedSwitchRef.current = false
  }, [daoId])

  useEffect(() => {
    if (!daoId || !Array.isArray(daos)) return

    const targetId = daoId.toLowerCase()
    const foundHere = daos.some((d: any) => (d?.id || "").toLowerCase() === targetId)

    if (foundHere) {
      if ((daoSelected?.id || "").toLowerCase() !== targetId) {
        selectDao(daoId)
      }
      return
    }

    // If not found and we have a list, try alternate network once.
    if (daos.length > 0 && !isLoadingDaos && !attemptedSwitchRef.current) {
      attemptedSwitchRef.current = true
      const alt = network === "etherlink_shadownet" ? "etherlink_mainnet" : "etherlink_shadownet"
      switchToNetwork?.(alt)
    }
  }, [daoId, daos, isLoadingDaos, network, selectDao, switchToNetwork, daoSelected?.id])

  return <EtherlinkDAOContext.Provider value={daoId}>{children}</EtherlinkDAOContext.Provider>
}

export const useEtherlinkDAOID = () => {
  return useContext(EtherlinkDAOContext)
}

export const EtherlinkDAORouter = (): JSX.Element => {
  const match = useRouteMatch()
  const { id: daoId } = useParams<{ id: string }>()

  return (
    <EtherlinkDAOProvider daoId={daoId}>
      <Navbar />
      <PageLayout>
        <Switch>
          <EtherlinkDAORoute path={`${match.url}/proposals`}>
            <EvmProposalsPage />
          </EtherlinkDAORoute>
          <EtherlinkDAORoute path={`${match.url}/proposal/:proposalId`}>
            <EvmProposalDetailsPage />
          </EtherlinkDAORoute>
          <EtherlinkDAORoute path={`${match.url}/offchain-proposal/:proposalId`}>
            <EvmOffchainProposalDetailsPage />
          </EtherlinkDAORoute>
          <EtherlinkDAORoute path={`${match.url}/overview`}>
            <EtherlinkDAOOverview />
          </EtherlinkDAORoute>
          <EtherlinkDAORoute path={`${match.url}/members`}>
            <EvmMembersPage />
          </EtherlinkDAORoute>
          <EtherlinkDAORoute path={`${match.url}/registry`}>
            <EvmRegistryPage />
          </EtherlinkDAORoute>
          <EtherlinkDAORoute path={`${match.url}/user`}>
            <EvmUserPage />
          </EtherlinkDAORoute>
          <Redirect from={`${match.url}`} to={`${match.url}/overview`} />
        </Switch>
      </PageLayout>
    </EtherlinkDAOProvider>
  )
}
