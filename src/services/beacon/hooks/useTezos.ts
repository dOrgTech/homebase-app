import { useQueryClient } from "react-query"
import { useCallback, useContext } from "react"
import { TezosToolkit } from "@taquito/taquito"
import { connectWithBeacon, createTezos, Network, rpcNodes, TezosActionType } from "services/beacon"
import { TezosContext } from "services/beacon/context"
import { useWeb3Modal } from "@web3modal/wagmi/react"
import mixpanel from "mixpanel-browser"
import { BeaconWallet } from "@taquito/beacon-wallet"
import { useChainId, useAccount as useWagmiAccount, useConnect as useWagmiConnect } from "wagmi"

type WalletConnectReturn = {
  tezos: TezosToolkit
  connect: () => Promise<TezosToolkit>
  changeNetwork: (newNetwork: Network) => void
  reset: () => void
  account: string
  network: Network
  wallet: BeaconWallet | undefined
  etherlink: any
}

function formatEthAddress(address?: string) {
  if (!address) return null
  return `${address.slice(0, 6)}…${address.slice(38, 42)}`
}

export const useTezos = (): WalletConnectReturn => {
  const {
    state: { tezos, network, account, wallet },
    dispatch
  } = useContext(TezosContext)

  const chainId = useChainId()
  const { address: ethAddress, isConnected } = useWagmiAccount()
  const { connect: wagmiConnect, connectors } = useWagmiConnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const openEthWallet = () => {
    wagmiConnect({ connector: connectors[0], chainId })
  }

  const queryClient = useQueryClient()

  const connect = useCallback(
    async (newNetwork?: Network) => {
      if ((newNetwork || network).startsWith("etherlink")) {
        openEthWallet()
        return
      }
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
    [dispatch, network, openEthWallet]
  )

  return {
    tezos,
    connect: async () => {
      const result = await connect()
      if (!result) {
        throw new Error("Failed to connect")
      }
      return result
    },
    reset: useCallback(async () => {
      if (!wallet) {
        throw new Error("No Wallet Connected")
      }

      await wallet.disconnect()

      dispatch({
        type: TezosActionType.RESET_TEZOS
      })
    }, [dispatch, wallet]),
    changeNetwork: async (newNetwork: Network) => {
      mixpanel.register({ Network: newNetwork })
      localStorage.setItem("homebase:network", newNetwork)
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
    network,
    wallet,
    etherlink: {
      isConnected,
      account: {
        address: ethAddress
      },
      network: ""
    }
  }
}
