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
import {Proposal, RegistryProposal, TreasuryProposal} from "./mappers/proposal/types";
import dayjs from "dayjs";
import {BaseDAO} from "../../contracts/baseDAO";

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

export const getProposals = async (dao: BaseDAO) => {
  const response = await client.request<GetProposalsDTO>(GET_PROPOSALS_QUERY, {
    address: dao.data.address,
  });

  const fetched = response.daos[0];
  let proposals: Proposal[];

  switch (dao.data.type) {
    case "treasury":
      proposals = fetched.proposals.map(
        (proposal) => new TreasuryProposal(proposal, dao)
      );

      break;
    case "registry":
      proposals = fetched.proposals.map(
        (proposal) => new RegistryProposal(proposal, dao)
      );

      break;
    default:
      throw new Error(
        `DAO with address '${dao.data.address}' has an unrecognized type '${dao.data.type}'`
      );
  }

  const proposalsWithVoters = proposals.sort((a, b) =>
    dayjs(b.startDate).isAfter(dayjs(a.startDate)) ? 1 : -1
  );

  return proposalsWithVoters;
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
