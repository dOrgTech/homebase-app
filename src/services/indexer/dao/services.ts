import { client } from "../graphql";
import {
  DAOListItem,
  FetchedDAO,
  FetchedProposal,
  FetchedProposals,
} from "../types";
import {
  GET_DAOS_QUERY,
  GET_DAO_QUERY,
  GET_PROPOSALS_QUERY,
  GET_PROPOSAL_QUERY,
} from "./queries";

interface GetDAODTO {
  daos: [FetchedDAO];
}

interface GetAllDAOsDTO {
  daos: DAOListItem[];
}

interface GetProposalsDTO {
  daos: [FetchedProposals];
}

interface GetProposalDTO {
  daos: [FetchedProposal];
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

export const getProposals = async (address: string) => {
  return await client.request<GetProposalsDTO>(GET_PROPOSALS_QUERY, {
    address,
  });
};

export const getProposal = async (address: string, proposalKey: string) => {
  return await client.request<GetProposalDTO>(GET_PROPOSAL_QUERY, {
    address,
    proposalKey,
  });
};
