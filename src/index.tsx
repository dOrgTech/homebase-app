import { createRoot } from "react-dom/client"

import App from "App"
import { TezosProvider } from "services/beacon/context"
import { EtherlinkProvider } from "services/wagmi/context"
import localizedFormat from "dayjs/plugin/localizedFormat"
import dayjs from "dayjs"
import { Web3Provider } from "services/wagmi/web3provider"
import { NetworkProvider } from "services/useNetwork"

dayjs.extend(localizedFormat)

// New React 18 way to render
createRoot(document.getElementById("root") as HTMLElement).render(
  <NetworkProvider>
    <Web3Provider>
      <EtherlinkProvider>
        <TezosProvider>
          <App />
        </TezosProvider>
      </EtherlinkProvider>
    </Web3Provider>
  </NetworkProvider>
)
