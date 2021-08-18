import { client } from "../graphql";
import { DAOListItem, FetchedDAO } from "../types";
import { GET_DAOS_QUERY, GET_DAO_QUERY } from "./queries";

interface GetDAODTO {
  daos: [FetchedDAO];
}

interface GetAllDAOsDTO {
  daos: DAOListItem[];
}

export const getDAO = async (address: string) => {
  return await client.request<GetDAODTO>(GET_DAO_QUERY, {
    address,
  });
};

export const getDAOs = async (network: string) => {
  const response = await client.request<GetAllDAOsDTO>(GET_DAOS_QUERY, {
    network,
  });

  return response.daos;
};
