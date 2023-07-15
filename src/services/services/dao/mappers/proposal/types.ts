import BigNumber from "bignumber.js"
import dayjs from "dayjs"
import lambdaProposeCode from "services/contracts/baseDAO/lambdaDAO/michelson/proposelambda"
import { Schema } from "@taquito/michelson-encoder"
import { Parser, Expr, unpackDataBytes, MichelsonType, MichelsonData } from "@taquito/michel-codec"
import { parseUnits } from "services/contracts/utils"
import { ProposalDTO } from "services/services/types"
import { extractTransfersData } from "."
import { bytes2Char } from "@taquito/tzip16"
import { BaseDAO } from "services/contracts/baseDAO"
import { DAOTemplate } from "modules/creator/state"
import transfer_arg_type_michelson from "../../../../contracts/baseDAO/lambdaDAO/michelson/supported_lambda_types/transfer_proposal_type.json"
import transfer_proposal_type_before_fa12 from "../../../../contracts/baseDAO/lambdaDAO/michelson/supported_lambda_types/transfer_proposal_type_before_fa1.2.json"
import update_contract_delegate_type_michelson from "../../../../contracts/baseDAO/lambdaDAO/michelson/supported_lambda_types/update_contract_delegate_proposal.json"
import update_guardian_type_michelson from "../../../../contracts/baseDAO/lambdaDAO/michelson/supported_lambda_types/update_guardian_proposal.json"
import configuration_proposal_type_michelson from "../../../../contracts/baseDAO/lambdaDAO/michelson/supported_lambda_types/configuration_proposal_type.json"
import { PMLambdaProposal } from "services/contracts/baseDAO/lambdaDAO/types"
import { HUMANITEZ_DAO } from "services/config"

export enum IndexerStatus {
  CREATED = "created",
  DROPPED = "dropped",
  EXECUTED = "executed",
  REJECTED_AND_FLUSHED = "rejected_and_flushed"
}

export enum ProposalStatus {
  PENDING = "pending",
  ACTIVE = "active",
  PASSED = "passed",
  REJECTED = "rejected",
  NO_QUORUM = "no quorum",
  EXECUTABLE = "executable",
  DROPPED = "dropped",
  EXPIRED = "expired",
  EXECUTED = "executed"
}

export interface Transfer {
  amount: BigNumber
  beneficiary: string
  type: "XTZ" | "FA2" | "FA1.2"
}

export interface FA2Transfer extends Transfer {
  contractAddress: string
  tokenId: string
}

interface BaseProposalMetadata {
  config: { key: "frozen_extra_value" | "slash_scale_value"; value: any }[]
  update_guardian: string
  update_contract_delegate: string
  agoraPostId: string
}

const baseProposalMetadata: BaseProposalMetadata = {
  config: [],
  update_guardian: "",
  update_contract_delegate: "",
  agoraPostId: "-1"
}

function getBaseMetadata(proposalMetadataDTO: PMLambdaProposal): BaseProposalMetadata {
  const values = { ...baseProposalMetadata }

  if ("execute_handler" in proposalMetadataDTO && proposalMetadataDTO.execute_handler.packed_argument) {
    const parser = new Parser()
    const unpacked_argument = unpackDataBytes(
      { bytes: proposalMetadataDTO.execute_handler.packed_argument },
      parser.parseMichelineExpression(proposalMetadataDTO.execute_handler.packed_argument) as MichelsonType
    )

    if (proposalMetadataDTO.execute_handler.handler_name === "update_contract_delegate_proposal") {
      const update_contract_delegate_schema = new Schema(update_contract_delegate_type_michelson as MichelsonData)
      const update_contract_delegate_data: { Some: string } = update_contract_delegate_schema.Execute(unpacked_argument)
      values.update_contract_delegate = update_contract_delegate_data.Some
    }
    if (proposalMetadataDTO.execute_handler.handler_name === "update_guardian_proposal") {
      const update_guardian_schema = new Schema(update_guardian_type_michelson as MichelsonData)
      const update_guardian_data = update_guardian_schema.Execute(unpacked_argument)
      values.update_guardian = update_guardian_data
    }
    if (proposalMetadataDTO.execute_handler.handler_name === "configuration_proposal") {
      const configuration_proposal_schema = new Schema(configuration_proposal_type_michelson as MichelsonData)
      const configuration_proposal_data = configuration_proposal_schema.Execute(unpacked_argument)
      values.config = Object.entries(configuration_proposal_data)
        .filter(([_, value]) => !!value)
        .map(([key, value]: [key: any, value: any]) => ({
          key: key as BaseProposalMetadata["config"][number]["key"],
          value: value.Some
        }))
    }
  }

  return values
}

