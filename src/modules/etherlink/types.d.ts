export interface IEvmOffchainChoiceForVote {
  address?: string
  choice: string
  choiceId: string
  pollID: string
}

export interface IEvmOffchainChoice {
  _id: string
  name: string
  pollID: string
  address?: string // While Voting
  walletAddresses: string[]
  selected?: boolean
}

export interface IEvmProposal {
  against: string
  author: string
  callDataPlain: string[]
  callDatas: string[]
  calldata: string
  createdAt: dayjs.Dayjs
  description: string
  executionHash: string
  externalResource: string
  hash: string
  id: string
  isVotingActive: boolean
  latestStage: string
  referenceBlock: number
  proposer?: string
  status: string
  statusHistoryMap: any[]
  statusHistory: Record<string, any>
  targets: string[]
  title: string
  totalVotes: BigNumber
  totalVoteCount: number
  timerLabel: string
  transactions: any[]
  txHash: string
  type: string
  values: any[]
  votesAgainst: number
  votesFor: number
  votesWeightPercentage: number
  votingExpiresAt: dayjs.Dayjs
  votingStartTimestamp: dayjs.Dayjs
  choices?: IEvmOffchainChoice[]
}
