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

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box height="100%" bgcolor="primary.main">
        <Navbar />
        <Router>
          <Switch>
            <Route path="/creator">
              <DAOCreate />
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
