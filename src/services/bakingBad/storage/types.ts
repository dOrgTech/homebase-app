export interface LastPeriodChange {
  timestamp: string;
  periodNumber: number;
}

export interface Storage {
  maxProposals: number;
  maxVotes: number;
  votingPeriod: number;
  quorumTreshold: number;
  proposalsMapNumber: number;
  ledgerMapNumber: number;
  proposalsToFlush: any;
  totalSupply: Record<number, number>;
  lastPeriodChange: LastPeriodChange;
  fixedProposalFeeInToken: number;
  admin: string;
  freezeHistory: number,
  frozenTokenId: number,
  extraMapNumber: number,
  governanceToken: {
    address: string,
    tokenId: number
  }
}

export interface StorageDTO {
  prim: "pair";
  type: "namedtuple";
  name: "@pair_1";
  children: [
    {
      prim: "address";
      type: "address";
      name: "admin";
      value: string;
    },
    {
      prim: "big_map";
      type: "big_map";
      name: "extra";
      value: number;
    },
    {
      prim: "nat";
      type: "nat";
      name: "fixed_proposal_fee_in_token";
      value: string;
    },
    {
      prim: "big_map";
      type: "big_map";
      name: "freeze_history";
      value: number;
    },
    {
      prim: "nat";
      type: "nat";
      name: "frozen_token_id";
      value: string;
    },
    {
      prim: "pair";
      type: "namedtuple";
      name: "governance_token";
      children: [
        {
          prim: "address";
          type: "address";
          name: "address";
          value: string;
        },
        {
          prim: "nat";
          type: "nat";
          name: "token_id";
          value: string;
        }
      ];
    },
    {
      prim: "big_map";
      type: "big_map";
      name: "ledger";
      value: number;
    },
    {
      prim: "big_map";
      type: "big_map";
      name: "metadata";
      value: number;
    },
    {
      prim: "big_map";
      type: "big_map";
      name: "operators";
      value: number;
    },
    {
      prim: "address";
      type: "address";
      name: "pending_owner";
      value: string;
    },
    {
      prim: "nat";
      type: "nat";
      name: "permits_counter";
      value: string;
    },
    {
      prim: "set";
      type: "set";
      name: "proposal_key_list_sort_by_date";
      value: string[]
    },
    {
      prim: "big_map";
      type: "big_map";
      name: "proposals";
      value: number;
    },
    {
      prim: "timestamp";
      type: "timestamp";
      name: "start_time";
      value: string;
    },
    {
      prim: "map";
      type: "map";
      name: "total_supply";
      children: [
        {
          prim: "nat";
          type: "nat";
          name: "0";
          value: string;
        }
      ];
    },
    {
      prim: "big_map";
      type: "big_map";
      name: "custom_entrypoints";
      value: number;
    },
    {
      prim: "lambda";
      type: "lambda";
      name: "decision_lambda";
      value: string;
    },
    {
      prim: "nat";
      type: "nat";
      name: "max_proposals";
      value: string;
    },
    {
      prim: "nat";
      type: "nat";
      name: "max_votes";
      value: string;
    },
    {
      prim: "lambda";
      type: "lambda";
      name: "proposal_check";
      value: string;
    },
    {
      prim: "pair";
      type: "namedtuple";
      name: "quorum_threshold";
      children: [
        {
          prim: "nat";
          type: "nat";
          name: "numerator";
          value: string;
        },
        {
          prim: "nat";
          type: "nat";
          name: "denominator";
          value: string;
        }
      ];
    },
    {
      prim: "lambda";
      type: "lambda";
      name: "rejected_proposal_return_value";
      value: string;
    },
    {
      prim: "nat";
      type: "nat";
      name: "voting_period";
      value: string;
    }
  ];
}