const INDEXER_TO_PROPOSAL_STATUS_MAP: Record<IndexerStatus, ProposalStatus> = {
  created: ProposalStatus.PENDING,
  rejected_and_flushed: ProposalStatus.DROPPED,
  dropped: ProposalStatus.DROPPED,
  executed: ProposalStatus.EXECUTED
}

export abstract class Proposal {
  id: string
  dao: BaseDAO
  upVotes: BigNumber
  downVotes: BigNumber
  startLevel: number
  votingPeriodNum: number
  startDate: string
  quorumThreshold: BigNumber
  proposer: string
  period: number
  proposerFrozenTokens: string
  indexer_status_history: {
    timestamp: string
    description: IndexerStatus
    level: number
  }[]
  packedMetadata: string
  voters: {
    address: string
    value: BigNumber
    support: boolean
    staked: boolean
  }[]
  type: DAOTemplate

  private cachedStatus:
    | {
        level: number
        status: ProposalStatus
        statusHistory: {
          status: ProposalStatus
          timestamp: string
          level: number
        }[]
      }
    | undefined

  constructor(dto: ProposalDTO, dao: BaseDAO) {
    this.type = dao.data.type
    this.id = dto.key
    this.dao = dao
    this.votingPeriodNum = Number(dto.voting_stage_num)
    this.voters = dto.votes.map(vote => ({
      address: vote.holder.address,
      value: parseUnits(new BigNumber(vote.amount), this.dao.data.token.decimals),
      support: Boolean(vote.support),
      staked: vote.staked
    }))
    this.upVotes = this.voters.reduce((acc, voter) => {
      if (voter.support) {
        return BigNumber.sum(acc, voter.value)
      }

      return acc
    }, new BigNumber(0))
    this.downVotes = this.voters.reduce((acc, voter) => {
      if (!voter.support) {
        return BigNumber.sum(acc, voter.value)
      }

      return acc
    }, new BigNumber(0))
    this.proposer = dto.holder.address
    this.startDate = dto.start_date
    this.startLevel = dto.start_level
    this.quorumThreshold = parseUnits(new BigNumber(dto.quorum_threshold), dao.data.token.decimals)
    this.period = Number(dto.voting_stage_num) - 1
    this.indexer_status_history = dto.status_updates.map(update => ({
      timestamp: `Block ${update.level} (${dayjs(update.timestamp).format("LLL")})`,
      level: update.level,
      description: update.proposal_status.description
    }))
    this.proposerFrozenTokens = dto.proposer_frozen_token
    this.packedMetadata = dto.metadata
  }

  abstract get metadata(): BaseProposalMetadata

  public getStatus(currentLevel: number) {
    if (!this.cachedStatus || currentLevel !== this.cachedStatus.level) {
      const activeThreshold = this.votingPeriodNum * Number(this.dao.data.period) + this.dao.data.start_level

      const passedOrRejectedThreshold = activeThreshold + Number(this.dao.data.period)

      const flushThreshold = this.startLevel + Number(this.dao.data.proposal_flush_level)
      const expiredThreshold = this.startLevel + Number(this.dao.data.proposal_expired_level)

      const statusHistory: {
        status: ProposalStatus
        timestamp: string
        level: number
      }[] = this.indexer_status_history.map(update => ({
        timestamp: update.timestamp,
        status: INDEXER_TO_PROPOSAL_STATUS_MAP[update.description],
        level: update.level
      }))

      if (currentLevel >= activeThreshold) {
        statusHistory.push({
          status: ProposalStatus.ACTIVE,
          timestamp: `Level ${activeThreshold}`,
          level: activeThreshold
        })
      }

      if (currentLevel >= passedOrRejectedThreshold) {
        if (this.downVotes.isGreaterThanOrEqualTo(this.quorumThreshold)) {
          statusHistory.push({
            status: ProposalStatus.REJECTED,
            timestamp: `Level ${passedOrRejectedThreshold}`,
            level: passedOrRejectedThreshold
          })
        } else if (this.upVotes.isGreaterThanOrEqualTo(this.quorumThreshold)) {
          statusHistory.push({
            status: ProposalStatus.PASSED,
            timestamp: `Level ${passedOrRejectedThreshold}`,
            level: passedOrRejectedThreshold
          })
        } else {
          statusHistory.push({
            status: ProposalStatus.NO_QUORUM,
            timestamp: `Level ${passedOrRejectedThreshold}`,
            level: passedOrRejectedThreshold
          })
        }
      }

      if (currentLevel >= flushThreshold && statusHistory.some(s => s.status === ProposalStatus.PASSED)) {
        statusHistory.push({
          status: ProposalStatus.EXECUTABLE,
          timestamp: `Level ${this.startLevel + this.dao.data.proposal_flush_level}`,
          level: flushThreshold
        })
      }

      if (currentLevel >= expiredThreshold) {
        statusHistory.push({
          status: ProposalStatus.EXPIRED,
          timestamp: `Level ${this.startLevel + this.dao.data.proposal_expired_level}`,
          level: expiredThreshold
        })
      }

      const orderedStatusHistory = statusHistory.sort((a, b) => a.level - b.level)

      const finalStatuses = [ProposalStatus.DROPPED, ProposalStatus.EXECUTED]
      const finalStatusIndex = statusHistory.findIndex(a => finalStatuses.includes(a.status))
      const filteredStatusHistory =
        finalStatusIndex > -1 ? orderedStatusHistory.splice(0, finalStatusIndex + 1) : orderedStatusHistory

      this.cachedStatus = {
        status: filteredStatusHistory.slice(-1)[0].status,
        statusHistory: filteredStatusHistory,
        level: currentLevel
      }
    }

    return this.cachedStatus
  }
}

