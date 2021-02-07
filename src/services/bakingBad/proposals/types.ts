import { UnnamedMapValue, NamedMapValue } from "../types";

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
              prim: string;
              type: string;
              name: string;
            }
          ];
        },
        NamedMapValue,
        NamedMapValue,
        { prim: string; type: string; name: string }
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
  proposerFrozenTokens: string;
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
