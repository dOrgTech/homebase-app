import React from "react"
import { Switch, Route, Redirect, useRouteMatch } from "react-router"
import { CommunityList } from "./pages/CommunityList"
import { CommunityDetailsRouter } from "./pages/CommunityDetails/router"

export const DAOExplorerRouter: React.FC = (): JSX.Element => {
  const match = useRouteMatch()

  return (
    <Switch>
      <Route path={`${match.url}/communities`}>
        <CommunityList />
      </Route>
      <Route path={`${match.url}/community`}>
        <CommunityDetailsRouter />
      </Route>
      <Redirect to={`${match.url}/communities`} />
    </Switch>
  )
}
