import React, { useEffect } from "react"
import { Switch, Route, Redirect, useRouteMatch } from "react-router"
import { CommunityDetails } from "./index"
import { ProposalCreator } from "../CreateProposal"
import { ProposalDetails } from "../ProposalDetails"
import { useCommunity } from "../../hooks/useCommunity"
import { useTezos } from "services/beacon/hooks/useTezos"
import { Network } from "services/beacon"

export const CommunityDetailsRouter: React.FC<{ id: any }> = ({ id }): JSX.Element => {
  const match = useRouteMatch()
  const community = useCommunity(id)
  const { network, changeNetwork } = useTezos()

  useEffect(() => {
    if (community && community.network.toLowerCase() !== network.toLowerCase()) {
      changeNetwork(community.network.toLowerCase() as Network)
    }
  }, [community, changeNetwork, network])

  return (
    <Switch>
      <Route exact={true} path={`${match.url}`}>
        <CommunityDetails id={id} />
      </Route>
      <Route exact={true} path={`${match.url}/proposal`}>
        <ProposalCreator id={id} />
      </Route>
      <Route exact={true} path={`${match.url}/proposal/:proposalId`}>
        <ProposalDetails id={id} />
      </Route>
      <Redirect to={`${match.url}`} />
    </Switch>
  )
}
