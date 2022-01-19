import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import treasuryProposeCode from "services/contracts/baseDAO/treasuryDAO/michelson/propose";
import registryProposeCode from "services/contracts/baseDAO/registryDAO/michelson/propose";
import {Schema} from "@taquito/michelson-encoder";
import {Parser, Expr, unpackDataBytes} from "@taquito/michel-codec";
import {parseUnits} from "services/contracts/utils";
import {ProposalDTO} from "services/indexer/types";
import {
  PMRegistryProposal,
  PMTreasuryProposal,
} from "services/contracts/baseDAO/registryDAO/types";
import {extractTransfersData} from ".";
import {bytes2Char} from "@taquito/tzip16";
import {BaseDAO} from "services/contracts/baseDAO";
import {DAOTemplate} from "modules/creator/state";

export enum IndexerStatus {
  CREATED = "created",
  DROPPED = "dropped",
  EXECUTED = "executed",
  REJECTED_AND_FLUSHED = "rejected_and_flushed",
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
  EXECUTED = "executed",
}

const INDEXER_TO_PROPOSAL_STATUS_MAP: Record<IndexerStatus, ProposalStatus> = {
  created: ProposalStatus.PENDING,
  rejected_and_flushed: ProposalStatus.DROPPED,
  dropped: ProposalStatus.DROPPED,
  executed: ProposalStatus.EXECUTED,
};

export abstract class Proposal {
  id: string;
  dao: BaseDAO;
  upVotes: BigNumber;
  downVotes: BigNumber;
  startLevel: number;
  startDate: string;
  quorumThreshold: BigNumber;
  proposer: string;
  period: number;
  proposerFrozenTokens: string;
  indexer_status_history: {
    timestamp: string;
    description: IndexerStatus;
    level: number;
  }[];
  packedMetadata: string;
  voters: {
    address: string;
    value: BigNumber;
    support: boolean;
  }[];
  type: DAOTemplate

  private cachedStatus:
    | {
    level: number;
    status: ProposalStatus;
    statusHistory: {
      status: ProposalStatus;
      timestamp: string;
      level: number;
    }[];
  }
    | undefined;

  constructor(dto: ProposalDTO, dao: BaseDAO) {
    this.type = dao.data.type;
    this.id = dto.key;
    this.dao = dao;
    this.voters = dto.votes.map((vote) => ({
      address: vote.holder.address,
      value: parseUnits(
        new BigNumber(vote.amount),
        this.dao.data.token.decimals
      ),
      support: Boolean(vote.support),
    }));
    this.upVotes = this.voters.reduce((acc, voter) => {
      if (voter.support) {
        return BigNumber.sum(acc, voter.value)
      }

      return acc;
    }, new BigNumber(0));
    this.downVotes = this.voters.reduce((acc, voter) => {
      if (!voter.support) {
        return BigNumber.sum(acc, voter.value)
      }

      return acc;
    }, new BigNumber(0));
    this.proposer = dto.holder.address;
    this.startDate = dto.start_date;
    this.startLevel = dto.start_level;
    this.quorumThreshold = parseUnits(
      new BigNumber(dto.quorum_threshold),
      dao.data.token.decimals
    );
    this.period = Number(dto.voting_stage_num) - 1;
    this.indexer_status_history = dto.status_updates.map((update) => ({
      timestamp: `Block ${update.level} (${dayjs(update.timestamp).format(
        "LLL"
      )})`,
      level: update.level,
      description: update.proposal_status.description,
    }));
    this.proposerFrozenTokens = dto.proposer_frozen_token;
    this.packedMetadata = dto.metadata;
  }

  abstract get metadata(): { agoraPostId: string };

