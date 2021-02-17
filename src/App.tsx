import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { Box, ThemeProvider } from "@material-ui/core";

import { DAOExplorerRouter } from "src/router/explorer";
import { Navbar } from "src/modules/common/Toolbar";
import { DAOCreate } from "src/modules/daocreator";
import { CreatorProvider } from "src/modules/daocreator/state/context";
import ScrollToTop from "src/modules/common/ScrollToTop";
import { theme } from "src/theme";

import "src/App.css";

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
