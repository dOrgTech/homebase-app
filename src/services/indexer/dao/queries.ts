import { gql } from "graphql-request";

export const GET_DAOS_QUERY = gql`
  query getDaos($network: String!) {
    daos(where: { network: { _eq: $network } }) {
      dao_type {
        name
      }
      description
      address
      frozen_token_id
      governance_token_id
      ledgers {
        holder {
          address
        }
      }
      name
      network
      period
      staked
      start_time
      token {
        contract
        decimals
        is_transferable
        level
        name
        network
        should_prefer_symbol
        supply
        symbol
        timestamp
        token_id
      }
    }
  }
`;

export const GET_DAO_QUERY = gql`
  query getDao($address: String!) {
      daos(where: {address: {_eq: $address}}) {
        dao_type {
          id
          name
        }
        description
        address
        frozen_token_id
        governance_token_id
        guardian
        id
        last_updated_cycle
        ledgers {
          id
          holder {
            id
            address
          }
          balance
        }
        max_proposals
        max_quorum_change
        max_quorum_threshold
        max_votes
        min_quorum_threshold
        name
        network
        period
        proposal_expired_time
        proposal_flush_time
        quorum_change
        quorum_threshold
        staked
        start_time
        registry_extras {
          id
          frozen_extra_value
          frozen_scale_value
          max_xtz_amount
          min_xtz_amount
          registry
          registry_affected
          slash_division_value
          slash_scale_value
        }
        token {
          id
          contract
          decimals
          is_transferable
          level
          name
          network
          should_prefer_symbol
          supply
          symbol
          timestamp
          token_id
        }
        treasury_extras {
          id
          frozen_extra_value
          frozen_scale_value
          id
          max_xtz_amount
          min_xtz_amount
          slash_division_value
          slash_scale_value
        }
        proposals {
          downvotes
          hash
          id
          key
          metadata
          proposer_frozen_token
          proposer_id
          quorum_threshold
          start_date
          upvotes
          voting_stage_num
          holder {
            address
            id
          }
          status_updates(order_by: {timestamp: asc}) {
            timestamp
            id
            proposal_status {
              id
              description
            }
          }
          votes {
            amount
            hash
            holder {
              address
              id
            }
            id
            key
            support
          }
        }
      }
  }
`;
