import { useQueryClient } from "react-query"
import { useCallback, useContext } from "react"
import { MichelCodecPacker, TezosToolkit } from "@taquito/taquito"
import { ALICE_PRIV_KEY, connectWithBeacon, Network, rpcNodes, TezosActionType, createTezos } from "services/beacon"
import { TezosContext } from "services/beacon/context"
import { Tzip16Module } from "@taquito/tzip16"
import mixpanel from "mixpanel-browser"
import { BeaconWallet } from "@taquito/beacon-wallet"
import { EnvKey, getEnv } from "services/config"
import { InMemorySigner } from "@taquito/signer"

type WalletConnectReturn = {
  tezos: TezosToolkit
  connect: () => Promise<TezosToolkit>
  changeNetwork: (newNetwork: Network) => void
  reset: () => void
  account: string
  network: Network
  wallet: BeaconWallet | undefined
}

export const initTezosInstance = (network: Network) => {
  const newTezos = new TezosToolkit(rpcNodes[network])
  newTezos.setPackerProvider(new MichelCodecPacker())
  newTezos.addExtension(new Tzip16Module())

  return newTezos
}

export const useTezos = (): WalletConnectReturn => {
  const {
    state: { tezos, network, account, wallet },
    dispatch
  } = useContext(TezosContext)

  const queryClient = useQueryClient()

  const connect = useCallback(
    async (newNetwork?: Network) => {
      const newTezos: TezosToolkit = initTezosInstance(network || newNetwork)

      let wallet

      if (getEnv(EnvKey.REACT_APP_IS_NOT_TESTING) === "true") {
        const { wallet: beaconWallet } = await connectWithBeacon(network)
        wallet = beaconWallet
        newTezos.setProvider({ wallet })
      } else {
        const signer = await InMemorySigner.fromSecretKey(ALICE_PRIV_KEY)
        newTezos.setProvider({ signer })
      }

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
    wallet
  }
}
