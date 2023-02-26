import React from "react"
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom"
import { DAOList } from "modules/explorer/pages/DAOList"
import { DAORouter } from "modules/explorer/pages/DAO/router"
import { DAOCreate } from ".."
import { Grid, styled } from "@material-ui/core"
import { Navbar } from "modules/common/Toolbar"
import { Deployment } from "."
import { ConfigContract } from "./steps/Config"
import { ContractDistribution } from "./steps/Distribution"
import { ContractSummary } from "./steps/Summary"

const PageContainer = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.main
}))

const PageContent = styled(Grid)(({ theme }) => ({
  marginTop: 60,
  width: "1000px",
  height: "100%",
  margin: "auto",
  padding: "28px 0",
  flexDirection: "row",
  paddingTop: 0,
  ["@media (max-width:1167px)"]: {
    width: "86vw"
  },
  [theme.breakpoints.down("sm")]: {
    marginTop: 10
  }
}))

export const TokenDeploymentRouter = (): JSX.Element => {
  const match = useRouteMatch()

  return (
    <PageContainer container direction="row">
      <Navbar mode="creator" />
      <PageContent>
        <Switch>
          <Route path={`${match.url}/deployment`}>
            <Deployment />
          </Route>
          <Route path={`${match.url}/token-config`}>
            <ConfigContract />
          </Route>
          <Route path={`${match.url}/token-distribution`}>
            <ContractDistribution />
          </Route>
          <Route path={`${match.url}/token-summary`}>
            <ContractSummary />
          </Route>
          <Redirect to={`${match.url}/deployment`} />
        </Switch>
      </PageContent>
    </PageContainer>
  )
}
