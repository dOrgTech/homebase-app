export interface DAOType {
    id: number;
    name: string;
    daos?: DAO[]
}

export interface Token {
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
    daos?: DAO[]
}

export interface DAO {
    id: number;
    address: string;
    frozen_token_id: number;
    token: Token;
    guardian: string;
    ledger?: Ledger[]
    proposals?: Proposal[]
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
    dao_type: DAOType
    network: string;
    treasury_extras: [TreasuryExtra] | [];
    registry_extras: [RegistryExtra] | [];
}

export interface RegistryExtra {
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

export interface TreasuryExtra {
    id: number;
    frozen_extra_value: string;
    frozen_scale_value: string;
    slash_division_value: string;
    min_xtz_amount: string;
    max_xtz_amount: string;
    slash_scale_value: string;
}

export interface Holder {
    id: number;
    address: string;
    ledger?: Ledger[]
    proposals?: Proposal[]
    votes?: Vote[]
}

export interface Ledger {
    id: number;
    balance: string;
}

export interface ProposalStatus {
    id: number;
    description: string;
    proposals: Proposal[];
}

export interface Proposal {
    id: number;
    hash: string;
    key: string;
    upvotes: string;
    downvotes: string;
    start_date: string;
    metadata: string;
    holder: Holder;
    voting_stage_num: string;
    proposer_frozen_token: string;
    quorum_threshold: string;
    votes?: Vote[]
}

export interface Vote {
    id: number;
    hash: string;
    key: string;
    amount: string;
    support: boolean;
    holder: Holder;
}
