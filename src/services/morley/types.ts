export interface MorleyContractsDTO {
  steps: {
    "00_originator.tz": string
    "00_storage.tz": string
    "01_packed_lambda.tz": string
    "02_packed_lambda.tz": string
  }
  storage: string
}

export interface MorleyContracts {
  steps: {
    originator: string
    storage: string
    lambdas: string[]
  }
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