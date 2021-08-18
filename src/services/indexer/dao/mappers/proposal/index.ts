import registryProposeCode from "services/contracts/baseDAO/registryDAO/michelson/propose";
import treasuryProposeCode from "services/contracts/baseDAO/treasuryDAO/michelson/propose";
import { Schema } from "@taquito/michelson-encoder";
import { Parser, Expr, unpackDataBytes } from "@taquito/michel-codec";
import { TokenMetadata } from "services/bakingBad/tokens";
import { ProposalDTO } from "services/indexer/types";
import {
  IndexerStatus,
  Proposal,
  ProposalStatus,
  ProposalWithStatus,
  RegistryProposal,
  Transfer,
} from "./types";
import {
  PMFA2TransferType,
  PMRegistryProposal,
  PMTreasuryProposal,
  PMXTZTransferType,
} from "services/contracts/baseDAO/registryDAO/types";
import { bytes2Char } from "@taquito/tzip16";
import { formatUnits, parseUnits, xtzToMutez } from "services/contracts/utils";
import BigNumber from "bignumber.js";
import { DAOTemplate } from "modules/creator/state";
import { BaseDAO, TransferParams } from "services/contracts/baseDAO";
import dayjs from "dayjs";

const parser = new Parser();

export const mapRegistryProposal = (
  dto: ProposalDTO,
  governanceToken: TokenMetadata
): RegistryProposal => {
  const micheline = parser.parseMichelineExpression(
    registryProposeCode
  ) as Expr;
  const schema = new Schema(micheline as Expr);

  const unpackedMetadata = unpackDataBytes(
    { bytes: dto.metadata },
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
  const registryDiff = proposalMetadataDTO.transfer_proposal.registry_diff.map(
    (item) => ({
      key: bytes2Char(item[0]),
      value: bytes2Char(item[1]),
    })
  );

  return {
    ...mapProposalBase(dto, "registry", governanceToken.decimals),
    transfers,
    list: registryDiff,
    agoraPostId,
  };
};

export const mapTreasuryProposal = (
  dto: ProposalDTO,
  governanceToken: TokenMetadata
) => {
  const micheline = parser.parseMichelineExpression(
    treasuryProposeCode
  ) as Expr;
  const schema = new Schema(micheline as Expr);

  const unpackedMetadata = unpackDataBytes(
    { bytes: dto.metadata },
    micheline as any
  ) as any;
  const proposalMetadataDTO: PMTreasuryProposal =
    schema.Execute(unpackedMetadata);

  const transfers = extractTransfersData(
    proposalMetadataDTO.transfer_proposal.transfers
  );

  return {
    ...mapProposalBase(dto, "treasury", governanceToken.decimals),
    agoraPostId: proposalMetadataDTO.transfer_proposal.agora_post_id.toString(),
    transfers,
  };
};

export const extractTransfersData = (
  transfersDTO: (PMXTZTransferType | PMFA2TransferType)[]
): Transfer[] => {
  const transfers = transfersDTO.map((transfer: any) => {
    if (transfer.hasOwnProperty("xtz_transfer_type")) {
      const xtzTransfer = transfer;

      return {
        amount: xtzTransfer.xtz_transfer_type.amount,
        beneficiary: xtzTransfer.xtz_transfer_type.recipient,
        type: "XTZ" as const,
      };
    } else {
      const fa2Transfer = transfer;

      return {
        amount: fa2Transfer.token_transfer_type.transfer_list[0].txs[0].amount,
        beneficiary:
          fa2Transfer.token_transfer_type.transfer_list[0].txs[0].to_,
        contractAddress: fa2Transfer.token_transfer_type.contract_address,
        tokenId:
          fa2Transfer.token_transfer_type.transfer_list[0].txs[0].token_id,
        type: "FA2" as const,
      };
    }
  });

  return transfers;
};

export const mapProposalBase = (
  dto: ProposalDTO,
  template: DAOTemplate,
  tokenDecimals: number
): Proposal => {
  return {
    id: dto.key,
    upVotes: parseUnits(new BigNumber(dto.upvotes), tokenDecimals),
    downVotes: parseUnits(new BigNumber(dto.downvotes), tokenDecimals),
    proposer: dto.holder.address,
    startDate: dto.start_date,
    startLevel: dto.start_level,
    quorumThreshold: parseUnits(
      new BigNumber(dto.quorum_threshold),
      tokenDecimals
    ),
    period: Number(dto.voting_stage_num) - 1,
    indexer_status_history: dto.status_updates.map((update) => ({
      timestamp: `Level ${dto.start_level} (${dayjs(update.timestamp).format("LLL")})`,
      description: update.proposal_status.description,
    })),
    proposerFrozenTokens: dto.proposer_frozen_token,
    type: template,
    voters: dto.votes.map((vote) => ({
      address: vote.holder.address,
      value: parseUnits(new BigNumber(vote.amount), tokenDecimals),
      support: Boolean(vote.support),
    })),
  };
};

export const mapXTZTransfersArgs = (transfer: TransferParams) => {
  return {
    xtz_transfer_type: {
      amount: xtzToMutez(new BigNumber(transfer.amount)).toNumber(),
      recipient: transfer.recipient,
    },
  };
};

export const mapFA2TransfersArgs = (
  transfer: TransferParams,
  daoAddress: string
) => {
  return {
    token_transfer_type: {
      contract_address: transfer.asset.contract,
      transfer_list: [
        {
          from_: daoAddress,
          txs: [
            {
              to_: transfer.recipient,
              token_id: transfer.asset.token_id,
              amount: formatUnits(
                new BigNumber(transfer.amount),
                transfer.asset.decimals
              ).toNumber(),
            },
          ],
        },
      ],
    },
  };
};

export const mapTransfersArgs = (
  transfers: TransferParams[],
  daoAddress: string
) => {
  return transfers.map((transfer) => {
    if (transfer.type === "FA2") {
      return mapFA2TransfersArgs(transfer, daoAddress);
    }

    return mapXTZTransfersArgs(transfer);
  });
};

const INDEXER_TO_PROPOSAL_STATUS_MAP: Record<IndexerStatus, ProposalStatus> = {
  created: ProposalStatus.PENDING,
  passed: ProposalStatus.PASSED,
  rejected: ProposalStatus.REJECTED,
  dropped: ProposalStatus.DROPPED,
  executed: ProposalStatus.EXECUTED,
};

export const addStatusToProposal = ({
  dao,
  proposal,
  currentLevel,
}: {
  dao: BaseDAO;
  proposal: Proposal;
  currentLevel: number;
}): ProposalWithStatus => {

  const activeThreshold = proposal.startLevel + Number(dao.data.period);
  const passedOrRejectedThreshold = activeThreshold + Number(dao.data.period);
  const flushThreshold =
    proposal.startLevel + Number(dao.data.proposal_flush_level);
  const expiredThreshold =
    proposal.startLevel + Number(dao.data.proposal_expired_level);

  const statusHistory: { status: ProposalStatus; timestamp: string }[] =
    proposal.indexer_status_history.map((update) => ({
      timestamp: update.timestamp,
      status: INDEXER_TO_PROPOSAL_STATUS_MAP[update.description],
    }));

  if (currentLevel > activeThreshold) {
    statusHistory.push({
      status: ProposalStatus.ACTIVE,
      timestamp: `Level ${proposal.startLevel}`,
    });
  }

  if (
    currentLevel > passedOrRejectedThreshold &&
    !statusHistory.some((s) => s.status === ProposalStatus.PASSED) &&
    !statusHistory.some((s) => s.status === ProposalStatus.REJECTED)
  ) {
    statusHistory.push({
      status: ProposalStatus.NO_QUORUM,
      timestamp: `Level ${proposal.startLevel + Number(dao.data.period) * 2}`,
    });
  }

  if (
    currentLevel > flushThreshold &&
    statusHistory.some((s) => s.status === ProposalStatus.PASSED)
  ) {
    statusHistory.push({
      status: ProposalStatus.EXECUTABLE,
      timestamp: `Level ${proposal.startLevel + dao.data.proposal_flush_level}`,
    });
  }

  if (currentLevel > expiredThreshold) {
    statusHistory.push({
      status: ProposalStatus.EXPIRED,
      timestamp: `Level ${
        proposal.startLevel + dao.data.proposal_expired_level
      }`,
    });
  }

  const orderedStatusHistory = statusHistory.sort(
    (a, b) =>
      Number((a.timestamp.match(/(\d+)/) as RegExpMatchArray)[0]) -
      Number((b.timestamp.match(/(\d+)/) as RegExpMatchArray)[0])
  );

  orderedStatusHistory.forEach((s, i) => {
    if (
      s.status === ProposalStatus.EXECUTED ||
      s.status === ProposalStatus.DROPPED
    ) {
      orderedStatusHistory.length = i + 1;
    }
  });

  return {
    ...proposal,
    status: orderedStatusHistory.slice(-1)[0].status,
    statusHistory: orderedStatusHistory,
  };
};
