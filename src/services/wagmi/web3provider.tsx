import React, { ReactNode, useMemo } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import { config } from "./config"
import { ConnectKitProvider } from "connectkit"
import { etherlink, etherlinkTestnet } from "wagmi/chains"
import { useNetwork } from "services/useNetwork"

const queryClient = new QueryClient()

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const { network: currentNetwork } = useNetwork()
  const ethInitialChainId = useMemo(() => {
    const network = currentNetwork || "etherlink_mainnet"
    // If the app's global network isn't an etherlink value yet (first visit),
    // prefer mainnet so shared links to mainnet DAOs render correctly.
    if (!network?.startsWith("etherlink")) return etherlink.id
    if (network?.includes("mainnet")) return etherlink.id
    return etherlinkTestnet.id
  }, [currentNetwork])
  const connectkitOptions = useMemo(() => ({ initialChainId: ethInitialChainId }), [ethInitialChainId])

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider debugMode options={connectkitOptions}>
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
