import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import "./App.css";
import { DAOCreate } from "./pages/daocreator";
import { Home } from "./pages/Home";
import { Box, ThemeProvider } from "@material-ui/core";
import { theme } from "./theme";
import { DAOExplorerRouter } from "./router/explorer";
import { Navbar } from "./components/common/toolbar";

const App: React.FC = () => {
  localStorage.clear();
  return (
    <ThemeProvider theme={theme}>
      <Box height="100vh" bgcolor="primary.main">
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
