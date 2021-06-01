export interface BaseDAODockerContractsDTO {
  storage: string
}

export interface GeneratorArgs {
  admin_address: string
  governance_token_address: string
  governance_token_id: string
  max_proposal_size: string
  slash_division_value: string
  slash_scale_value: string
  frozen_extra_value: string
  frozen_scale_value: string
  metadata_map: string
  quorum_threshold: string
  min_xtz_amount: string
  max_xtz_amount: string
  max_votes: string;
  guardian_address: string
  min_quorum: string;
  max_quorum: string;
  quorum_change: string;
  max_quorum_change: string;
  proposal_flush_time: string;
  proposal_expired_time: string;
  governance_total_supply: string;
  period: string;
}