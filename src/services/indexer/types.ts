import BigNumber from "bignumber.js";
import { DAOTemplate } from "modules/creator/state";
import { Network } from "services/beacon/context";

export interface DAOTypeDTO {
    id: number;
    name: DAOTemplate;
    daos?: DAODTO[]
}

export interface TokenDTO {
    id: number;
    contract: string;
    network: string;
    level: number;
    timestamp: string;
    token_id: number;
    symbol: string;
    name: string;
    decimals: number;
    is_transferable: boolean;
    should_prefer_symbol: boolean;
    supply: string;
    daos?: DAODTO[]
}

export interface DAODTO {
    id: number;
    address: string;
    admin: string;
    frozen_token_id: number;
    token: TokenDTO;
    guardian: string;
    ledgers?: LedgerDTO[]
    proposals?: ProposalDTO[]
    max_proposals: string;
    max_quorum_change: string;
    max_quorum_threshold: string;
    max_votes: string;
    min_quorum_threshold: string;
    period: string;
    proposal_expired_time: string;
    proposal_flush_time: string;
    quorum_change: string;
    last_updated_cycle: string;
    quorum_threshold: string;
    staked: string;
    start_time: string;
    name: string;
    description: string;
    dao_type: DAOTypeDTO;
    network: Network;
    treasury_extras: [TreasuryExtraDTO] | [];
    registry_extras: [RegistryExtraDTO] | [];
}

export interface RegistryExtraDTO {
    id: number;
    registry: string;
    registry_affected: string;
    frozen_extra_value: string;
    frozen_scale_value: string;
    slash_division_value: string;
    min_xtz_amount: string;
    max_xtz_amount: string;
    slash_scale_value: string;
}

export interface TreasuryExtraDTO {
    id: number;
    frozen_extra_value: string;
    frozen_scale_value: string;
    slash_division_value: string;
    min_xtz_amount: string;
    max_xtz_amount: string;
    slash_scale_value: string;
}

export interface HolderDTO {
    id: number;
    address: string;
    ledgers?: LedgerDTO[]
    proposals?: ProposalDTO[]
    votes?: VoteDTO[]
}

export interface LedgerDTO {
    id: number;
    balance: BigNumber;
    holder: HolderDTO
}

export interface ProposalStatusDTO {
    id: number;
    description: string;
    proposals?: ProposalDTO[];
}

export interface ProposalDTO {
    id: number;
    hash: string;
    key: string;
    upvotes: string;
    downvotes: string;
    start_date: string;
    metadata: string;
    holder: HolderDTO;
    proposal_status: ProposalStatusDTO;
    voting_stage_num: string;
    proposer_frozen_token: string;
    quorum_threshold: string;
    votes: VoteDTO[]
}

export interface VoteDTO {
    id: number;
    hash: string;
    key: string;
    amount: string;
    support: boolean;
    holder: HolderDTO;
}
