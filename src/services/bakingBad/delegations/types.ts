export interface DelegationDTO {
  type: string
  id: number
  level: number
  timestamp: string
  block: string
  hash: string
  counter: number
  initiator: {
    address: string
  }
  sender: {
    address: string
  }
  nonce: number
  gasLimit: number
  gasUsed: number
  bakerFee: number
  amount: number
  newDelegate: {
    alias?: string
    address: string
  }
  status: string
}

export interface TokenDelegationDTO {
  id: number
  active: boolean
  hash: string
  key: string
  value: string
  firstLevel: number
  lastLevel: number
  updates: number
}

export interface UserDelegateBalance {
  address: string
  balance: string
}
