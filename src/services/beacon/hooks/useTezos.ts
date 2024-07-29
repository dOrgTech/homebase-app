import { useQueryClient } from "react-query"
import { useCallback, useContext } from "react"
import { TezosToolkit } from "@taquito/taquito"
import { connectWithBeacon, createTezos, Network, rpcNodes, TezosActionType } from "services/beacon"
import { TezosContext } from "services/beacon/context"
import { useWeb3Modal } from "@web3modal/wagmi/react"
import mixpanel from "mixpanel-browser"
import { BeaconWallet } from "@taquito/beacon-wallet"
import { useChainId, useAccount as useWagmiAccount, useConnect as useWagmiConnect } from "wagmi"

import { disconnect as disconnectEtherlink } from "@wagmi/core"
import { config as wagmiConfig } from "services/wagmi/config"
import { etherlink } from "viem/chains"

type WalletConnectReturn = {
  tezos: TezosToolkit
  // TODO: @ashutoshpw Figure out the impact of adding  string here.
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

  const chainId = useChainId()
  const { open, close } = useWeb3Modal()
  const { address: ethAddress, isConnected: isEtherlinkConnected } = useWagmiAccount()
  // const { connect: wagmiConnect, connectors } = useWagmiConnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const openEthWallet = async () => {
    if (isEtherlinkConnected) {
      await disconnectEtherlink(wagmiConfig)
    }
    open({ view: "Connect" })
    // wagmiConnect({ connector: connectors[0], chainId })
  }

  const queryClient = useQueryClient()

  const connect = useCallback(
    async (newNetwork?: Network) => {
      if (isEtherlinkConnected) await disconnectEtherlink(wagmiConfig)

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
    [dispatch, network, isEtherlinkConnected]
  )

  return {
    tezos,
    connect: async () => {
      if (network.startsWith("etherlink")) {
        openEthWallet()
        return "etherlink_login"
      }

      const result = await connect()
      if (!result) {
        throw new Error("Failed to connect")
      }
      return result
    },
    reset: useCallback(async () => {
      if (network.startsWith("etherlink")) {
        await disconnectEtherlink(wagmiConfig)
      }

      if (!wallet && !isEtherlinkConnected) {
        throw new Error("No Wallet Connected")
      }

      if (wallet) await wallet.disconnect()

      dispatch({
        type: TezosActionType.RESET_TEZOS
      })
    }, [dispatch, network, wallet, isEtherlinkConnected]),
    changeNetwork: async (newNetwork: Network) => {
      mixpanel.register({ Network: newNetwork })
      localStorage.setItem("homebase:network", newNetwork)

      if ((newNetwork || network).startsWith("etherlink")) {
        return openEthWallet()
      }
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

      queryClient.resetQueries()
    },
    account,
    wallet,
    network,
    isEtherlink: network?.startsWith("etherlink"),
    etherlink: {
      isConnected: isEtherlinkConnected,
      account: {
        address: ethAddress
      },
      network: ""
    }
  }
}