  public getStatus(currentLevel: number) {
    if (!this.cachedStatus || currentLevel !== this.cachedStatus.level) {
      const activeThreshold =
        Math.floor(
          (this.startLevel + Number(this.dao.data.period)) /
          Number(this.dao.data.period)
        ) * Number(this.dao.data.period);

      const passedOrRejectedThreshold =
        activeThreshold + Number(this.dao.data.period);

      const flushThreshold =
        this.startLevel + Number(this.dao.data.proposal_flush_level);
      const expiredThreshold =
        this.startLevel + Number(this.dao.data.proposal_expired_level);

      const statusHistory: {
        status: ProposalStatus;
        timestamp: string;
        level: number;
      }[] = this.indexer_status_history.map((update) => ({
        timestamp: update.timestamp,
        status: INDEXER_TO_PROPOSAL_STATUS_MAP[update.description],
        level: update.level,
      }));

      if (currentLevel >= activeThreshold) {
        statusHistory.push({
          status: ProposalStatus.ACTIVE,
          timestamp: `Level ${activeThreshold}`,
          level: activeThreshold,
        });
      }

      if (currentLevel >= passedOrRejectedThreshold) {
        if (
          this.downVotes.isGreaterThanOrEqualTo(this.quorumThreshold)
        ) {
          statusHistory.push({
            status: ProposalStatus.REJECTED,
            timestamp: `Level ${passedOrRejectedThreshold}`,
            level: passedOrRejectedThreshold,
          });
        } else if (this.upVotes.isGreaterThanOrEqualTo(this.quorumThreshold)) {
          statusHistory.push({
            status: ProposalStatus.PASSED,
            timestamp: `Level ${passedOrRejectedThreshold}`,
            level: passedOrRejectedThreshold,
          });
        } else {
          statusHistory.push({
            status: ProposalStatus.NO_QUORUM,
            timestamp: `Level ${passedOrRejectedThreshold}`,
            level: passedOrRejectedThreshold,
          });
        }
      }

      if (
        currentLevel >= flushThreshold &&
        statusHistory.some((s) => s.status === ProposalStatus.PASSED)
      ) {
        statusHistory.push({
          status: ProposalStatus.EXECUTABLE,
          timestamp: `Level ${
            this.startLevel + this.dao.data.proposal_flush_level
          }`,
          level: flushThreshold,
        });
      }

      if (currentLevel >= expiredThreshold) {
        statusHistory.push({
          status: ProposalStatus.EXPIRED,
          timestamp: `Level ${
            this.startLevel + this.dao.data.proposal_expired_level
          }`,
          level: expiredThreshold,
        });
      }

      const orderedStatusHistory = statusHistory.sort(
        (a, b) => a.level - b.level
      );

      const finalStatuses = [ProposalStatus.DROPPED, ProposalStatus.EXECUTED];
      const finalStatusIndex = statusHistory.findIndex((a) =>
        finalStatuses.includes(a.status)
      );
      const filteredStatusHistory =
        finalStatusIndex > -1
          ? orderedStatusHistory.splice(0, finalStatusIndex + 1)
          : orderedStatusHistory;

      this.cachedStatus = {
        status: filteredStatusHistory.slice(-1)[0].status,
        statusHistory: filteredStatusHistory,
        level: currentLevel,
      };
    }

    return this.cachedStatus;
  }
}

interface TreasuryProposalMetadata {
  config: {
    frozen_extra_value?: BigNumber;
    frozen_scale_value?: BigNumber;
    max_proposal_size?: BigNumber;
    slash_division_value?: BigNumber;
    slash_scale_value?: BigNumber;
  }
  transfers: Transfer[];
  agoraPostId: string;
}

export class TreasuryProposal extends Proposal {
  private cachedMetadata?: TreasuryProposalMetadata;

  get metadata(): TreasuryProposalMetadata {
    if (!this.cachedMetadata) {
      const parser = new Parser();
      const micheline = parser.parseMichelineExpression(
        treasuryProposeCode
      ) as Expr;
      const schema = new Schema(micheline as Expr);

      const unpackedMetadata = unpackDataBytes(
        {bytes: this.packedMetadata},
        micheline as any
      ) as any;
      const proposalMetadataDTO: PMTreasuryProposal =
        schema.Execute(unpackedMetadata);

      const transfers = extractTransfersData(
        proposalMetadataDTO.transfer_proposal.transfers
      );

      const agoraPostId =
        proposalMetadataDTO.transfer_proposal.agora_post_id.toString();

      this.cachedMetadata = {
        config: {},
        transfers,
        agoraPostId,
      };
    }

    return this.cachedMetadata;
  }
}

interface RegistryProposalMetadata {
  config: {
    frozen_extra_value?: BigNumber;
    frozen_scale_value?: BigNumber;
    max_proposal_size?: BigNumber;
    slash_division_value?: BigNumber;
    slash_scale_value?: BigNumber;
  }
  transfers: Transfer[];
  agoraPostId: string;
  list: {
    key: string;
    value: string;
  }[];
}

export class RegistryProposal extends Proposal {
  private cachedMetadata?: RegistryProposalMetadata;

  get metadata(): RegistryProposalMetadata {
    if (!this.cachedMetadata) {
      const parser = new Parser();
      const micheline = parser.parseMichelineExpression(
        registryProposeCode
      ) as Expr;
      const schema = new Schema(micheline as Expr);

      const unpackedMetadata = unpackDataBytes(
        {bytes: this.packedMetadata},
        micheline as any
      ) as any;
      const proposalMetadataDTO: PMRegistryProposal =
        schema.Execute(unpackedMetadata);

      let transfers: Transfer[] = [];

      if (proposalMetadataDTO.transfer_proposal.transfers) {
        transfers = extractTransfersData(
          proposalMetadataDTO.transfer_proposal.transfers
        );
      }

      const agoraPostId = proposalMetadataDTO.transfer_proposal.agora_post_id;
      const registryDiff =
        proposalMetadataDTO.transfer_proposal.registry_diff.map((item) => ({
          key: bytes2Char(item[0]),
          value: bytes2Char(item[1]),
        }));

      this.cachedMetadata = {
        transfers,
        agoraPostId,
        list: registryDiff,
        config: {}
      };
    }

    return this.cachedMetadata;
  }
}

export interface Transfer {
  amount: BigNumber;
  beneficiary: string;
  type: "XTZ" | "FA2";
}

export interface FA2Transfer extends Transfer {
  contractAddress: string;
  tokenId: string;
}
