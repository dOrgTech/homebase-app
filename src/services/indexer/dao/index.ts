import { DAOTemplate } from "modules/creator/state";
import { useQuery } from "react-query";
import { TokenMetadata } from "services/bakingBad/tokens";
import { Network } from "services/beacon/context";
import { client } from "../graphql";
import { GET_DAOS_QUERY } from "./queries";

export interface DAOListItem {
  dao_type: {
    name: DAOTemplate;
  };
  description: string;
  address: string;
  frozen_token_id: string;
  governance_token_id: string;
  ledgers: {
    holder: {
      address: string;
    };
  }[];
  name: string;
  network: Network;
  period: string;
  staked: string;
  start_time: string;
  token: TokenMetadata;
}

interface GetAllDAOsDTO {
  daos: DAOListItem[];
}

export const useAllDAOs = (network: Network) => {
  return useQuery(["daos", network], async () => {
    const response = await client.request<GetAllDAOsDTO>(GET_DAOS_QUERY, {
      network
    });
    console.log(response)
    return response.daos;
  }, {
    enabled: !!network
  })
};
