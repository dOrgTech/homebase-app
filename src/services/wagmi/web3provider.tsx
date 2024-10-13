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
    if (!network?.startsWith("etherlink")) return etherlinkTestnet.id
    if (network?.includes("mainnet")) return etherlink.id
    return etherlinkTestnet.id
  }, [currentNetwork])
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider debugMode options={{ initialChainId: ethInitialChainId }}>
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
