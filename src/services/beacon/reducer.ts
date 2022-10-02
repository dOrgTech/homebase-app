import { TezosToolkit } from "@taquito/taquito"
import { BeaconWallet } from "@taquito/beacon-wallet"
import { createTezos, getTezosNetwork, Network } from "./utils"
import { TezosAction, TezosActionType } from "services/beacon/actions"

export interface TezosState {
  network: Network
  tezos: TezosToolkit
  account: string
  wallet: BeaconWallet | undefined
}

const network = getTezosNetwork()
const tezos = createTezos(network)

export const INITIAL_STATE: TezosState = {
  tezos,
  network,
  wallet: undefined,
  // @TODO: refactor interface this is actually an address
  account: ""
}

export const reducer = (state: TezosState, action: TezosAction): TezosState => {
  switch (action.type) {
    case TezosActionType.UPDATE_TEZOS:
      return {
        ...state,
        tezos: action.payload.tezos,
        network: action.payload.network,
        account: action.payload.account,
        wallet: action.payload.wallet
      }
    case TezosActionType.RESET_TEZOS:
      return {
        ...state,
        tezos: tezos,
        account: "",
        wallet: undefined
      }
  }
}
