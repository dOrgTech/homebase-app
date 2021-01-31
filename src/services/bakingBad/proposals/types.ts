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
            {
              prim: string;
              type: string;
              name: string;
              value: string;
            },
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
}[]

export interface Proposal {
  id: string;
  upVotes: string;
  downVotes: string;
  startDate: string;
  agoraPostId: string;
  proposer: string;
  proposerFrozenTokens: string;
}