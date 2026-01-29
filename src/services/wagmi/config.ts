import { createConfig, http } from "wagmi"
import { etherlink, hardhat } from "wagmi/chains"
import { defineChain } from "viem"

import { DeployContract } from "./token"
import { getDefaultConfig } from "connectkit"

// Define custom Etherlink Shadownet chain
export const etherlinkShadownet = defineChain({
  id: 127823,
  name: "Etherlink Shadownet",
  nativeCurrency: {
    decimals: 18,
    name: "XTZ",
    symbol: "XTZ"
  },
  rpcUrls: {
    default: {
      http: ["https://node.shadownet.etherlink.com"]
    }
  },
  blockExplorers: {
    default: {
      name: "Etherlink Shadownet Explorer",
      url: "https://shadownet.explorer.etherlink.com"
    }
  },
  testnet: true
})

// Keep Etherlink chains plus local hardhat for dev parity with the last known-good commit
const wagmiChains = [etherlink, etherlinkShadownet, hardhat] as const

// Allow overriding Etherlink Shadownet RPC via env (optional)
const etherlinkShadownetRpc = process.env.REACT_APP_RPC_ETHERLINK_SHADOWNET?.trim()

// WalletConnect Cloud project ID for ConnectKit default config
const projectId = "7dd66fecc485693b67e6921c580e7040"

export const config = createConfig(
  getDefaultConfig({
    chains: wagmiChains,
    transports: {
      [etherlink.id]: http(),
      [etherlinkShadownet.id]: etherlinkShadownetRpc ? http(etherlinkShadownetRpc) : http()
    },
    walletConnectProjectId: projectId,
    appName: "Homebase",
    appDescription: "DAO Creator & Explorer On Tezos",
    appUrl: "https://tezos-homebase.io",
    appIcon: "https://tezos-homebase.io/favicon.ico"
  })
)

window.DeployContract = DeployContract
