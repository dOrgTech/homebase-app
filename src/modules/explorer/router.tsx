import React from "react"
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom"
import { DAOList } from "modules/explorer/pages/DAOList"
import { DAORouter } from "modules/explorer/pages/DAO/router"
import { LiteExplorerRouter } from "modules/lite/explorer/router"

export const DAOExplorerRouter = (): JSX.Element => {
  const match = useRouteMatch()

  return (
    <Switch>
      <Route path={`${match.url}/daos`}>
        <DAOList />
      </Route>
      <Route path={`${match.url}/dao/:id`}>
        <DAORouter />
      </Route>
      <Route path={`${match.url}/lite/dao/:id`}>
        <LiteExplorerRouter />
      </Route>
      <Redirect to={`${match.url}/daos`} />
    </Switch>
  )
}
