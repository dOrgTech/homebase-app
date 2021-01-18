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
import { ThemeProvider } from "@material-ui/core";
import { theme } from "./theme";
import { DAOExplorerRouter } from "./router/explorer";
import { Navbar } from "./components/common/toolbar";

const App: React.FC = () => {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Navbar />
        <Router>
          <Switch>
            <Route path="/creator">
              <DAOCreate />
            </Route>
            <Route path="/explorer">
              <DAOExplorerRouter />
            </Route>
            <Route path="/">
              <Home />
            </Route>
            <Redirect to="/" />
          </Switch>
        </Router>
      </ThemeProvider>
    </div>
  );
};

export default App;
