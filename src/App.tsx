import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { Box, ThemeProvider } from "@material-ui/core";

import { DAOExplorerRouter } from "modules/explorer/router";
import { Navbar } from "modules/common/Toolbar";
import { DAOCreate } from "modules/creator";
import { CreatorProvider } from "modules/creator/state";
import ScrollToTop from "modules/common/ScrollToTop";
import { theme } from "theme";

import "App.css";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Box bgcolor="primary.main" position="absolute" width="100%">
          <Router>
            <ScrollToTop />
            <Switch>
              <Route path="/creator">
                <CreatorProvider>
                  <DAOCreate />
                </CreatorProvider>
              </Route>
              <Route path="/explorer">
                <Navbar />
                <DAOExplorerRouter />
              </Route>
              <Redirect to="/explorer" />
            </Switch>
          </Router>
        </Box>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
