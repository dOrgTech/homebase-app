import React from "react"
import ReactDOM from "react-dom"
import App from "App"
import { TezosProvider } from "services/beacon/context"
import { EtherlinkProvider } from "services/wagmi/context"
import localizedFormat from "dayjs/plugin/localizedFormat"
import dayjs from "dayjs"
import { Web3Provider } from "services/wagmi/web3provider"

// BigNumber.config({ DECIMAL_PLACES:  })

dayjs.extend(localizedFormat)

ReactDOM.render(
  <React.StrictMode>
    <Web3Provider>
      <EtherlinkProvider>
        <TezosProvider>
          <App />
        </TezosProvider>
      </EtherlinkProvider>
    </Web3Provider>
  </React.StrictMode>,
  document.getElementById("root")
)
