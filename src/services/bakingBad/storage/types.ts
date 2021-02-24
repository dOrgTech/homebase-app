import {
  NamedMapNumberValue,
  NamedMapValue,
  UnnamedMapValue,
} from "services/bakingBad/types";

export interface Storage {
  slashDivisionValue: number;
  slashScaleValue: number;
  frozenScaleValue: number;
  frozenExtraValue: number;
  maxProposalSize: number;
  maxXtzAmount: string;
  minXtzAmount: string;
  votingPeriod: number;
  quorumTreshold: number;
  proposalsMapNumber: number;
  ledgerMapNumber: number;
}

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
