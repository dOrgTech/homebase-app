import BigNumber from "bignumber.js";
import { DAOTemplate } from "modules/creator/state";

export type MutezTransfer = {
  prim: string;
  type: string;
  name: string;
  children: [
    {
      prim: string;
      type: string;
      name: string;
      children: [
        {
          prim: string;
          type: "mutez";
          name: string;
          value: string;
        },
        {
          prim: string;
          type: string;
          name: string;
          value: string;
        }
      ];
    }
  ];
};

export type ProposalDTO = {
  id: number;
  active: true;
  hash: string;
  key: string;
  value: {
    voters: {
      vote_type: true;
      vote_amount: string;
      voter_address: string;
    }[];
    upvotes: string;
    metadata: string;
    proposer: string;
    downvotes: string;
    start_date: string;
    quorum_threshold: string;
    voting_stage_num: string;
    proposer_frozen_token: string;
  };
  firstLevel: 294491;
  lastLevel: 294501;
  updates: 2;
};

export type VotersDTO = {
  prim: "list";
  type: "list";
  name: "voters";
  children?: {
    prim: "pair";
    type: "namedtuple";
    name: "@pair_75";
    children: [
      {
        prim: "nat";
        type: "nat";
        name: "vote_amount";
        value: string;
      },
      {
        prim: "bool";
        type: "bool";
        name: "vote_type";
        value: boolean;
      },
      {
        prim: "address";
        type: "address";
        name: "voter_address";
        value: string;
      }
    ];
  }[];
};

export interface Voter {
  address: string;
  value: BigNumber;
  support: boolean;
}
export interface Proposal {
  id: string;
  upVotes: BigNumber;
  downVotes: BigNumber;
  startDate: string;

  quorumThreshold: BigNumber;
  proposer: string;
  period: number;
  proposerFrozenTokens: string;
  type: DAOTemplate;
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
  flushable: boolean;
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

  DROPPED = "dropped",
  EXPIRED = "expired",
  EXECUTED = "executed",
}

export interface XTZTransferDTO {
  prim: "Left";
  args: [
    {
      prim: "Pair";
      args: [{ int: string }, { string: string }];
    }
  ];
}

export interface FA2TransferDTO {
  prim: "Right";
  args: [
    {
      prim: "Pair";
      args: [
        { string: string },
        [
          {
            prim: "Pair";
            args: [
              { string: string },
              [
                {
                  prim: "Pair";
                  args: [
                    { string: string },
                    { prim: "Pair"; args: [{ int: string }, { int: string }] }
                  ];
                }
              ]
            ];
          }
        ]
      ];
    }
  ];
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
