import { useQuery } from "react-query";
import { Network } from "services/beacon/context";
import { client } from "services/indexer/graphql";
import { DAOListItem } from "services/indexer/types";
import { GET_DAOS_QUERY } from "../queries";

interface GetAllDAOsDTO {
    daos: DAOListItem[];
  }

export const useAllDAOs = (network: Network) => {
    return useQuery(
      ["daos", network],
      async () => {
        const response = await client.request<GetAllDAOsDTO>(GET_DAOS_QUERY, {
          network,
        });
        return response.daos;
      },
      {
        enabled: !!network,
      }
    );
  };