export enum ProposalStatus {
  ACTIVE = "active",
  CLOSED = "closed"
}
export interface PollFundingRequest {
  recipient: string
  amount: string
}

export interface PollOnchainProposal {
  daoAddress: string
  proposalKey: string
  network: string
}

export interface Poll {
  _id?: string
  daoID: string | undefined
  description: string
  name: string
  referenceBlock?: string
  startTime: string
  endTime: string
  totalSupplyAtReferenceBlock?: any
  choices: string[]
  externalLink: ""
  author: string
  isActive?: ProposalStatus
  timeFormatted?: string
  tokenSymbol?: string
  tokenAddress?: string
  tokenDecimals?: string
  votes?: number
  votingStrategy: number
  endTimeMinutes?: number | null
  endTimeHours?: number | null
  endTimeDays?: number | null
  isXTZ: boolean
  id?: string
  getStatus?: any
  // Optional treasury funding attached to the poll. Sent to the lite backend
  // inside the signed payload and returned by the poll read endpoints.
  fundingRequest?: PollFundingRequest
  // Set by the backend once the poll has been promoted to an on-chain proposal.
  onchainProposal?: PollOnchainProposal
  // Form-only fields for the optional "Funding request" section. They are
  // folded into `fundingRequest` (or dropped) before the payload is signed.
  fundingRecipient?: string
  fundingAmount?: string
}

export interface Vote {
  address: string
  balanceAtReferenceBlock: string
}
