import { BigMapAbstraction } from "@taquito/taquito";
import { Ledger } from "../../bakingBad/ledger/types";
import { DAOListMetadata } from "./metadataCarrier/types";

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
  proposalDays: number;
  proposalHours: number;
  proposalMinutes: number;
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
    proposalDays: 0,
    proposalHours: 0,
    proposalMinutes: 0,
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
  ledger: Ledger;
} & DAOListMetadata;

export interface DAOStorageDTO {
  //TODO

  ledger: BigMapAbstraction;
}
