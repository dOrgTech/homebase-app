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
import { TreasuryParams, TreasuryParamsWithoutMetadata } from "./treasuryDAO/types";

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
  voteStakeRequired: number;
  voteStakePercentage: number;
  minStake: number;
};

export type MemberSettings = {
  tokenHolders: TokenHolder[];
  maxAgent: number;
  administrator: string;
};

export type Settings = OrgSettings | VotingSettings | MemberSettings;

export type ErrorValues<T> = Partial<Record<keyof T, string>>;

export const INITIAL_MIGRATION_STATE: MigrationParams = {
  // DAO Settings
  orgSettings: {
    name: "",
    symbol: "",
    description: "",
  },
  // Voting Settings
  votingSettings: {
    votingDays: 0,
    votingHours: 0,
    votingMinutes: 0,

    proposeStakeRequired: 0,
    proposeStakePercentage: 0,
    voteStakeRequired: 0,
    voteStakePercentage: 0,
    minStake: 0,
  },
  // Member Settings
  memberSettings: {
    tokenHolders: [],
    maxAgent: 0,
    administrator: "",
  },
};

export type DAOItem = {
  address: string;
  ledger: Ledger;
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
