import { BigNumber } from "bignumber.js";

export interface TokenBalancesDTO {
  balances: DAOHolding[];
  total: number;
}

export type DAOHolding = DAOHoldingToken | DAOHoldingNFT

export interface DAOHoldingToken {
  id: string;
  contract: string;
  level: number;
  token_id: number;
  symbol: string;
  name: string;
  decimals: number;
  balance: BigNumber;
  type: "TOKEN";
}

export interface DAOHoldingNFT {
  type: "NFT";
  "contract": string;
  "network": string;
  "token_id": number;
  "symbol": "OBJKT";
  "name": string;
  "decimals": number;
  "description": string;
  "artifact_uri": string;
  "thumbnail_uri": string;
  "artifact_hash": string;
  "thumbnail_hash": string;
  "is_transferable": boolean;
  "creators": string[];
  "tags": string[];
  "formats":
  {
    "mimeType": string;
    "uri": string;
  }[],
  "balance": string;
}
