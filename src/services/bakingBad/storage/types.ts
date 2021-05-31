export interface LastPeriodChange {
  timestamp: string;
  periodNumber: number;
}

export interface Storage {
  admin: string;
  extraMapNumber: number;
  freezeHistoryMapNumber: number;
  frozenTokenId: number;
  governanceToken: {
    address: string;
    tokenId: number;
  };
  guardian: string;
  ledgerMapNumber: number;
  proposalsToFlush: string[];
  proposalsMapNumber: number;
  quorumThresholdAtCycle: {
    lastUpdatedCycle: number;
    quorumThreshold: string;
    staked: string;
  };
  start_time: string;
  totalSupply: {
    0: string;
  };
  fixedProposalFeeInToken: string;
  governanceTotalSupply: string;
  maxProposals: number;
  maxQuorumChange: string;
  maxQuorumThreshold: string;
  maxVotes: string;
  minQuorumThreshold: string;
  votingPeriod: number;
  proposalExpiredTime: number;
  proposalFlushTime: number;
  quorumChange: string;
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
      prim: "address";
      type: "address";
      name: "guardian";
      value: string;
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
      children?: {
        prim: "pair";
        type: "namedtuple";
        name: "@pair_50";
        children: [
          {
            prim: "timestamp";
            type: "timestamp";
            name: "@timestamp_51";
            value: string;
          },
          {
            prim: "bytes";
            type: "bytes";
            name: "@bytes_52";
            value: string;
          }
        ];
      }[];
    },
    {
      prim: "big_map";
      type: "big_map";
      name: "proposals";
      value: number;
    },
    {
      prim: "pair";
      type: "namedtuple";
      name: "quorum_threshold_at_cycle";
      children: [
        {
          prim: "nat";
          type: "nat";
          name: "last_updated_cycle";
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
          name: "staked";
          value: string;
        }
      ];
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
      name: "fixed_proposal_fee_in_token";
      value: string;
    },
    {
      prim: "nat";
      type: "nat";
      name: "governance_total_supply";
      value: string;
    },
    {
      prim: "nat";
      type: "nat";
      name: "max_proposals";
      value: string;
    },
    {
      prim: "int";
      type: "int";
      name: "max_quorum_change";
      value: string;
    },
    {
      prim: "int";
      type: "int";
      name: "max_quorum_threshold";
      value: string;
    },
    {
      prim: "nat";
      type: "nat";
      name: "max_votes";
      value: string;
    },
    {
      prim: "int";
      type: "int";
      name: "min_quorum_threshold";
      value: string;
    },
    {
      prim: "nat";
      type: "nat";
      name: "period";
      value: string;
    },
    {
      prim: "lambda";
      type: "lambda";
      name: "proposal_check";
      value: string;
    },
    {
      prim: "nat";
      type: "nat";
      name: "proposal_expired_time";
      value: string;
    },
    {
      prim: "nat";
      type: "nat";
      name: "proposal_flush_time";
      value: string;
    },
    {
      prim: "int";
      type: "int";
      name: "quorum_change";
      value: string;
    },
    {
      prim: "lambda";
      type: "lambda";
      name: "rejected_proposal_return_value";
      value: string;
    }
  ];
}
