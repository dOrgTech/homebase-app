import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import "./App.css";
import { DAOCreate } from "./pages/daocreator";
import { Box, ThemeProvider } from "@material-ui/core";
import { theme } from "./theme";
import { DAOExplorerRouter } from "./router/explorer";
import { Navbar } from "./components/common/toolbar";
import ScrollToTop from "./components/common/scrollToTop";

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
          <ScrollToTop />
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
