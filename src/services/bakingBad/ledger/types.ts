export interface LedgerDTOItem {
  id: number;
  active: boolean;
  hash: string;
  key: {
    nat: string;
    address: string;
  };
  value: string;
  firstLevel: number;
  lastLevel: number;
  updates: number;
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
