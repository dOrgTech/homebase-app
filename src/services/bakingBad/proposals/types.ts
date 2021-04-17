import { UnnamedMapValue, NamedMapValue } from "services/bakingBad/types";

// type TokenType = "mutez";

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

export type RegistryProposalsDTO = {
  data: {
    key: UnnamedMapValue;
    value: {
      prim: string;
      type: string;
      children: [
        NamedMapValue,
        NamedMapValue,
        NamedMapValue,
        {
          prim: string;
          type: string;
          name: string;
          children: [
            {
              prim: "pair";
              type: "namedtuple";
              name: "@pair_0";
              children: [
                {
                  prim: "nat";
                  type: "nat";
                  name: "agora_post_id";
                  value: string;
                },
                {
                  prim: "list";
                  type: "list";
                  name: "diff";
                  children?: {
                    prim: "pair";
                    type: "namedtuple";
                    children: [
                      {
                        prim: "bytes";
                        type: "bytes";
                        name: "key";
                        value: string;
                      },
                      {
                        prim: "bytes";
                        type: "bytes";
                        name: "new_value";
                        value: string;
                      }
                    ];
                  }[];
                }
              ];
            }
          ];
        },
        NamedMapValue,
        NamedMapValue,
        {
          prim: string;
          type: string;
          name: string;
          children?: {
            prim: string;
            type: string;
            name: string;
            children: [UnnamedMapValue, UnnamedMapValue];
          }[];
        }
      ];
    };
    key_hash: string;
    key_string: string;
    level: number;
    timestamp: string;
  };
  count: number;
}[];

export type TreasuryProposalsDTO = {
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
          children: [
            {
              prim: "bytes";
              type: "bytes";
              name: "agoraPostID";
              value: string;
            },
            {
              prim: "bytes";
              type: "bytes";
              name: "transfers";
              value: string;
            }
          ];
        },
        {
          prim: "nat";
          type: "nat";
          name: "period_num";
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
          name: "proposer_fixed_fee_in_token";
          value: string;
        },
        {
          prim: "nat";
          type: "nat";
          name: "proposer_frozen_token";
          value: string;
        },
        {
          prim: "timestamp";
          type: "timestamp";
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
          children?: any;
        }
      ];
    };
    key_hash: string;
    key_string: string;
    level: number;
    timestamp: string;
  };
  count: 1;
}[];

export type ProposalsDTO = RegistryProposalsDTO | TreasuryProposalsDTO;

export interface Proposal {
  id: string;
  upVotes: number;
  downVotes: number;
  startDate: string;
  agoraPostId: string;
  proposer: string;
  proposerFrozenTokens: string;
  voters: {
    address: string;
    value: number;
  }[];
}

export interface TreasuryProposal extends Proposal {
  transfers: Transfer[];
}

export interface RegistryProposal extends Proposal {
  list: {
    key: string;
    value: string;
  }[];
}
export interface ProposalWithStatus extends Proposal {
  cycle: number;
  status: ProposalStatus;
}

export interface RegistryProposalWithStatus extends RegistryProposal {
  cycle: number;
  status: ProposalStatus;
}

export interface TreasuryProposalWithStatus extends TreasuryProposal {
  cycle: number;
  status: ProposalStatus;
}

export enum ProposalStatus {
  ACTIVE = "active",
  PASSED = "passed",
  REJECTED = "rejected",
  DROPPED = "dropped",
}

export interface XTZTransferDTO {
  prim: "Left";
  args: [
    {
      prim: "Pair";
      args: [
        { int: "500000" },
        { string: "tz1RKPcdraL3D3SQitGbvUZmBoqefepxRW1x" }
      ];
    }
  ];
}

export interface FA2TransferDTO {
  prim: "Right";
  args: [
    {
      prim: "Pair";
      args: [
        { string: "KT1LjU6xSBRdH7Rwh1aJFWHxGqrpdejZTYJa" },
        [
          {
            prim: "Pair";
            args: [
              { string: "KT1R8AZn5KG7mkbnJ5bzMuUw2isL8tMYkDVD" },
              [
                {
                  prim: "Pair";
                  args: [
                    { string: "tz1RKPcdraL3D3SQitGbvUZmBoqefepxRW1x" },
                    { prim: "Pair"; args: [{ int: "0" }, { int: "5" }] }
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

export interface Transfer {
  amount: string
  beneficiary: string
  type: "XTZ" | "FA2"
}

export interface FA2Transfer extends Transfer {
  contractAddress: string;
  tokenId: string
}
