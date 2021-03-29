import {
  NamedMapNumberValue,
  NamedMapValue,
  UnnamedMapValue,
} from "services/bakingBad/types";

export interface BaseStorage {
  slashDivisionValue: number;
  slashScaleValue: number;
  frozenScaleValue: number;
  frozenExtraValue: number;
  maxProposalSize: number;
  votingPeriod: number;
  quorumTreshold: number;
  proposalsMapNumber: number;
  ledgerMapNumber: number;
  proposalsToFlush: any;
}

export interface TreasuryStorage extends BaseStorage {
  maxXtzAmount: string;
  minXtzAmount: string;
}

export interface RegistryStorage extends BaseStorage {
  registryMapNumber: number;
  proposalReceivers: any;
}

export type Storage = RegistryStorage | TreasuryStorage;

export type StorageDTO = TreasuryStorageDTO | RegistryStorageDTO;

export interface RegistryStorageDTO {
  prim: string;
  type: string;
  children: [
    NamedMapNumberValue,
    NamedMapNumberValue,
    NamedMapValue,
    NamedMapValue,
    NamedMapValue,
    {
      prim: string;
      type: string;
      name: string;
      children: [UnnamedMapValue];
    },
    NamedMapValue,
    NamedMapValue,
    {
      prim: string;
      type: string;
      name: string;
      children: [
        NamedMapValue,
        NamedMapValue,
        NamedMapValue,
        NamedMapValue,
        NamedMapValue,
        NamedMapValue,
        NamedMapValue,
        NamedMapValue,
        NamedMapValue
      ];
    },
    NamedMapNumberValue,
    {
      prim: string;
      type: string;
      name: string;
      children?: NamedMapValue[];
    },
    NamedMapValue,
    NamedMapNumberValue,
    {
      prim: string;
      type: string;
      name: string;
      children: NamedMapValue[];
    }
  ];
}

export interface TreasuryStorageDTO {
  prim: string;
  type: string;
  children: [
    NamedMapNumberValue,
    NamedMapNumberValue,
    NamedMapValue,
    NamedMapValue,
    NamedMapValue,
    {
      prim: string;
      type: string;
      name: string;
      children: [UnnamedMapValue];
    },
    NamedMapValue,
    NamedMapValue,
    {
      prim: string;
      type: string;
      name: string;
      children: [
        NamedMapValue,
        NamedMapValue,
        NamedMapValue,
        NamedMapValue,
        NamedMapValue,
        NamedMapValue,
        NamedMapValue
      ];
    },
    NamedMapNumberValue,
    {
      prim: string;
      type: string;
      name: string;
      children?: NamedMapValue[];
    },
    NamedMapValue,
    NamedMapNumberValue
  ];
}
