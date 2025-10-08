import { createConfig, http } from "wagmi"
import { etherlink, etherlinkTestnet, hardhat } from "wagmi/chains"
import { metaMask, injected, safe } from "wagmi/connectors"

import { DeployContract } from "./token"
import { getDefaultConfig } from "connectkit"

// Keep Etherlink chains plus local hardhat for dev parity with the last known-good commit
const wagmiChains = [etherlink, etherlinkTestnet, hardhat] as const

// Allow overriding Etherlink Testnet RPC via env (optional)
const etherlinkTestnetRpc = process.env.REACT_APP_RPC_ETHERLINK_TESTNET?.trim()

// WalletConnect Cloud project ID for ConnectKit default config
const projectId = "7dd66fecc485693b67e6921c580e7040"

export const config = createConfig(
  getDefaultConfig({
    chains: wagmiChains,
    transports: {
      [etherlink.id]: http(),
      [etherlinkTestnet.id]: etherlinkTestnetRpc ? http(etherlinkTestnetRpc) : http()
    },
    walletConnectProjectId: projectId,
    appName: "Homebase",
    appDescription: "DAO Creator & Explorer On Tezos",
    appUrl: "https://tezos-homebase.io",
    appIcon: "https://tezos-homebase.io/favicon.ico"
  })
)

window.DeployContract = DeployContract
