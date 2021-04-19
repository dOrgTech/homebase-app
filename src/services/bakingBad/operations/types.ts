import { MutezTransfer } from "../proposals/types";

type EntryPoint = "vote" | "origination" | "propose";

type VoteParameters = {
  prim: string;
  type: string;
  name: "vote";
  children: [
    {
      prim: "pair";
      type: "namedtuple";
      children: [
        {
          prim: "bytes";
          type: "bytes";
          name: "proposal_key";
          value: string;
        },
        {
          prim: "bool";
          type: "bool";
          name: "vote_type";
          value: boolean;
        },
        {
          prim: "nat";
          type: "nat";
          name: "vote_amount";
          value: string;
        },
        {
          name: "permit";
        }
      ];
    }
  ];
};

type ProposeParameters = {
  prim: "pair";
  type: "namedtuple";
  children: [
    {
      prim: "nat";
      type: "nat";
      name: "frozen_token";
      value: string;
    },
    {
      prim: "pair";
      type: "namedtuple";
      name: "proposal_metadata";
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
          name: "transfers";
          children?: MutezTransfer[];
        }
      ];
    }
  ];
};

export type OperationDTO<
  TEntrypoint extends EntryPoint | undefined = undefined
> = {
  level: number;
  fee: number;
  counter: number;
  gas_limit: number;
  storage_limit: number;
  burned: number;
  content_index: number;
  result: {
    consumed_gas: number;
    storage_size: number;
    paid_storage_size_diff: number;
  };
  parameters: TEntrypoint extends "vote"
    ? VoteParameters
    : TEntrypoint extends "propose"
    ? ProposeParameters
    : any;
  timestamp: string;
  id: string;
  protocol: string;
  hash: string;
  network: string;
  kind: string;
  source: string;
  destination: string;
  status: string;
  entrypoint: EntryPoint;
  internal: boolean;
  mempool: boolean;
};

export type OperationsDTO = {
  operations: OperationDTO[];
};
