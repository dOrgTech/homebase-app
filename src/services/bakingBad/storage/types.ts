import { NamedMapNumberValue, NamedMapValue, UnnamedMapValue } from "../types";

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

export interface StorageDTO {
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
      children: [
        {
          prim: string;
          type: string;
          children: [UnnamedMapValue, UnnamedMapValue];
        }
      ];
    },
    NamedMapValue,
    NamedMapNumberValue
  ];
}
