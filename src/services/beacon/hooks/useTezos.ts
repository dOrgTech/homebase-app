import { useQueryClient } from "react-query"
import { useCallback, useContext } from "react"
import { MichelCodecPacker, TezosToolkit } from "@taquito/taquito"
import { connectWithBeacon, Network, rpcNodes, TezosActionType } from "services/beacon"
import { TezosContext } from "services/beacon/context"
import { Tzip16Module } from "@taquito/tzip16"
import mixpanel from "mixpanel-browser"

type WalletConnectReturn = {
  tezos: TezosToolkit
  connect: () => Promise<TezosToolkit>
  changeNetwork: (newNetwork: Network) => void
  reset: () => void
  account: string
  network: Network
}

export const useTezos = (): WalletConnectReturn => {
  const {
    state: { tezos, network, account, wallet },
    dispatch
  } = useContext(TezosContext)

  const queryClient = useQueryClient()

  const connect = useCallback(
    async (newNetwork?: Network) => {
      const { wallet } = await connectWithBeacon(newNetwork || network)

      const newTezos = new TezosToolkit(rpcNodes[newNetwork || network])
      newTezos.setPackerProvider(new MichelCodecPacker())
      newTezos.addExtension(new Tzip16Module())

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
    [dispatch, network]
  )

  return {
    tezos,
    connect,
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

      if (!("_pkh" in tezos.wallet)) {
        const Tezos = new TezosToolkit(rpcNodes[newNetwork])
        Tezos.setPackerProvider(new MichelCodecPacker())
        Tezos.addExtension(new Tzip16Module())

        dispatch({
          type: TezosActionType.UPDATE_TEZOS,
          payload: {
            network: newNetwork,
            tezos: Tezos,
            account,
            wallet: undefined
          }
        })
      } else {
        await connect(newNetwork)
      }
      queryClient.resetQueries()
    },
    account,
    network
  }
}
