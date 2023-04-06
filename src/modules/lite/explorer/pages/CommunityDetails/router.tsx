import React from "react"
import { Switch, Route, Redirect, useRouteMatch } from "react-router"
import { CommunityDetails } from "./index"
import { ProposalCreator } from "../CreateProposal"
import { ProposalDetails } from "../ProposalDetails"

export const CommunityDetailsRouter: React.FC<{ id: any }> = ({ id }): JSX.Element => {
  const match = useRouteMatch()

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
