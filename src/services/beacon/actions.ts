import { TezosToolkit } from "@taquito/taquito"
import { BeaconWallet } from "@taquito/beacon-wallet"
import { Network } from "./utils"

export enum TezosActionType {
  UPDATE_TEZOS = "UPDATE_TEZOS",
  RESET_TEZOS = "RESET_TEZOS"
}

interface UpdateTezos {
  type: TezosActionType.UPDATE_TEZOS
  payload: {
    tezos: TezosToolkit
    network: Network
    account: string
    wallet: BeaconWallet | undefined
  }
}

interface ResetTezos {
  type: TezosActionType.RESET_TEZOS
}

export type TezosAction = UpdateTezos | ResetTezos
