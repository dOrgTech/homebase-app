export interface Choice {
  _id?: string
  name: string
  pollID: string
  walletAddresses: WalletAddress[]
  selected?: boolean
}

export interface WalletAddress {
  address: string
  balanceAtReferenceBlock: string
  cidLink: string
  choiceId: string
  payloadBytes: string
  signature: string
}
