export interface Community {
  _id: string
  name: string
  description: string
  linkToTerms: string
  members: string[]
  tokenAddress: string
  polls: string[]
  tokenType?: string
  symbol: string
  tokenID: string
  picUri: string
  requiredTokenOwnership: boolean
  allowPublicAccess: boolean
  decimals?: string
  network: string
}

export interface CommunityToken {
  _id?: string
  daoID: string
  tokenID: number
  symbol: string
  tokenAddress: string
  decimals: string
}
