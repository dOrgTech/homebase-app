import { createConfig, http } from "wagmi"
import { etherlink, etherlinkTestnet } from "wagmi/chains"
import { metaMask, injected, safe } from "wagmi/connectors"

import { DeployContract } from "./token"
import { getDefaultConfig } from "connectkit"

const wagmiChains = [etherlink, etherlinkTestnet] as const

// 1. Your WalletConnect Cloud project ID
const projectId = "7dd66fecc485693b67e6921c580e7040"

export const config = createConfig(
  getDefaultConfig({
    chains: wagmiChains,
    // connectors: [metaMask(), walletConnect({ projectId })],
    transports: {
      [etherlink.id]: http(),
      [etherlinkTestnet.id]: http()
    },
    walletConnectProjectId: projectId,
    appName: "Homebase",
    appDescription: "DAO Creator & Explorer On Tezos",
    appUrl: "https://tezos-homebase.io",
    appIcon: "https://tezos-homebase.io/favicon.ico"
  })
)

window.DeployContract = DeployContract
