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
