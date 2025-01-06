import { Redirect, Switch, useRouteMatch } from "react-router-dom"

import { Route } from "react-router-dom"
import { STEPS } from "./config"
import { EvmDaoCreatorLayout } from "./layout"

export const EtherlinkDAOCreatorRouter = () => {
  const match = useRouteMatch()
  console.log("EtherlinkDAOCreatorRouter", match)
  return (
    <Switch>
      {STEPS.map(step => (
        <Route key={step.path} path={`/creator-evm/${step.path}`} exact>
          <EvmDaoCreatorLayout>
            <step.component />
          </EvmDaoCreatorLayout>
        </Route>
      ))}
      {/* <Redirect to={`/creator/etherlink/dao`} /> */}
    </Switch>
  )
}
