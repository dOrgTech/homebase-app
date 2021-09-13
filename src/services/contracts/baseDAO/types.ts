import { ContractAbstraction, TezosToolkit, Wallet } from "@taquito/taquito";

import {
  MetadataCarrierDeploymentData,
  MetadataCarrierParameters,
} from "services/contracts/metadataCarrier/types";
import { DAOHolding } from "services/bakingBad/tokenBalances/types";
import { BigNumber } from "bignumber.js";
import { MigrationParams } from "modules/creator/state";

export type Contract = ContractAbstraction<Wallet> | undefined;

export interface TokenHolder {
  address: string;
  balance: number;
}

export interface TransferParams {
  amount: number;
  recipient: string;
  type: "XTZ" | "FA2";
  asset: DAOHolding;
}

export interface Registry {
  key: string;
  value: string;
}

export interface ProposeParams {
  contractAddress: string;
  tezos: TezosToolkit;
  contractParams: {
    tokensToFreeze: BigNumber;
    discoursePostId: number;
    transfers: TransferParams[];
  };
}

export interface OriginateParams {
  metadataParams: MetadataCarrierParameters;
  params: MigrationParams;
}

export interface VoteParams {
  proposalKey: string;
  amount: BigNumber;
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
  frozenExtraValue: BigNumber;
  slashScaleValue: BigNumber;
  slashDivisionValue: BigNumber;
  maxXtzAmount: BigNumber;
  minXtzAmount: BigNumber;
}

export interface BaseStorageParams {
  adminAddress: string;
  governanceToken: {
    address: string;
    tokenId: string;
  };

  quorumThreshold: BigNumber;
  votingPeriod: number;
  extra: BaseExtraState;

  minQuorumAmount: BigNumber;
  maxQuorumAmount: BigNumber;
  guardian: string;
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
  frozenExtraValue: BigNumber;
  slashExtraValue: BigNumber;
  minXtzAmount: BigNumber;
  maxXtzAmount: BigNumber;
  frozenScaleValue: BigNumber;
  slashDivisionScale: BigNumber;
}
