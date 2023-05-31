import BigNumber from "bignumber.js"
import { DAOTemplate } from "modules/creator/state"
import { Network } from "services/beacon"
import { IndexerStatus } from "./dao/mappers/proposal/types"

export interface DAOTypeDTO {
  id: number
  name: DAOTemplate
  daos?: DAODTO[]
}

export interface TokenDTO {
  id: number
  contract: string
  network: string
  token_id: number
  symbol: string
  name: string
  decimals: number
  supply?: string
  standard: string
  daos?: DAODTO[]
  timestamp?: string
}

export interface DAODTO {
  id: number
  address: string
  admin: string
  frozen_token_id: number
  token: TokenDTO
  guardian: string
  ledgers?: LedgerDTO[]
  proposals?: ProposalDTO[]
  max_quorum_change: string
  max_quorum_threshold: string
  min_quorum_threshold: string
  period: string
  proposal_expired_level: string
  proposal_flush_level: string
  quorum_change: string
  fixed_proposal_fee_in_token: string
  last_updated_cycle: string
  quorum_threshold: string
  staked: string
  start_level: number
  name: string
  description: string
  dao_type: DAOTypeDTO
  network: Network
  treasury_extras: [TreasuryExtraDTO] | []
  registry_extras: [RegistryExtraDTO] | []
  lambda_extras: [LambdaExtraDTO] | []
}

export interface RegistryExtraDTO {
  id: number
  registry: string
  registry_affected: string
  frozen_extra_value: string
  frozen_scale_value: string
  slash_division_value: string
  min_xtz_amount: string
  max_xtz_amount: string
  slash_scale_value: string
  returnedPercentage: string
}

export interface TreasuryExtraDTO {
  id: number
  frozen_extra_value: string
  frozen_scale_value: string
  slash_division_value: string
  min_xtz_amount: string
  max_xtz_amount: string
  slash_scale_value: string
  returnedPercentage: string
}

export interface LambdaExtraDTO {
  id: number
  registry: string
  registry_affected: string
  frozen_extra_value: string
  frozen_scale_value: string
  slash_division_value: string
  min_xtz_amount: string
  max_xtz_amount: string
  slash_scale_value: string
  max_proposal_size: string
  returnedPercentage: string
}

export interface HolderDTO {
  id: number
  address: string
  ledgers?: LedgerDTO[]
  proposals?: ProposalDTO[]
  votes?: VoteDTO[]

  proposals_aggregate: {
    aggregate: {
      count: number | null
    }
  } | null

  votes_aggregate: {
    aggregate: {
      sum: {
        amount: number | null
      }
    }
  } | null
}

export interface LedgerDTO {
  id: number
  current_stage_num: string
  current_unstaked: BigNumber
  past_unstaked: BigNumber
  staked: BigNumber
  holder: HolderDTO
}

export interface Holder {
  id: number
  address: string
  votes_cast: BigNumber
  proposals_voted: number
}

export interface Ledger {
  id: number
  current_stage_num: string
  current_unstaked: BigNumber
  past_unstaked: BigNumber
  staked: BigNumber
  holder: Holder
}

export interface ProposalStatusDTO {
  id: number
  description: IndexerStatus
  proposals?: ProposalDTO[]
}

export interface ProposalStatusUpdateDTO {
  id: number
  timestamp: string
  level: number
  proposal_status: ProposalStatusDTO
}

export interface ProposalDTO {
  id: number
  hash: string
  key: string
  upvotes: string
  downvotes: string
  start_date: string
  start_level: number
  metadata: string
  holder: HolderDTO
  status_updates: ProposalStatusUpdateDTO[]
  voting_stage_num: string
  proposer_frozen_token: string
  quorum_threshold: string
  votes: VoteDTO[]
}

export interface ProposalDTOWithVotes extends ProposalDTO {
  votes: VoteDTO[]
}

export interface VoteDTO {
  id: number
  hash: string
  key: string
  amount: string
  support: boolean
  holder: HolderDTO
  staked: boolean
}

export interface DAOListItem {
  dao_type: {
    name: DAOTemplate
  }
  description: string
  address: string
  frozen_token_id: string
  governance_token_id: string
  ledgers?: {
    holder: {
      address: string
    }
  }[]
  name: string
  network: Network
  period?: string
  staked?: string
  start_level?: number
  token: TokenDTO
}

export type FetchedDAO = DAODTO & {
  ledgers: LedgerDTO[]
  proposals: ProposalDTO[]
}

export interface FetchedProposals {
  proposals: ProposalDTOWithVotes[]
}

export interface FetchedProposal {
  proposals: ProposalDTOWithVotes[]
}

export interface DAOXTZTransferDTO {
  amount: string
  decimal_amount: number
  from_address: string
  timestamp: string
  hash: string
}

export interface DAOXTZTransfer {
  amount: BigNumber
  decimal_amount: number
  from_address: string
  timestamp: string
  hash: string
}

export interface Community {
  _id: string
  name: string
  description: string
  linkToTerms: string
  members: string[]
  tokenAddress: string
  polls: string[]
  tokenType: string
  symbol: string
  tokenID: string
  picUri: string
  requiredTokenOwnership: boolean
  allowPublicAccess: boolean
  decimals: string
  network: Network
}
