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
            NamedMapValue,
            {
              prim: "list";
              type: "list";
              name: "transfers";
              children?: MutezTransfer[];
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
  transfers: {
    beneficiary: string;
    amount: string;
    currency: string;
  }[];
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
