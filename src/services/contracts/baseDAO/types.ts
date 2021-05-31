import { DAOTemplate } from "./../../../modules/creator/state/types";
import { ContractAbstraction, TezosToolkit, Wallet } from "@taquito/taquito";

import { MetadataCarrierDeploymentData, MetadataCarrierParameters } from "services/contracts/metadataCarrier/types";
import { DAOHolding } from "services/bakingBad/tokenBalances/types";
import { TokenMetadata } from "services/bakingBad/tokens";

export type Contract = ContractAbstraction<Wallet> | undefined;

export interface MigrationParams {
  template: DAOTemplate;
  orgSettings: OrgSettings;
  votingSettings: VotingSettings;
  quorumSettings: QuorumSettings;
}

export interface TokenHolder {
  address: string;
  balance: number;
}

export type OrgSettings = {
  name: string;
  symbol: string;
  description: string;
  administrator: string;
  guardian: string;
  governanceToken: {
    address: string;
    tokenId: string;
    tokenMetadata?: TokenMetadata
  }
};

export type QuorumSettings = {
  quorumThreshold: number;
  minQuorumAmount: number;
  maxQuorumAmount: number;
  quorumChange: number;
  quorumMaxChange: number;
};

export type VotingSettings = {
  votingDays: number;
  votingHours: number;
  votingMinutes: number;
  proposeStakeRequired: number;
  proposeStakePercentage: number;
  frozenScaleValue: number;
  frozenDivisionValue: number;
  minXtzAmount: number;
  maxXtzAmount: number;

  proposalFlushDays: number;
  proposalFlushHours: number;
  proposalFlushMinutes: number;

  proposalExpiryDays: number;
  proposalExpiryHours: number;
  proposalExpiryMinutes: number;
};

export type Settings = OrgSettings | VotingSettings | QuorumSettings;

export type ErrorValues<T> = Partial<Record<keyof T, string>>;

export interface TransferParams {
  amount: number;
  recipient: string;
  type: "XTZ" | "FA2";
  asset: DAOHolding
}

export interface Registry {
  key: string;
  value: string;
}

export interface ProposeParams {
  contractAddress: string;
  tezos: TezosToolkit;
  contractParams: {
    tokensToFreeze: number;
    agoraPostId: number;
    transfers: TransferParams[];
  };
}

export interface OriginateParams {
  metadataParams: MetadataCarrierParameters;
  params: MigrationParams;
}

export interface VoteParams {
  proposalKey: string;
  amount: number;
  tezos: TezosToolkit;
  contractAddress: string;
  support: boolean;
}

export interface FlushParams {
  tezos: TezosToolkit;
  contractAddress: string;
  numerOfProposalsToFlush: number;
}

export interface MemberTokenAllocation {
  address: string;
  tokenId: string;
  amount: string;
}

export interface BaseExtraState {
  frozenExtraValue: number;
  slashScaleValue: number;
  slashDivisionValue: number;
  maxXtzAmount: number;
  minXtzAmount: number;
}

export interface BaseStorageParams {
  adminAddress: string;
  governanceToken: {
    address: string;
    tokenId: string;
  }
  quorumThreshold: number;
  votingPeriod: number;
  extra: BaseExtraState;

  minQuorumAmount: number;
  maxQuorumAmount: number;
  guardian: string
  quorumChange: number;
  quorumMaxChange: number;
  proposalFlushPeriod: number;
  proposalExpiryPeriod: number;
}

export type Token = {
  name: string;
  symbol: string;
  decimals: number;
};

export interface MetadataStorageState {
  keyName: string;
  metadata: {
    frozenToken: Token;
    unfrozenToken: Token;
  };
}

export interface DAOParams {
  storage: BaseStorageParams;
  metadataCarrierDeploymentData: MetadataCarrierDeploymentData;
}

export type ParamsWithoutMetadata = Omit<
  DAOParams,
  "metadataCarrierDeploymentData"
>;

export interface Extra {
  frozenExtraValue: number;
  slashExtraValue: number;
  minXtzAmount: number;
  maxXtzAmount: number;
  frozenScaleValue: number;
  slashDivisionScale: number;
}