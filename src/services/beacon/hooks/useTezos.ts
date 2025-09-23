import { useQueryClient } from "react-query"
import { useCallback, useContext, useEffect } from "react"
import { TezosToolkit } from "@taquito/taquito"
import { connectWithBeacon, createTezos, Network, rpcNodes, TezosActionType } from "services/beacon"
import { TezosContext } from "services/beacon/context"
import { BeaconWallet } from "@taquito/beacon-wallet"
import { EtherlinkWalletContext } from "services/wagmi/context"
import { useNetwork } from "services/useNetwork"
import { useChainId } from "wagmi"
import { usePostHog } from "posthog-js/react"

type WalletConnectReturn = {
  tezos: TezosToolkit
  connect: () => Promise<TezosToolkit | string>
  changeNetwork: (newNetwork: Network) => void
  reset: () => void
  account: string
  network: Network
  wallet: BeaconWallet | undefined
  etherlink: any
  isEtherlink: boolean
}

export const useTezos = (): WalletConnectReturn => {
  const {
    state: { tezos, network, account, wallet },
    dispatch
  } = useContext(TezosContext)
  const { setNetwork } = useNetwork()

  const {
    switchToNetwork,
    account: ethAccount,
    isConnected: isEtherlinkConnected,
    connect: connectWithWagmi,
    disconnect: disconnectEtherWallet,
    network: etherlinkNetwork,
    provider: ethProvider,
    signer: ethSigner
  } = useContext(EtherlinkWalletContext)

  const queryClient = useQueryClient()
  const posthog = usePostHog()

  const handleEtherlinkNetworkChange = useCallback(
    async (newNetwork: Network) => {
      // Reset the Tezos state
      dispatch({
        type: TezosActionType.UPDATE_TEZOS,
        payload: {
          network: newNetwork,
          tezos: tezos,
          account: "",
          wallet: undefined
        }
      })
    },
    [dispatch, tezos]
  )

  const handleTezosNetworkChange = useCallback(
    async (newNetwork: Network) => {
      const newTezos: TezosToolkit = createTezos(newNetwork)
      if (!account) {
        dispatch({
          type: TezosActionType.UPDATE_TEZOS,
          payload: {
            network: newNetwork,
            tezos: newTezos,
            account: "",
            wallet: undefined
          }
        })
      } else {
        const { wallet } = await connectWithBeacon(newNetwork)
        newTezos.setProvider({ wallet })
        const newAccount = await newTezos.wallet.pkh()

        dispatch({
          type: TezosActionType.UPDATE_TEZOS,
          payload: {
            network: newNetwork,
            tezos: newTezos,
            account: newAccount,
            wallet
          }
        })
      }
    },
    [dispatch, account]
  )

  /**
   * Change the network
   * - If the account is not connected, we don't need to do manage wallet actions
   * - If the account is connected we need to manage the wallet switch
   * @param newNetwork - The new network to change to
   * @returns void
   */
  const handleChangeNetwork = useCallback(
    async (newNetwork: Network) => {
      // Network registration is now handled by PostHog identify
      localStorage.setItem("homebase:network", newNetwork)

      // PostHog identify with updated network
      if (posthog) {
        const currentWalletAddress = newNetwork.startsWith("etherlink") ? ethAccount?.address : account
        if (currentWalletAddress) {
          posthog.identify(currentWalletAddress, {
            wallet_address: currentWalletAddress,
            network: newNetwork,
            wallet_type: newNetwork.startsWith("etherlink") ? "evm" : "tezos"
          })
        }
      }

      if (newNetwork.startsWith("etherlink")) {
        await handleEtherlinkNetworkChange(newNetwork)
        // Only switch chain if we're changing to Etherlink network
        switchToNetwork(newNetwork)
      } else {
        await handleTezosNetworkChange(newNetwork)
      }
      queryClient.resetQueries()
    },
    [
      handleEtherlinkNetworkChange,
      handleTezosNetworkChange,
      switchToNetwork,
      queryClient,
      posthog,
      ethAccount?.address,
      account
    ]
  )

  const handleTezosConnect = useCallback(
    async (newNetwork?: Network) => {
      const { wallet } = await connectWithBeacon(network)
      const newTezos: TezosToolkit = createTezos(network || newNetwork)
      newTezos.setProvider({ wallet })

      const account = await newTezos.wallet.pkh()

      dispatch({
        type: TezosActionType.UPDATE_TEZOS,
        payload: {
          network: newNetwork || network,
          tezos: newTezos,
          account,
          wallet
        }
      })
      // User identification is now handled by PostHog identify

      // PostHog identify with wallet and network info
      if (posthog) {
        posthog.identify(account, {
          wallet_address: account,
          network: newNetwork || network,
          wallet_type: "tezos"
        })
      }

      return newTezos
    },
    [network, dispatch, posthog]
  )

  useEffect(() => {
    if (etherlinkNetwork !== network && isEtherlinkConnected && network?.startsWith("etherlink")) {
      // Don't switch network here, let handleChangeNetwork handle it
      return
    }

    // Log out Beacon if network is etherlink
    if (network?.startsWith("etherlink") && wallet) {
      wallet.disconnect()
      dispatch({
        type: TezosActionType.RESET_TEZOS
      })
    }

    // Log out Etherlink if network is not etherlink
    if (!network?.startsWith("etherlink") && isEtherlinkConnected) {
      disconnectEtherWallet()
      dispatch({
        type: TezosActionType.RESET_TEZOS
      })
    }
  }, [network, etherlinkNetwork, isEtherlinkConnected, wallet, dispatch, disconnectEtherWallet])

  return {
    tezos,
    connect: async () => {
      if (network.startsWith("etherlink")) {
        connectWithWagmi()
        return "etherlink_login"
      }

      const result = await handleTezosConnect()

      if (!result) {
        throw new Error("Failed to connect")
      }
      return result
    },
    reset: useCallback(async () => {
      if (network.startsWith("etherlink")) {
        await disconnectEtherWallet()
      }

      if (!wallet && !isEtherlinkConnected) {
        throw new Error("No Wallet Connected")
      }

      if (wallet) await wallet.disconnect()

      dispatch({
        type: TezosActionType.RESET_TEZOS
      })
    }, [network, wallet, isEtherlinkConnected, dispatch, disconnectEtherWallet]),

    changeNetwork: handleChangeNetwork,
    account,
    wallet,
    network,
    isEtherlink: network?.startsWith("etherlink"),
    etherlink: {
      isConnected: isEtherlinkConnected,
      account: ethAccount,
      provider: ethProvider,
      signer: ethSigner
    }
  }
}
