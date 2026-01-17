import React, { ReactNode, useMemo } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import { config, etherlinkShadownet } from "./config"
import { ConnectKitProvider } from "connectkit"
import { etherlink } from "wagmi/chains"
import { useNetwork } from "services/useNetwork"

const queryClient = new QueryClient()

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const { network: currentNetwork } = useNetwork()
  const ethInitialChainId = useMemo(() => {
    const network = currentNetwork || "etherlink_mainnet"
    if (!network?.startsWith("etherlink")) return etherlinkShadownet.id
    if (network?.includes("mainnet")) return etherlink.id
    return etherlinkShadownet.id
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
