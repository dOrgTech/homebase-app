import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./App";
import store from "./store";
import { TezosProvider } from "./services/beacon/context";

ReactDOM.render(
  <React.StrictMode>
    <TezosProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </TezosProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
