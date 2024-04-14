/* eslint-disable react/no-deprecated */

import React from "react"
import ReactDOM from "react-dom"
import App from "App"
import { TezosProvider } from "services/beacon/context"
import localizedFormat from "dayjs/plugin/localizedFormat"
import dayjs from "dayjs"

// BigNumber.config({ DECIMAL_PLACES:  })

dayjs.extend(localizedFormat)

ReactDOM.render(
  <React.StrictMode>
    <TezosProvider>
      <App />
    </TezosProvider>
  </React.StrictMode>,
  document.getElementById("root")
)
