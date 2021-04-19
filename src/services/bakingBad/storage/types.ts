export interface LastPeriodChange {
  timestamp: string;
  periodNumber: number;
}

export interface BaseStorage {
  slashDivisionValue: number;
  slashScaleValue: number;
  frozenExtraValue: number;
  maxProposalSize: number;
  votingPeriod: number;
  quorumTreshold: number;
  proposalsMapNumber: number;
  ledgerMapNumber: number;
  proposalsToFlush: any;
  totalSupply: {
    0: number;
    1: number;
  };
  lastPeriodChange: LastPeriodChange;
  fixedProposalFeeInToken: number;
  admin: string;
}

export interface TreasuryStorage extends BaseStorage {
  maxXtzAmount: string;
  minXtzAmount: string;
}

export interface RegistryStorage extends BaseStorage {
  registry: string;
  proposalReceivers: string;
  registryAffected: string;
}

export type Storage = RegistryStorage | TreasuryStorage;

export type StorageDTO = TreasuryStorageDTO | RegistryStorageDTO;

export interface RegistryStorageDTO {
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
      prim: "map";
      type: "map";
      name: "extra";
      children: [
        {
          prim: "bytes";
          type: "bytes";
          name: "frozen_extra_value";
          value: string;
        },
        {
          prim: "bytes";
          type: "bytes";
          name: "frozen_scale_value";
          value: string;
        },
        {
          prim: "bytes";
          type: "bytes";
          name: "max_proposal_size";
          value: string;
        },
        {
          prim: "bytes";
          type: "bytes";
          name: "max_xtz_amount";
          value: string;
        },
        {
          prim: "bytes";
          type: "bytes";
          name: "min_xtz_amount";
          value: string;
        },
        {
          prim: "bytes";
          type: "bytes";
          name: "proposal_receivers";
          value: string;
        },
        {
          prim: "bytes";
          type: "bytes";
          name: "registry";
          value: string;
        },
        {
          prim: "bytes";
          type: "bytes";
          name: "registry_affected";
          value: string;
        },
        {
          prim: "bytes";
          type: "bytes";
          name: "slash_division_value";
          value: string;
        },
        {
          prim: "bytes";
          type: "bytes";
          name: "slash_scale_value";
          value: string;
        }
      ];
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
      name: "last_period_change";
      children: [
        {
          prim: "timestamp";
          type: "timestamp";
          name: "changed_on";
          value: string;
        },
        {
          prim: "nat";
          type: "nat";
          name: "period_num";
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
      value?: any;
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
      prim: "address";
      type: "address";
      name: "token_address";
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
        },
        {
          prim: "nat";
          type: "nat";
          name: "1";
          value: string;
        }
      ];
    },
    {
      prim: "nat";
      type: "nat";
      name: "unfrozen_token_id";
      value: string;
    },
    {
      prim: "nat";
      type: "nat";
      name: "voting_period";
      value: string;
    },
    {
      prim: "map";
      type: "map";
      name: "custom_entrypoints";
      children: [
        {
          prim: "bytes";
          type: "bytes";
          name: "lookup_registry";
          value: string;
        },
        {
          prim: "bytes";
          type: "bytes";
          name: "receive_xtz";
          value: string;
        }
      ];
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
      prim: "pair";
      type: "namedtuple";
      name: "max_quorum_threshold";
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
      prim: "nat";
      type: "nat";
      name: "max_votes";
      value: string;
    },
    {
      prim: "nat";
      type: "nat";
      name: "max_voting_period";
      value: string;
    },
    {
      prim: "pair";
      type: "namedtuple";
      name: "min_quorum_threshold";
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
      prim: "nat";
      type: "nat";
      name: "min_voting_period";
      value: string;
    },
    {
      prim: "lambda";
      type: "lambda";
      name: "proposal_check";
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

export interface TreasuryStorageDTO {
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
      prim: "map";
      type: "map";
      name: "extra";
      children: [
        {
          prim: "bytes";
          type: "bytes";
          name: "frozen_extra_value";
          value: string;
        },
        {
          prim: "bytes";
          type: "bytes";
          name: "frozen_scale_value";
          value: string;
        },
        {
          prim: "bytes";
          type: "bytes";
          name: "max_proposal_size";
          value: string;
        },
        {
          prim: "bytes";
          type: "bytes";
          name: "max_xtz_amount";
          value: string;
        },
        {
          prim: "bytes";
          type: "bytes";
          name: "min_xtz_amount";
          value: string;
        },
        {
          prim: "bytes";
          type: "bytes";
          name: "proposal_receivers";
          value: string;
        },
        {
          prim: "bytes";
          type: "bytes";
          name: "registry";
          value: string;
        },
        {
          prim: "bytes";
          type: "bytes";
          name: "registry_affected";
          value: string;
        },
        {
          prim: "bytes";
          type: "bytes";
          name: "slash_division_value";
          value: string;
        },
        {
          prim: "bytes";
          type: "bytes";
          name: "slash_scale_value";
          value: string;
        }
      ];
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
      name: "last_period_change";
      children: [
        {
          prim: "timestamp";
          type: "timestamp";
          name: "changed_on";
          value: string;
        },
        {
          prim: "nat";
          type: "nat";
          name: "period_num";
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
      value?: string[];
    },
    {
      prim: "big_map";
      type: "big_map";
      name: "proposals";
      value: number;
    },
    {
      prim: "nat";
      type: "nat";
      name: "quorum_threshold";
      value: string;
    },
    {
      prim: "address";
      type: "address";
      name: "token_address";
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
          name: string;
          value: string;
        },
        {
          prim: "nat";
          type: "nat";
          name: string;
          value: string;
        }
      ];
    },
    {
      prim: "nat";
      type: "nat";
      name: "unfrozen_token_id";
      value: string;
    },
    {
      prim: "nat";
      type: "nat";
      name: "voting_period";
      value: string;
    },
    {
      prim: "map";
      type: "map";
      name: "custom_entrypoints";
      children: [
        {
          prim: "bytes";
          type: "bytes";
          name: "lookup_registry";
          value: string;
        },
        {
          prim: "bytes";
          type: "bytes";
          name: "receive_xtz";
          value: string;
        }
      ];
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
      prim: "nat";
      type: "nat";
      name: "max_voting_period";
      value: string;
    },
    {
      prim: "nat";
      type: "nat";
      name: "min_quorum_threshold";
      value: string;
    },
    {
      prim: "nat";
      type: "nat";
      name: "min_voting_period";
      value: string;
    },
    {
      prim: "lambda";
      type: "lambda";
      name: "proposal_check";
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
