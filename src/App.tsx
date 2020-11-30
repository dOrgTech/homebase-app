import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import { Navbar } from "./components/common/toolbar";
import { DAOCreate } from "./pages/daocreator";
import { Home } from "./pages/Home";

const App: React.FC = () => {
  return (
    <div className="App">
      <Navbar />
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
    </div>
  );
};

export default App;
