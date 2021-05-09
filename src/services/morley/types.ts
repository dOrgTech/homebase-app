export interface MorleyContractsDTO {
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
  ledger: string
  metadata_map: string
  quorum_treshold: string
  voting_period: string
  min_xtz_amount: string
  max_xtz_amount: string
}