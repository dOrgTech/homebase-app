import {
  BigMapAbstraction,
  ContractAbstraction,
  ContractProvider,
  TezosToolkit,
} from "@taquito/taquito";

import { Ledger } from "../../bakingBad/ledger/types";
import { Storage } from "../../bakingBad/storage/types";
import {
  DAOListMetadata,
  MetadataCarrierParameters,
} from "./metadataCarrier/types";
import { TreasuryParamsWithoutMetadata } from "./treasuryDAO/types";

export type Contract = ContractAbstraction<ContractProvider> | undefined;

export interface MigrationParams {
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

export type DAOItem = {
  address: string;
  ledger: Ledger;
  cycle: number;
} & DAOListMetadata &
  Storage;

export interface DAOStorageDTO {
  //TODO

  ledger: BigMapAbstraction;
}

export interface Transfer {
  amount: number;
  recipient: string;
}

export interface ProposeParams {
  contractAddress: string;
  tezos: TezosToolkit;
  contractParams: {
    tokensToFreeze: number;
    agoraPostId: number;
    transfers: Transfer[];
  };
}

export interface OriginateTreasuryParams {
  metadataParams: MetadataCarrierParameters;
  treasuryParams: TreasuryParamsWithoutMetadata;
}

export interface VoteParams {
  proposalKey: string;
  amount: number;
  tezos: TezosToolkit;
  contractAddress: string;
  support: boolean;
}
