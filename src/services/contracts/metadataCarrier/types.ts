import { DAOTemplate } from "../../../modules/creator/state/types"
export interface FA2TokenMetadata {
  name: string
  symbol: string
  decimals: number
}

export interface FA2MetadataParams {
  unfrozenToken: FA2TokenMetadata
  frozenToken: FA2TokenMetadata
}

export interface DAOMetadataParams {
  description: string
  template: DAOTemplate
  authors: string[]
}

export type MetadataParams = FA2MetadataParams & DAOMetadataParams
export interface MetadataCarrierDeploymentData {
  deployAddress: string
  keyName: string
}

export interface MetadataCarrierParameters {
  keyName: string
  metadata: MetadataParams
}

export interface DAOMetadataDTO {
  integrityCheckResult: any
  metadata: {
    authors: string[]
    homepage: string
    interfaces: string[]
    license: { name: string }
    version: string
    views: any[]
  }
  sha256Hash: any
  uri: string
}

export interface DAOListMetadata {
  address: string
  authors: string[]
  name: string
  template: DAOTemplate
  description: string
  unfrozenToken: {
    symbol: string
    name: string
    decimals: string
  }
}
