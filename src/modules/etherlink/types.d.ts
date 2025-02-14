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

// Transaction Status from actual DAO
export type ITransactionStatus = "pending" | "queued" | "executed"

export type IProposalStatus =
  | ITransactionStatus
  | "active"
  | "expired" // Not sure when
  | "canceled" // Not sure when
  | "defeated" // Not sure when
  | "executable" // voting period on and the proposal is passed
  | "executed" // proposal is executed
  | "failed" // voting period on and the proposal is failed
  | "passed" // voting period on and the proposal is passed

// Commented keys are not in use but exists in firebase
export interface IEvmFirebaseProposal {
  against: string
  author: string
  callDatas: string[]
  callData: string // Sampe value 0x
  createdAt: import("firebase/firestore").Timestamp
  description: string
  executionHash: string
  // externalResource: string
  // hash: string
  inFavor: string
  // latestStage: ITransactionStatus // Commented as unreliable
  statusHistory: Record<ITransactionStatus, dayjs.Dayjs>
  targets: string[]
  title: string
  totalSupply: string
  // transactions: string[]
  turnourPercent: number
  // TODO: To be fixed
  id: string
  type: "voting period" | "no quorum" | "offchain"
  values: string[]
  votesAgainst: number
  votesFor: number
}

// Proposal after Firebease prosessing
export interface IEvmProposal extends IEvmFirebaseProposal {
  createdAt: dayjs.Dayjs
  callDataPlain: string[]
  executionAvailableAt: dayjs.Dayjs
  isVotingActive: boolean
  isTimerActive: boolean
  proposalData: any[]
  status: IProposalStatus
  statusHistoryMap: {
    timestamp: dayjs.Dayjs
    status: ITransactionStatus
    timestamp_human: string
  }[]

  totalVotes: BigNumber
  totalVoteCount: number
  timerLabel: string
  timerTargetDate: dayjs.Dayjs
  txHash: string

  votingExpiresAt: dayjs.Dayjs
  votingStartTimestamp: dayjs.Dayjs
  choices?: IEvmOffchainChoice[]
  values: any[]
  externalResource: string
  hash: string

  isVotingActive: boolean
  latestStage: string
  referenceBlock: number
  proposer?: string
  status: IProposalStatus
  statusHistoryMap: {
    timestamp: dayjs.Dayjs
    status: ITransactionStatus
    timestamp_human: string
  }[]
  totalVotes: BigNumber
  totalVoteCount: number
  timerLabel: string
  timerTargetDate: dayjs.Dayjs
  votingStartTimestamp: dayjs.Dayjs
  votingExpiresAt: dayjs.Dayjs
  votesWeightPercentage: number

  // For offchain proposals
  choices?: IEvmOffchainChoice[]
}

export interface IEvmProposalTxn {
  "blockHash": string
  "blockNumber": number
  "from": IEthereumAddress
  "gasPrice": BigNumber
  "hash": string
  "input": string
  "to": IEthereumAddress
  "value": string
  "type": number
  "#iface": any
  "#logs": any[]
}

export enum EProposalType {
  transfer_assets = "transfer_assets",
  edit_registry = "edit_registry",
  contract_call = "contract_call",
  change_config = "change_config",
  token_operation = "token_operation",
  off_chain_debate = "off_chain_debate"
}
