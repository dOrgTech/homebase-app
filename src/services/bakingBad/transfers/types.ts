import BigNumber from "bignumber.js";

export interface TransfersDTO {
  transfers: TransferDTO[];
  total: number;
  last_id: string
}

export interface TransferDTO {
  indexed_time: number;
  network: string;
  contract: string;
  initiator: string;
  hash: string;
  status: string;
  timestamp: string;
  level: number;
  from: string;
  to: string;
  token_id: number;
  amount: string;
  counter: number;
  token: {
    contract: string;
    network: string;
    token_id: number;
    symbol: string;
    name: string;
    decimals: number
  }
  alias: string;
  to_alias: string;
}

export type TokenTransferWithBN = Omit<TransferDTO, "amount"> & { amount: BigNumber }