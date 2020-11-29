import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./App";
import store from "./store";
import { TezosToolkitProvider } from "./store/wallet/context";

ReactDOM.render(
  <React.StrictMode>
    <TezosToolkitProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </TezosToolkitProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
