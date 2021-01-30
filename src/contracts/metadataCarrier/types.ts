export interface FA2TokenMetadata {
  name: string;
  symbol: string;
  decimals: number;
}

export interface FA2MetadataParams {
  unfrozenToken: FA2TokenMetadata;
  frozenToken: FA2TokenMetadata;
}

export interface MetadataCarrierDeploymentData {
  deployAddress: string;
  keyName: string;
}

export interface MetadataCarrierParameters {
  keyName: string;
  metadata: FA2MetadataParams;
}
