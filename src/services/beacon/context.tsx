import React, { createContext, useEffect, useReducer } from "react"
import mixpanel from "mixpanel-browser"
import { createTezos, createWallet, getTezosNetwork } from "./utils"
import { INITIAL_STATE, reducer, TezosState } from "./reducer"
import { TezosAction, TezosActionType } from "./actions"

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
    const wallet = createWallet(network)
    const activeAccount = await wallet.client.getActiveAccount()

    if (!activeAccount?.address) {
      throw new Error("No wallet address found")
    }

    tezos.setProvider({ wallet })

    return {
      network,
      tezos,
      wallet,
      account: activeAccount.address
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
