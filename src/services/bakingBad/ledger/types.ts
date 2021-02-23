import { UnnamedMapValue } from "services/bakingBad/types";

export interface LedgerDTOItem {
  data: {
    key: {
      prim: string;
      type: string;
      children: UnnamedMapValue[];
    };
    value: UnnamedMapValue;
    key_hash: string;
    key_string: string;
    level: number;
    timestamp: string;
  };
  count: number;
}

export type LedgerDTO = LedgerDTOItem[];

interface LedgerBalances {
  [tokenId: number]: number;
}

export interface LedgerMap {
  [address: string]: {
    balances: LedgerBalances;
  };
}

export type Ledger = {
  address: string;
  balances: LedgerBalances;
}[];
