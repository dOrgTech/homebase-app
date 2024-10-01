import { createConfig, http } from "wagmi"
import { etherlink, etherlinkTestnet } from "wagmi/chains"
import { metaMask, injected, safe } from "wagmi/connectors"
import { createWeb3Modal } from "@web3modal/wagmi/react"
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config"
import { walletConnect } from "wagmi/connectors"
import { DeployContract } from "./token"

const wagmiChains = [etherlink, etherlinkTestnet] as const

// 1. Your WalletConnect Cloud project ID
const projectId = "7dd66fecc485693b67e6921c580e7040"

// 2. Create wagmiConfig
const metadata = {
  name: "Homebase",
  description: "DAO Creator & Explorer On Tezos",
  url: "https://tezos-homebase.io", // origin must match your domain & subdomain
  icons: ["https://tezos-homebase.io/favicon.ico"]
}

const web3ModalConfig = defaultWagmiConfig({
  chains: wagmiChains,
  projectId,
  metadata
})

window.web3Modal = createWeb3Modal({
  wagmiConfig: web3ModalConfig,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: false // Optional - false as default
})

// 3. Create modal

export const config = createConfig({
  chains: wagmiChains,
  connectors: [metaMask(), walletConnect({ projectId })],
  transports: {
    [etherlink.id]: http(),
    [etherlinkTestnet.id]: http()
  }
})

window.DeployContract = DeployContract
