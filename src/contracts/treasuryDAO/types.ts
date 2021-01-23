export interface TreasuryToken {
  name: string;
  symbol: string;
  decimals: number;
}

export interface TreasuryMetadataParams {
  unfrozenToken: TreasuryToken
  frozenToken: TreasuryToken
}
