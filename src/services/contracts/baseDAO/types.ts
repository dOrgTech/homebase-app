import { ContractAbstraction, TezosToolkit, Wallet } from "@taquito/taquito"

import { MetadataCarrierDeploymentData, MetadataCarrierParameters } from "services/contracts/metadataCarrier/types"
import { BigNumber } from "bignumber.js"
import { DeploymentMethod, MigrationParams } from "modules/creator/state"
import { Token as TokenModel } from "models/Token"

export type Contract = ContractAbstraction<Wallet> | undefined

export interface TokenHolder {
  address: string
  balance: number
}

export type TransferParams = XTZTransferParams | FA2TransferParams | FA12TransferParams

export interface XTZTransferParams {
  amount: number
  recipient: string
  type: "XTZ"
}

export interface FA2TransferParams {
  amount: number
  recipient: string
  type: string
  asset: TokenModel
}

export interface FA12TransferParams {
  amount: number
  recipient: string
  type: string
  asset: TokenModel
}

export interface Registry {
  key: string
  value: string
}

export interface ProposeParams {
  contractAddress: string
  tezos: TezosToolkit
  contractParams: {
    tokensToFreeze: BigNumber
    agoraPostId: number
    transfers: TransferParams[]
  }
}

export interface ConfigProposalParams {
  frozen_extra_value?: string
  frozen_scale_value?: number
  max_proposal_size?: number
  slash_division_value?: number
  slash_scale_value?: number
}

export interface OriginateParams {
  metadataParams: MetadataCarrierParameters
  params: MigrationParams
  deploymentMethod: DeploymentMethod
}

export interface VoteParams {
  proposalKey: string
  amount: BigNumber
  tezos: TezosToolkit
  contractAddress: string
  support: boolean
}

export interface FlushParams {
  tezos: TezosToolkit
  contractAddress: string
  numerOfProposalsToFlush: number
}

export interface MemberTokenAllocation {
  address: string
  tokenId: string
  amount: string
}

export interface BaseExtraState {
  frozenExtraValue: BigNumber
  slashScaleValue: BigNumber
  maxXtzAmount: BigNumber
  minXtzAmount: BigNumber
}

export interface BaseStorageParams {
  adminAddress: string
  governanceToken: {
    address: string
    tokenId: string
  }
  quorumThreshold: BigNumber
  votingPeriod: number
  extra: BaseExtraState

  minQuorumAmount: BigNumber
  maxQuorumAmount: BigNumber
  guardian: string
  quorumChange: number
  quorumMaxChange: number
  proposalFlushPeriod: number
  proposalExpiryPeriod: number
}

export type Token = {
  name: string
  symbol: string
  decimals: number
}

export interface MetadataStorageState {
  keyName: string
  metadata: {
    frozenToken: Token
    unfrozenToken: Token
  }
}

export interface DAOParams {
  storage: BaseStorageParams
  metadataCarrierDeploymentData: MetadataCarrierDeploymentData
}

export type ParamsWithoutMetadata = Omit<DAOParams, "metadataCarrierDeploymentData">

export interface Extra {
  frozenExtraValue: BigNumber
  slashExtraValue: BigNumber
  minXtzAmount: BigNumber
  maxXtzAmount: BigNumber
  frozenScaleValue: BigNumber
  slashDivisionScale: BigNumber
}
