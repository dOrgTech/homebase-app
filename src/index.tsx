import { createRoot } from "react-dom/client"

import { PostHogProvider } from "posthog-js/react"
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
  <PostHogProvider
    apiKey={process.env.REACT_APP_POSTHOG_KEY || ""}
    options={{
      api_host: process.env.REACT_APP_POSTHOG_HOST || "https://app.posthog.com",
      defaults: "2025-05-24",
      capture_exceptions: true, // This enables capturing exceptions using Error Tracking
      debug: process.env.NODE_ENV === "development"
    }}
  >
    <NetworkProvider>
      <Web3Provider>
        <EtherlinkProvider>
          <TezosProvider>
            <App />
          </TezosProvider>
        </EtherlinkProvider>
      </Web3Provider>
    </NetworkProvider>
  </PostHogProvider>
)
