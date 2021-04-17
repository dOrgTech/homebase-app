import { DAOTemplate } from "./../../../modules/creator/state/types";
import { ContractAbstraction, TezosToolkit, Wallet } from "@taquito/taquito";

import { MetadataCarrierDeploymentData, MetadataCarrierParameters } from "services/contracts/metadataCarrier/types";

export type Contract = ContractAbstraction<Wallet> | undefined;

export interface MigrationParams {
  template: DAOTemplate;
  orgSettings: OrgSettings;
  votingSettings: VotingSettings;
  memberSettings: MemberSettings;
}

export interface TokenHolder {
  address: string;
  balance: number;
}

export type OrgSettings = {
  name: string;
  symbol: string;
  description: string;
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
  maxProposalSize: number;
  quorumTreshold: number;
};

export type MemberSettings = {
  tokenHolders: TokenHolder[];
  administrator: string;
};

export type Settings = OrgSettings | VotingSettings | MemberSettings;

export type ErrorValues<T> = Partial<Record<keyof T, string>>;

export type TransferParams = XTZTransferParams | FA2TransferParams

export interface XTZTransferParams {
  amount: number;
  recipient: string;
  type: "XTZ";
}

export interface FA2TransferParams {
  to: string;
  tokenId: number;
  amount: number;
  contractAddress: string;
  type: "FA2";
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
  maxProposalSize: number;
}

export interface BaseStorageParams {
  membersTokenAllocation: MemberTokenAllocation[];
  adminAddress: string;
  quorumTreshold: number;
  votingPeriod: number;
  extra: BaseExtraState;
  totalSupply: any;
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