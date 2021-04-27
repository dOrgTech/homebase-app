export interface TokenBalancesDTO {
  balances: DAOHolding[];
  total: number;
}

export interface DAOHolding {
  contract: string;
  level: number;
  token_id: number;
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
}