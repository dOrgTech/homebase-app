import { client, client_v2 } from "../graphql"
import { DAOListItem, DAOXTZTransferDTO, FetchedDAO, FetchedProposal, FetchedProposals } from "../types"
import {
  GET_DAOS_QUERY,
  GET_DAOS_QUERY_V2,
  GET_DAO_QUERY,
  GET_PROPOSALS_QUERY,
  GET_PROPOSAL_QUERY,
  GET_XTZ_TRANSFERS
} from "./queries"
import { LambdaProposal, Proposal } from "./mappers/proposal/types"
import dayjs from "dayjs"
import { BaseDAO } from "../../contracts/baseDAO"

interface GetDAODTO {
  daos: [FetchedDAO]
}

interface GetAllDAOsDTO {
  daos: DAOListItem[]
}

interface GetProposalsDTO {
  daos: [FetchedProposals]
}

interface GetProposalDTO {
  daos: [FetchedProposal]
}

interface GetXTZTransfersDTO {
  transfer: [DAOXTZTransferDTO]
}

export const getDAO = async (address: string) => {
  return await client.request<GetDAODTO>(GET_DAO_QUERY, {
    address
  })
}

export const getDAOs = async (network: string) => {
  const response = await client.request<GetAllDAOsDTO>(GET_DAOS_QUERY, {
    network
  })

  const response_v2 = await client_v2.request<GetAllDAOsDTO>(GET_DAOS_QUERY_V2, {
    network
  })

  const daos = response.daos
  const daos_v2 = response_v2.daos

  return [...daos, ...daos_v2]
}

export const getProposals = async (dao: BaseDAO) => {
  const response = await client.request<GetProposalsDTO>(GET_PROPOSALS_QUERY, {
    address: dao.data.address
  })
  const fetched = response.daos[0]

  let proposals: Proposal[]
  switch (dao.data.type) {
    case "lambda":
      proposals = fetched.proposals.map(proposal => new LambdaProposal(proposal, dao))
      break
    default:
      throw new Error(`DAO with address '${dao.data.address}' has an unrecognized type '${dao.data.type}'`)
  }

  return proposals.sort((a, b) => (dayjs(b.startDate).isAfter(dayjs(a.startDate)) ? 1 : -1))
}

export const getProposal = async (address: string, proposalKey: string) => {
  return await client.request<GetProposalDTO>(GET_PROPOSAL_QUERY, {
    address,
    proposalKey
  })
}

export const getXTZTransfers = async (address: string) => {
  return await client.request<GetXTZTransfersDTO>(GET_XTZ_TRANSFERS, {
    address
  })
}