interface LambdaProposalMetadata extends BaseProposalMetadata {
  lambdaType: "add_handler" | "remove_handler" | "execute_handler" | ""
  lambdaHandler: any
  transfers: Transfer[]
  list: {
    key: string
    value: string
  }[]
}

export class LambdaProposal extends Proposal {
  private cachedMetadata: LambdaProposalMetadata | null = null

  get metadata(): LambdaProposalMetadata {
    let lambdaMetadata: LambdaProposalMetadata = {
      lambdaType: "",
      lambdaHandler: {},
      config: [],
      transfers: [],
      update_contract_delegate: "",
      update_guardian: "",
      agoraPostId: "",
      list: []
    }

    if (this.cachedMetadata !== null) {
      return this.cachedMetadata
    }

    const parser = new Parser()
    const typ = parser.parseMichelineExpression(lambdaProposeCode) as Expr
    const schema = new Schema(typ)

    const unpackedMetadata = unpackDataBytes({ bytes: this.packedMetadata }, typ as MichelsonType)
    const proposalMetadataDTO: PMLambdaProposal = schema.Execute(unpackedMetadata)
    const baseMetadata: BaseProposalMetadata = getBaseMetadata(proposalMetadataDTO)
    lambdaMetadata = {
      ...baseMetadata,
      lambdaType: "",
      lambdaHandler: {},
      list: [],
      transfers: []
    }

    if ("add_handler" in proposalMetadataDTO) {
      lambdaMetadata.lambdaType = "add_handler"
      lambdaMetadata.lambdaHandler = proposalMetadataDTO.add_handler
    }

    if ("remove_handler" in proposalMetadataDTO) {
      lambdaMetadata.lambdaType = "remove_handler"
      lambdaMetadata.lambdaHandler = proposalMetadataDTO.remove_handler
    }

    if ("execute_handler" in proposalMetadataDTO) {
      lambdaMetadata.lambdaType = "execute_handler"
      lambdaMetadata.lambdaHandler = proposalMetadataDTO.execute_handler
      try {
        lambdaMetadata.lambdaHandler.unpacked_argument = unpackDataBytes(
          { bytes: lambdaMetadata.lambdaHandler.packed_argument },
          parser.parseMichelineExpression(lambdaMetadata.lambdaHandler?.packed_argument) as MichelsonType
        )

        if (lambdaMetadata.lambdaHandler.handler_name === "transfer_proposal") {
          const transfer_michelson =
            this.dao.data.address === HUMANITEZ_DAO ? transfer_proposal_type_before_fa12 : transfer_arg_type_michelson
          const transfer_arg_schema = new Schema(transfer_michelson as MichelsonData)
          const transfer_proposal_data = transfer_arg_schema.Execute(lambdaMetadata.lambdaHandler.unpacked_argument)

          const { agora_post_id, registry_diff, transfers } = transfer_proposal_data
          lambdaMetadata.agoraPostId = agora_post_id

          if (transfers) {
            lambdaMetadata.transfers = extractTransfersData(transfers)
          }

          if (registry_diff) {
            lambdaMetadata.list = registry_diff.map((item: any) => ({
              key: bytes2Char(item[0]),
              value: bytes2Char(item[1])
            }))
          }
        }
      } catch (error) {
        lambdaMetadata.lambdaHandler.unpacked_argument = {}
      } finally {
        delete lambdaMetadata.lambdaHandler.packed_argument
      }
    }

    this.cachedMetadata = { ...lambdaMetadata }
    return this.cachedMetadata
  }
}
