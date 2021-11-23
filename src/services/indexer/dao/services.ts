import { client } from "../graphql";
import {
  DAOListItem,
  DAOXTZTransferDTO,
  FetchedDAO,
  FetchedProposal,
  FetchedProposals,
} from "../types";
import {
  GET_DAOS_QUERY,
  GET_DAO_QUERY,
  GET_PROPOSALS_QUERY,
  GET_PROPOSAL_QUERY,
  GET_XTZ_TRANSFERS,
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

interface GetXTZTransfersDTO {
  transfer: [DAOXTZTransferDTO];
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

export const getXTZTransfers = async (address: string) => {
  return await client.request<GetXTZTransfersDTO>(GET_XTZ_TRANSFERS, {
    address,
  });
};
