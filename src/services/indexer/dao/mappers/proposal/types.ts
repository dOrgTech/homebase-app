import BigNumber from "bignumber.js";
import { DAOTemplate } from "modules/creator/state";

export enum IndexerStatus {
    CREATED = 'created',
    DROPPED = 'dropped',
    EXECUTED = 'executed',
    PASSED = 'passed',
    REJECTED = 'rejected'
  }
  
  export interface Voter {
    address: string;
    value: BigNumber;
    support: boolean;
  }
  export interface Proposal {
    id: string;
    upVotes: BigNumber;
    downVotes: BigNumber;
    startLevel: number;
    startDate: string;
    quorumThreshold: BigNumber;
    proposer: string;
    period: number;
    proposerFrozenTokens: string;
    type: DAOTemplate;
    indexer_status_history: {
      timestamp: string;
      description: IndexerStatus;
    }[];
    voters: {
      address: string;
      support: boolean;
      value: BigNumber;
    }[];
  }
  
  export interface TreasuryProposal extends Proposal {
    transfers: Transfer[];
    agoraPostId: string;
  }
  
  export interface RegistryProposal extends Proposal {
    list: {
      key: string;
      value: string;
    }[];
    transfers: Transfer[];
    agoraPostId: string;
  }
  export interface ProposalWithStatus extends Proposal {
    status: ProposalStatus;
    statusHistory: { status: ProposalStatus; timestamp: string }[];
  }
  
  export interface RegistryProposalWithStatus extends RegistryProposal {
    status: ProposalStatus;
    flushable: boolean;
    statusHistory: { status: ProposalStatus; timestamp: string }[];
  }
  
  export interface TreasuryProposalWithStatus extends TreasuryProposal {
    status: ProposalStatus;
    flushable: boolean;
    statusHistory: { status: ProposalStatus; timestamp: string }[];
  }
  
  export enum ProposalStatus {
    PENDING = "pending",
    ACTIVE = "active",
  
    PASSED = "passed",
    REJECTED = "rejected",
  
    NO_QUORUM = "no quorum",

    EXECUTABLE = 'executable',
  
    DROPPED = "dropped",
    EXPIRED = "expired",
    EXECUTED = "executed",
  }
  
  export interface RegistryItemDTO {
    prim: "Pair";
    args: [{ string: string }, { args: [{ string: string }]; prim: "Some" }];
  }
  
  export interface Transfer {
    amount: BigNumber;
    beneficiary: string;
    type: "XTZ" | "FA2";
  }
  
  export interface FA2Transfer extends Transfer {
    contractAddress: string;
    tokenId: string;
  }
  