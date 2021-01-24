import { TezosToolkit } from "@taquito/taquito";
import {
  FA2MetadataParams,
  MetadataCarrierDeploymentData,
} from "../metadataCarrier/types";

export interface MemberTokenAllocation {
  address: string;
  tokenId: string;
  amount: string;
}

export interface TreasuryParams {
  storage: {
    membersTokenAllocation: MemberTokenAllocation[];
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
  };
  metadataCarrierDeploymentData: MetadataCarrierDeploymentData;
  tezos?: TezosToolkit;
}
