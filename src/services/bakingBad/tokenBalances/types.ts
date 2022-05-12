import { Network } from "services/beacon";

export interface TokenBalancesDTO {
  balances: (DAOToken & { balance: string })[];
  total: number;
}

export type DAOToken = FA2TokenDTO | NFTDTO;

export interface FA2TokenDTO {
  id: string;
  contract: string;
  level: number;
  token_id: number;
  symbol: string;
  name: string;
  decimals: number;
  network: Network;
  supply: string;
}

export interface NFTDTO {
  id: string;
  supply: string;
  contract: string;
  token_id: number;
  network: Network;
  symbol: string;
  level: number;
  name: string;
  decimals: number;
  description: string;
  artifact_uri: string;
  thumbnail_uri: string;
  is_transferable: boolean;
  creators: string[];
  tags: string[];
  formats: {
    mimeType: string;
    uri: string;
  }[];
}
