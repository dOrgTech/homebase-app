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
    lambda1: string
    lambda2: string
  }
  storage: string
}

export interface GeneratorArgs {
  admin_address: string;
  token_address: string;
  frozen_scale_value: string;
  frozen_extra_value: string;
  max_proposal_size: string;
  slash_scale_value: string;
  slash_division_value: string;
  min_xtz_amount: string;
  max_xtz_amount: string;
}