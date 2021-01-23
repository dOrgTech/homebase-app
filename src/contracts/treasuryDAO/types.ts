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
  quorumTreshold: number;
  votingPeriod: number;
}