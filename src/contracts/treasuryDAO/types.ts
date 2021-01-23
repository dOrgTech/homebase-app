export interface TreasuryToken {
  name: string;
  symbol: string;
  decimals: number;
}

export interface TreasuryMetadataParams {
  unfrozenToken: TreasuryToken;
  frozenToken: TreasuryToken;
}

export interface MemberTokenAllocation {
  address: string;
  tokenId: string;
  amount: string;
}

export interface TreasuryStorageParams {
  membersTokenAllocation: MemberTokenAllocation[],
  adminAddress: string;
  frozenScaleValue: number;
  frozenExtraValue: number;
  slashScaleValue: number;
  slashDivisionValue: number;
  minXtzAmount: number;
  maxXtzAmount: number;
  maxProposalSize: number;
}