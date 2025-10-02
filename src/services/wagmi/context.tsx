import { useState, createContext, ReactNode, useMemo, useEffect, useCallback } from "react"
import { useSwitchChain, useAccount as useWagmiAccount } from "wagmi"
import { disconnect as disconnectEtherlink } from "@wagmi/core"
import { config as wagmiConfig } from "services/wagmi/config"
import { etherlink, etherlinkTestnet } from "wagmi/chains"
import { useModal } from "connectkit"
import { useEthersProvider, useEthersSigner } from "./ethers"
import { useNetwork } from "services/useNetwork"
import { usePostHog } from "posthog-js/react"

import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

import { getEtherTokenBalances } from "modules/etherlink/utils"
import { useDaoState } from "./etherlink/hooks/useDaoState"
import { useMyDaos } from "./etherlink/hooks/useMyDaos"
import { useTreasury } from "./etherlink/hooks/useTreasury"

dayjs.extend(utc)
dayjs.extend(timezone)

export const EtherlinkContext = createContext<any | undefined>(undefined)
export const EtherlinkWalletContext = createContext<any | undefined>(undefined)

export const EtherlinkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isProposalDialogOpen, setIsProposalDialogOpen] = useState(false)
  const { setOpen } = useModal()
  const { switchChain } = useSwitchChain()
  const { network: contextNetwork } = useNetwork()
  const [signerTokenBalances, setSignerTokenBalances] = useState<any[]>([])
  const posthog = usePostHog()

  const { address, isConnected, chain } = useWagmiAccount()

  const etherlinkNetwork = useMemo(() => {
    // Prefer explicit chain id/name from wagmi if present
    if (chain?.id === etherlink.id || chain?.name === "Etherlink") {
      return "etherlink_mainnet"
    }
    if (chain?.id === etherlinkTestnet.id || chain?.name === "Etherlink Testnet") {
      return "etherlink_testnet"
    }
    // Align default with ConnectKit/Web3Provider initialChainId (testnet) when global context is non-etherlink
    if (!contextNetwork?.startsWith("etherlink")) {
      return "etherlink_testnet"
    }
    return contextNetwork
  }, [chain?.id, chain?.name, contextNetwork])

  const selectedChainId = useMemo(() => {
    // Default to Etherlink mainnet if ambiguous
    return etherlinkNetwork === "etherlink_mainnet" ? etherlink.id : etherlinkTestnet.id
  }, [etherlinkNetwork])

  const provider = useEthersProvider({ chainId: selectedChainId })
  const signer = useEthersSigner({ chainId: selectedChainId })

  const switchToNetwork = useCallback(
    (network: string) => {
      const networkId = network === "etherlink_mainnet" ? etherlink.id : etherlinkTestnet.id
      switchChain({ chainId: networkId })

      // PostHog identify with updated network for EVM
      if (posthog && address) {
        posthog.identify(address, {
          wallet_address: address,
          network: network,
          wallet_type: "evm"
        })
      }
    },
    [switchChain, posthog, address]
  )

  const connectWallet = useCallback(() => setOpen(true), [setOpen])
  const disconnect = useCallback(() => disconnectEtherlink(wagmiConfig), [])

  const accountObj = useMemo(() => ({ address: address || "" }), [address])

  // Membership: My DAOs resolved via hook
  const { myDaoAddresses, isLoadingMyDaos } = useMyDaos(etherlinkNetwork, address)

  useEffect(() => {
    if (!signer?.address) return
    getEtherTokenBalances(etherlinkNetwork, signer?.address).then(data => {
      const next = (data || []).map((x: any) => x.token?.address).filter(Boolean)
      // Avoid re-render loops by only setting when changed
      setSignerTokenBalances(prev => {
        const a = Array.isArray(prev) ? prev.slice().sort() : []
        const b = next.slice().sort()
        return JSON.stringify(a) === JSON.stringify(b) ? prev : next
      })
    })
  }, [signer?.address, etherlinkNetwork])

  // PostHog identify for EVM wallet connection
  useEffect(() => {
    if (isConnected && address && posthog) {
      posthog.identify(address, {
        wallet_address: address,
        network: etherlinkNetwork,
        wallet_type: "evm"
      })
    }
  }, [isConnected, address, etherlinkNetwork, posthog])

  const {
    contractData,
    daos,
    isLoadingDaos,
    daoSelected,
    daoProposals,
    isLoadingDaoProposals,
    daoProposalSelected,
    daoMembers,
    daoProposalVoters,
    selectDaoProposal,
    selectDao
  } = useDaoState({
    network: etherlinkNetwork || ""
  })

  // Treasury values from a dedicated hook (reduces context responsibilities)
  const {
    daoRegistryDetails: daoRegistryDetailsHook,
    daoTreasuryTokens: daoTreasuryTokensHook,
    daoNfts: daoNftsHook
  } = useTreasury(etherlinkNetwork, daoSelected?.registryAddress)

  const contextValue = useMemo(
    () => ({
      isConnected,
      provider,
      signer,
      signerTokenBalances,
      myDaoAddresses,
      isLoadingMyDaos,
      account: accountObj,
      network: etherlinkNetwork,
      connect: connectWallet,
      contractData,
      isProposalDialogOpen,
      setIsProposalDialogOpen,
      daos,
      isLoadingDaos,
      isLoadingDaoProposals,
      daoSelected,
      daoNfts: daoNftsHook,
      daoRegistryDetails: daoRegistryDetailsHook,
      daoTreasuryTokens: daoTreasuryTokensHook,
      daoProposals,
      daoProposalSelected,
      daoMembers,
      daoProposalVoters,
      selectDaoProposal,
      selectDao,
      disconnect,
      switchToNetwork
    }),
    [
      isConnected,
      provider,
      signer,
      signerTokenBalances,
      myDaoAddresses,
      isLoadingMyDaos,
      accountObj,
      etherlinkNetwork,
      contractData,
      isProposalDialogOpen,
      daos,
      isLoadingDaos,
      isLoadingDaoProposals,
      daoSelected,
      daoNftsHook,
      daoRegistryDetailsHook,
      daoTreasuryTokensHook,
      daoProposals,
      daoProposalSelected,
      daoMembers,
      daoProposalVoters,
      selectDaoProposal,
      selectDao,
      disconnect,
      switchToNetwork,
      connectWallet
    ]
  )

  const walletValue = useMemo(
    () => ({
      isConnected,
      provider,
      signer,
      signerTokenBalances,
      myDaoAddresses,
      isLoadingMyDaos,
      account: accountObj,
      network: etherlinkNetwork,
      connect: connectWallet,
      disconnect,
      switchToNetwork
    }),
    [
      isConnected,
      provider,
      signer,
      signerTokenBalances,
      myDaoAddresses,
      isLoadingMyDaos,
      accountObj,
      etherlinkNetwork,
      connectWallet,
      disconnect,
      switchToNetwork
    ]
  )

  return (
    <EtherlinkWalletContext.Provider value={walletValue}>
      <EtherlinkContext.Provider value={contextValue}>{children}</EtherlinkContext.Provider>
    </EtherlinkWalletContext.Provider>
  )
}
