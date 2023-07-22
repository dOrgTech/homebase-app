import { client, client_v2 } from "../graphql"
import { Community, DAOListItem, DAOXTZTransferDTO, FetchedDAO, FetchedProposal, FetchedProposals } from "../types"
import {
  GET_DAOS_QUERY,
  GET_DAOS_QUERY_V2,
  GET_DAO_QUERY,
  GET_PROPOSALS_QUERY,
  GET_PROPOSAL_QUERY,
  GET_XTZ_TRANSFERS
} from "../dao/queries"
import { LambdaProposal, Proposal } from "../dao/mappers/proposal/types"
import dayjs from "dayjs"
import { BaseDAO } from "../../contracts/baseDAO"
import axios from "axios"
import { EnvKey, getEnv } from "services/config"
import { getTokenMetadata } from "services/bakingBad/tokenBalances"
import { Network } from "services/beacon"

interface GetDAODTO {
  daos: [FetchedDAO]
}

interface GetAllLiteDAOsDTO {
  daos: Community[]
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

const REACT_APP_LITE_API_URL = getEnv(EnvKey.REACT_APP_LITE_API_URL)

export const getDAO = async (address: string) => {
  return await client.request<GetDAODTO>(GET_DAO_QUERY, {
    address
  })
}

export const getLiteDAOs = async (network: string) => {
  const response = await axios.post<Community[]>(`${REACT_APP_LITE_API_URL}/daos/`, {
    network
  })
  const daos = response.data

  const new_daos = daos.map(dao => {
    const new_dao: DAOListItem = {
      dao_type: {
        name: "lite"
      },
      description: dao.description,
      address: dao._id,
      frozen_token_id: dao.tokenID,
      governance_token_id: dao.tokenID,
      name: dao.name,
      network: dao.network,
      token: {
        id: Number(dao.tokenID),
        contract: dao.tokenAddress,
        network: network,
        token_id: Number(dao.tokenID),
        symbol: dao.symbol,
        name: dao.name,
        decimals: Number(dao.decimals),
        standard: dao.tokenType
      },
      ledgers: dao.members.map(member => {
        return {
          holder: {
            address: member
          }
        }
      })
    }
    return new_dao
  })

  return [...new_daos]
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

export const saveLiteCommunity = async (signature: string, publicKey: string | undefined, payloadBytes: string) => {
  const resp = await fetch(`${getEnv(EnvKey.REACT_APP_LITE_API_URL)}/dao/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      signature,
      publicKey,
      payloadBytes
    })
  })
  return resp
}

export const joinLiteCommunity = async (signature: string, publicKey: string | undefined, payloadBytes: string) => {
  const resp = await fetch(`${getEnv(EnvKey.REACT_APP_LITE_API_URL)}/daos/join`, {
    method: "POST",
    body: JSON.stringify({
      signature,
      publicKey,
      payloadBytes
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
  return resp
}

export const saveLiteProposal = async (signature: string, publicKey: string | undefined, payloadBytes: string) => {
  const resp = await fetch(`${getEnv(EnvKey.REACT_APP_LITE_API_URL)}/poll/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      signature,
      publicKey,
      payloadBytes
    })
  })
  return resp
}

export const voteOnLiteProposal = async (signature: string, publicKey: string | undefined, payloadBytes: string) => {
  const resp = await fetch(`${getEnv(EnvKey.REACT_APP_LITE_API_URL)}/update/choice`, {
    method: "POST",
    body: JSON.stringify({
      signature,
      publicKey,
      payloadBytes
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
  return resp
}

export const fetchLiteData = async (daoContract: string, network: Network) => {
  if (daoContract) {
    const data = await fetch(`${getEnv(EnvKey.REACT_APP_LITE_API_URL)}/daos/contracts/${daoContract.toString()}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        network
      })
    })

    const liteData: Community = await data.json()
    return liteData
  }
}
