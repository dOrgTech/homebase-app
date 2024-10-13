import React from "react"
import { Switch, Route, Redirect, useRouteMatch } from "react-router"
import { CommunityDetailsRouter } from "./pages/CommunityDetails/router"
import { useParams } from "react-router-dom"
import { Grid, styled } from "@material-ui/core"
import { Navbar as ExplorerNavbar } from "modules/explorer/components/Toolbar"
import { Navbar } from "modules/common/Toolbar"

import { AppContextProvider } from "./context/ActionSheets/explorer"

const PageContainer = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.dark
}))

export const LiteExplorerRouter: React.FC = (): JSX.Element => {
  const match = useRouteMatch()

  const { id } = useParams<{
    id: string
  }>()

  return (
    <PageContainer container direction="row">
      <ExplorerNavbar disableMobileMenu />
      <AppContextProvider>
        <Switch>
          <Route path={`${match.url}/community`}>
            <CommunityDetailsRouter id={id} />
          </Route>
          <Redirect to={`${match.url}/community`} />
        </Switch>
      </AppContextProvider>
    </PageContainer>
  )
}
