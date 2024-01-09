import React, { createContext, useEffect, useReducer } from "react"
import mixpanel from "mixpanel-browser"
import { ALICE_PRIV_KEY, createTezos, createWallet, getTezosNetwork } from "./utils"
import { INITIAL_STATE, reducer, TezosState } from "./reducer"
import { TezosAction, TezosActionType } from "./actions"
import { InMemorySigner } from "@taquito/signer"
import { EnvKey, getEnv } from "services/config"
import { BeaconWallet } from "@taquito/beacon-wallet"

interface TezosProvider {
  state: TezosState
  dispatch: React.Dispatch<TezosAction>
}

export const TezosContext = createContext<TezosProvider>({
  state: INITIAL_STATE,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispatch: () => {}
})

const getSavedState = async (): Promise<TezosState> => {
  try {
    const network = getTezosNetwork()
    const tezos = createTezos(network)

    let wallet, account

    if (getEnv(EnvKey.REACT_APP_IS_NOT_TESTING) === "true") {
      wallet = createWallet(network)
      account = await tezos.wallet.pkh()
      tezos.setProvider({ wallet })
    } else {
      const signer = await InMemorySigner.fromSecretKey(ALICE_PRIV_KEY)
      wallet = signer
      account = await signer.publicKeyHash()
      tezos.setProvider({ signer })
    }

    if (!account) {
      throw new Error("No wallet address found")
    }

    return {
      network,
      tezos,
      wallet: wallet as BeaconWallet,
      account
    }
  } catch (error) {
    return INITIAL_STATE
  }
}

export const TezosProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

  useEffect(() => {
    mixpanel.register({ Network: state.network })
  }, [state.network])

  useEffect(() => {
    getSavedState().then(tezosState => {
      dispatch({
        type: TezosActionType.UPDATE_TEZOS,
        payload: tezosState
      })
    })
  }, [])

  return <TezosContext.Provider value={{ state, dispatch }}>{children}</TezosContext.Provider>
}
