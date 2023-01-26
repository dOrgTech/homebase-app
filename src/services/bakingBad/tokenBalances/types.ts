import { Network } from "services/beacon"

export type DAOToken = FA2TokenDTO | NFTDTO

export interface FA2TokenDTO {
  id: string
  contract: string
  level: number
  token_id: number
  symbol: string
  name: string
  decimals: number
  network: Network
  supply: string
  balance: string
  standard: string
}

export interface NFTDTO {
  id: string
  supply: string
  contract: string
  token_id: number
  network: Network
  symbol: string
  level: number
  name: string
  decimals: number
  description: string
  artifact_uri: string
  thumbnail_uri: string
  is_transferable: boolean
  creators: string[]
  tags: string[]
  formats: {
    mimeType: string
    uri: string
  }[]
  balance: string
  standard: string
}

export interface BalanceTZKT {
  id: number
  account: Account
  token: Token
  balance: string
  transfersCount: number
  firstLevel: number
  firstTime: string
  lastLevel: number
  lastTime: string
}

export interface Account {
  alias: string
  address: string
}

export interface Token {
  id: number
  contract: Contract
  tokenId: string
  standard: string
  metadata: Metadata
  totalSupply: string
}

export interface Contract {
  alias: string
  address: string
}

export interface Metadata {
  name: string
  symbol: string
  decimals: string
  description: string
  thumbnailUri: string
  isTransferable: boolean
  shouldPreferSymbol: boolean
  tags?: string[]
  formats?: Format[]
  creators?: string[]
  displayUri?: string
  artifactUri?: string
  isBooleanAmount?: boolean
  date?: string
  image?: string
  minter?: string
  rights?: string
  attributes?: any[]
  mintingTool?: string
}

export interface Format {
  uri: string
  mimeType: string
  fileName?: string
  fileSize?: string
  dimensions?: Dimensions
  dataRate?: DataRate
  duration?: string
}

export interface Dimensions {
  unit: string
  value: string
}

export interface DataRate {
  unit: string
  value: string
}

export interface TokenDataTZKT {
  id: number
  contract: Contract
  tokenId: string
  standard: string
  firstLevel: number
  firstTime: string
  lastLevel: number
  lastTime: string
  transfersCount: number
  balancesCount: number
  holdersCount: number
  totalMinted: string
  totalBurned: string
  totalSupply: string
  metadata: Metadata
}

export interface BalanceDataDTO {
  id: number
  account: Account
  token: Token
  balance: string
  transfersCount: number
  firstLevel: number
  firstTime: string
  lastLevel: number
  lastTime: string
}
