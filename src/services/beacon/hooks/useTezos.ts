import { useQueryClient } from "react-query"
import { useCallback, useContext, useEffect } from "react"
import { TezosToolkit } from "@taquito/taquito"
import { connectWithBeacon, createTezos, Network, rpcNodes, TezosActionType } from "services/beacon"
import { TezosContext } from "services/beacon/context"
import mixpanel from "mixpanel-browser"
import { BeaconWallet } from "@taquito/beacon-wallet"
import { EtherlinkContext } from "services/wagmi/context"
import { useNetwork } from "services/useNetwork"
import { useChainId } from "wagmi"

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
  } = useContext(EtherlinkContext)

  const queryClient = useQueryClient()

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
      mixpanel.register({ Network: newNetwork })
      localStorage.setItem("homebase:network", newNetwork)
      switchToNetwork(newNetwork)
      if (newNetwork.startsWith("etherlink")) {
        await handleEtherlinkNetworkChange(newNetwork)
      } else {
        await handleTezosNetworkChange(newNetwork)
      }
      queryClient.resetQueries()
    },
    [handleEtherlinkNetworkChange, handleTezosNetworkChange, switchToNetwork, queryClient]
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
      mixpanel.identify(account)

      return newTezos
    },
    [network, dispatch]
  )

  useEffect(() => {
    console.log("[Tezos] Etherlink Network", etherlinkNetwork, network, isEtherlinkConnected)
    if (etherlinkNetwork !== network && isEtherlinkConnected) {
      console.log(`Switching to network ${network} from ${etherlinkNetwork}`)
      switchToNetwork(network)
    }

    // Log out Beacon if network is etherlink
    if (network?.startsWith("etherlink") && wallet) {
      console.log("Log out Beacon")
      wallet.disconnect()
      dispatch({
        type: TezosActionType.RESET_TEZOS
      })
    }

    // Log out Etherlink if network is not etherlink
    if (!network?.startsWith("etherlink") && isEtherlinkConnected) {
      console.log("Log out Etherlink")
      disconnectEtherWallet()
      dispatch({
        type: TezosActionType.RESET_TEZOS
      })
    }
  }, [
    network,
    etherlinkNetwork,
    handleChangeNetwork,
    isEtherlinkConnected,
    wallet,
    switchToNetwork,
    dispatch,
    disconnectEtherWallet
  ])

  useEffect(() => {
    setNetwork(network)
  }, [network, setNetwork])

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
