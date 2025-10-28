import { Switch } from "react-router-dom"

import { Route } from "react-router-dom"
import { STEPS } from "./config"
import { EvmDaoCreatorLayout } from "./layout"

export const EtherlinkDAOCreatorRouter = () => {
  return (
    <Switch>
      {STEPS.map(step => (
        <Route key={step.path} path={`/creator-evm/${step.path}`} exact>
          <EvmDaoCreatorLayout>
            <step.component />
          </EvmDaoCreatorLayout>
        </Route>
      ))}
    </Switch>
  )
}
