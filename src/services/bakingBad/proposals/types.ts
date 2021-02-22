import { UnnamedMapValue, NamedMapValue } from "services/bakingBad/types";

type TokenType = "mutez";

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

export type ProposalsDTO = {
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

export interface Proposal {
  id: string;
  upVotes: number;
  downVotes: number;
  startDate: string;
  agoraPostId: string;
  proposer: string;
  transfers: {
    beneficiary: string;
    amount: string;
    currency: string;
  }[];
  proposerFrozenTokens: string;
  voters: {
    address: string;
    value: number;
  }[];
}

export enum ProposalStatus {
  ACTIVE = "active",
  PASSED = "passed",
  REJECTED = "rejected",
  DROPPED = "dropped",
}

export type ProposalWithStatus = Proposal & {
  cycle: number;
  status: ProposalStatus;
};
