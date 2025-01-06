import React from "react"
import { Redirect, Route, Switch, useHistory, useRouteMatch } from "react-router-dom"
import { TezosTokenDeployment } from "./tezos"
import { ConfigContract as TezosConfigContract } from "./tezos/steps/Config"
import { ContractDistribution as TezosContractDistribution } from "./tezos/steps/Distribution"
import { ContractSummary as TezosContractSummary } from "./tezos/steps/Summary"
import { Ownership as TezosOwnership } from "./tezos/steps/Ownership"
import { Success as TezosSuccess } from "./tezos/steps/Success"
import { Success as EtherlinkSuccess } from "./etherlink/steps/Success"
import { EtherlinkTokenDeployment } from "./etherlink"
import { useTezos } from "services/beacon/hooks/useTezos"
import { Ownership as EtherlinkOwnership } from "./etherlink/steps/Ownership"
import { DeploymentProvider as EtherlinkDeploymentProvider } from "./etherlink/state/context"
import { DeploymentProvider as TezosDeploymentProvider } from "./tezos/state/context"

export const TokenDeploymentRouter = (): JSX.Element => {
  const { network } = useTezos()
  const history = useHistory()
  const match = useRouteMatch()

  console.log("Network from token router", network)
  if (network.startsWith("etherlink")) {
    if (history.location.pathname === "/creator") {
      return <Redirect to={`/creator-evm/template`} />
    }
    return (
      <EtherlinkDeploymentProvider>
        <Switch>
          <Route path={`${match.url}/deployment`}>
            <EtherlinkTokenDeployment />
          </Route>
          <Route path={`${match.url}/ownership`}>
            <EtherlinkOwnership />
          </Route>
          <Route path={`${match.url}/success`}>
            <EtherlinkSuccess />
          </Route>
          <Redirect to={`${match.url}/ownership`} />
        </Switch>
      </EtherlinkDeploymentProvider>
    )
  }

  return (
    <TezosDeploymentProvider>
      <Switch>
        <Route path={`${match.url}/deployment`}>
          <TezosTokenDeployment />
        </Route>
        <Route path={`${match.url}/ownership`}>
          <TezosOwnership />
        </Route>
        <Route path={`${match.url}/config`}>
          <TezosConfigContract />
        </Route>
        <Route path={`${match.url}/distribution`}>
          <TezosContractDistribution />
        </Route>
        <Route path={`${match.url}/summary`}>
          <TezosContractSummary />
        </Route>
        <Route path={`${match.url}/success`}>
          <TezosSuccess />
        </Route>
        <Redirect to={`${match.url}/ownership`} />
      </Switch>
    </TezosDeploymentProvider>
  )
}
