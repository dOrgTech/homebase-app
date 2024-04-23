import React from "react"
import ReactDOM from "react-dom"
import App from "App"
import { TezosProvider } from "services/beacon/context"
import { EtherlinkProvider } from "services/wagmi/context"
import localizedFormat from "dayjs/plugin/localizedFormat"
import dayjs from "dayjs"
import { Web3Provider } from "services/wagmi/web3provider"
import { NetworkProvider } from "services/useNetwork"

// BigNumber.config({ DECIMAL_PLACES:  })

dayjs.extend(localizedFormat)

// eslint-disable-next-line react/no-deprecated
ReactDOM.render(
  <React.StrictMode>
    <NetworkProvider>
      <Web3Provider>
        <EtherlinkProvider>
          <TezosProvider>
            <App />
          </TezosProvider>
        </EtherlinkProvider>
      </Web3Provider>
    </NetworkProvider>
  </React.StrictMode>,
  document.getElementById("root")
)
