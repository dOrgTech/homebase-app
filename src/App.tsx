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
import { Navbar } from "./components/common/toolbar";
import { DAOCreate } from "./modules/daocreator/components";
import { CreatorProvider } from "./modules/daocreator/state/context";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box
        height="calc(100% - 105px)"
        bgcolor="primary.main"
        position="absolute"
        width="100%"
      >
        <Router>
          <Navbar />
          <Switch>
            <Route path="/creator">
              <CreatorProvider>
                <DAOCreate />
              </CreatorProvider>
            </Route>
            <Route path="/explorer">
              <DAOExplorerRouter />
            </Route>
            <Redirect to="/explorer" />
          </Switch>
        </Router>
      </Box>
    </ThemeProvider>
  );
};

export default App;
