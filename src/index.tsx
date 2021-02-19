import React from "react";
import ReactDOM from "react-dom";

import App from "App";
import { TezosProvider } from "services/beacon/context";

ReactDOM.render(
  <React.StrictMode>
    <TezosProvider>
      <App />
    </TezosProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
