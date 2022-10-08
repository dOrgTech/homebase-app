import BigNumber from "bignumber.js"

export interface TransfersDTO {
  transfers: TransferDTO[]
  total: number
}

export interface TransferDTO {
  indexed_time: number
  network: string
  contract: string
  initiator: string
  hash: string
  status: string
  timestamp: string
  level: number
  from: string
  to: string
  token_id: number
  amount: string
  counter: number
  token: {
    contract: string
    network: string
    token_id: number
    symbol: string
    name: string
    decimals: number
  }
  alias: string
  to_alias: string
}

export interface TransferTZKT {
  id: number
  level: number
  timestamp: string
  token: Token
  from: From
  to: To
  amount: string
  transactionId: number
}

export interface Token {
  id: number
  contract: Contract
  tokenId: string
  standard: string
  metadata?: Metadata
}

export interface Contract {
  alias?: string
  address: string
}

export interface Metadata {
  name?: string
  symbol: string
  decimals: string
  description?: string
  thumbnailUri?: string
  shouldPreferSymbol: boolean
  isTransferable?: boolean
  isBooleanAmount?: boolean
}

export interface From {
  address: string
  alias?: string
}

export interface To {
  address: string
}

export interface TransactionTzkt {
  type: string
  id: number
  level: number
  timestamp: string
  block: string
  hash: string
  counter: number
  initiator: Initiator
  sender: Sender
  senderCodeHash: number
  nonce: number
  gasLimit: number
  gasUsed: number
  storageLimit: number
  storageUsed: number
  bakerFee: number
  storageFee: number
  allocationFee: number
  target: Target
  targetCodeHash: number
  amount: number
  parameter: Parameter
  status: string
  hasInternals: boolean
  tokenTransfersCount: number
}

export interface Initiator {
  address: string
}

export interface Sender {
  address: string
}

export interface Target {
  alias: string
  address: string
}

export interface Parameter {
  entrypoint: string
  value: Value[]
}

export interface Value {
  txs: Tx[]
  from_: string
}

export interface Tx {
  to_: string
  amount: string
  token_id: string
}

export type TokenTransferWithBN = Omit<TransferDTO, "amount"> & { amount: BigNumber }
