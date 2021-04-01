export interface TokenBalancesDTO {
  balances: TokenBalance[];
  total: number;
}

export interface TokenBalance {
  contract: string;
  network: string;
  level: number;
  token_id: number;
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
}