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
  data: {
    key: {
      prim: "bytes";
      type: "bytes";
      name: "@bytes_55";
      value: string;
    };
    value: {
      prim: "pair";
      type: "namedtuple";
      name: "@pair_56";
      children: [
        {
          prim: "nat";
          type: "nat";
          name: "downvotes";
          value: string;
        },
        {
          prim: "map";
          type: "map";
          name: "metadata";
          value: string;
        },
        {
          prim: "address";
          type: "address";
          name: "proposer";
          value: string;
        },
        {
          prim: "nat";
          type: "nat";
          name: "proposer_frozen_token";
          value: string;
        },
        {
          prim: "nat";
          type: "nat";
          name: "quorum_threshold";
          value: string;
        },
        {
          prim: "nat";
          type: "nat";
          name: "start_date";
          value: string;
        },
        {
          prim: "nat";
          type: "nat";
          name: "upvotes";
          value: string;
        },
        {
          prim: "list";
          type: "list";
          name: "voters";
          value: any;
        },
        {
          prim: "nat";
          type: "nat";
          name: "voting_stage_num";
          value: string;
        },
      ];
    };
    key_hash: "exprtZqjgqRrZr2h8Hd43wFQqnBxtNHH2UCuwaD1oEpYnJjg1DJmBH";
    key_string: "26725b294531fe0261008394d72e79828e4595bf8ee63a5f46e7d669f2d6ef21";
    level: 191891;
    timestamp: "2021-04-21T11:42:59Z";
  };
  count: 1;
}[];

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
  value: number;
  support: boolean;
}
export interface Proposal {
  id: string;
  upVotes: number;
  downVotes: number;
  startDate: string;
  
  quorumThreshold: string;
  proposer: string;
  period: number;
  proposerFrozenTokens: string;
  type: DAOTemplate;
  voters: {
    address: string;
    support: boolean;
    value: number;
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
  statusHistory: { status: ProposalStatus, timestamp: string }[]
}

export interface RegistryProposalWithStatus extends RegistryProposal {
  status: ProposalStatus;
  flushable: boolean;
  statusHistory: { status: ProposalStatus, timestamp: string }[]
}

export interface TreasuryProposalWithStatus extends TreasuryProposal {
  status: ProposalStatus;
  flushable: boolean;
  statusHistory: { status: ProposalStatus, timestamp: string }[]
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
  amount: string;
  beneficiary: string;
  type: "XTZ" | "FA2";
}

export interface FA2Transfer extends Transfer {
  contractAddress: string;
  tokenId: string;
}
