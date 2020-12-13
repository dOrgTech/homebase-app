import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
} from "react-router-dom";
import "./App.css";
import { Navbar } from "./components/common/toolbar";
import { DAOCreate } from "./pages/daocreator";
import { Home } from "./pages/Home";
import { ThemeProvider } from "@material-ui/core";
import { theme } from "./theme";

const App: React.FC = () => {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        {/* <Navbar /> */}
        <Router>
          <Switch>
            <Route path="/create/dao">
              <DAOCreate />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </Router>
      </ThemeProvider>
    </div>
  );
};

export default App;
