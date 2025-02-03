import dayjs from "dayjs"
export type IEthereumAddress = string & { __brand: "EthereumAddress" }

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
  walletAddresses: IEthereumAddress[]
  selected?: boolean
}

export type ITransactionStatus = "pending" | "executed" | "failed"

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
  statusHistoryMap: {
    timestamp: dayjs.Dayjs
    status: ITransactionStatus
    timestamp_human: string
  }[]
  statusHistory: Record<ITransactionStatus, dayjs.Dayjs>
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
