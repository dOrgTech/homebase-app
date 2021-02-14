import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import "./App.css";
import { Box, ThemeProvider } from "@material-ui/core";
import { theme } from "./theme";
import { DAOExplorerRouter } from "./router/explorer";
import { Navbar } from "./modules/common/Toolbar";
import { DAOCreate } from "./modules/daocreator";
import { CreatorProvider } from "./modules/daocreator/state/context";
import ScrollToTop from "./modules/common/ScrollToTop";
import { QueryClient, QueryClientProvider } from "react-query";

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
