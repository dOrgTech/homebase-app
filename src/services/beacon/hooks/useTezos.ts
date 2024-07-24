import { useQueryClient } from "react-query"
import { useCallback, useContext } from "react"
import { TezosToolkit } from "@taquito/taquito"
import { connectWithBeacon, createTezos, Network, rpcNodes, TezosActionType } from "services/beacon"
import { TezosContext } from "services/beacon/context"
import { useWeb3Modal } from "@web3modal/wagmi/react"
import mixpanel from "mixpanel-browser"
import { BeaconWallet } from "@taquito/beacon-wallet"
import { useChainId, useAccount as useWagmiAccount, useConnect as useWagmiConnect } from "wagmi"
import { disconnect } from "@wagmi/core"

declare global {
  interface Window {
    disconnectEtherlink: typeof disconnect
    web3Modal: any
  }
}

window.disconnectEtherlink = disconnect

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
  const { open, close } = useWeb3Modal()
  const { address: ethAddress, isConnected } = useWagmiAccount()
  const { connect: wagmiConnect, connectors } = useWagmiConnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const openEthWallet = () => {
    open({ view: "Connect" })
    // wagmiConnect({ connector: connectors[0], chainId })
  }

  const queryClient = useQueryClient()

  const connect = useCallback(
    async (newNetwork?: Network) => {
      console.log({ newNetwork })
      if ((newNetwork || network).startsWith("etherlink")) {
        openEthWallet()
        return "etherlink_login"
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

      if ((newNetwork || network).startsWith("etherlink")) {
        openEthWallet()
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
    network,
    wallet,
    isEtherlink: network?.startsWith("etherlink"),
    etherlink: {
      isConnected,
      account: {
        address: ethAddress
      },
      network: ""
    }
  }
}
