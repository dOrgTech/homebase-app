import {
  ProposalDTO,
  RegistryUpdateProposal,
  Transfer,
  Voter,
  VotersDTO,
} from "./types";
import { Expr, Parser } from "@taquito/michel-codec";
import { bytes2Char } from "@taquito/tzip16";
import {
  PMFA2TransferType,
  PMRegistryUpdateProposal,
  PMTransferProposal,
  PMXTZTransferType,
  ProposalMetadata,
} from "services/contracts/baseDAO/registryDAO/types";
import proposeCode from "../../contracts/baseDAO/registryDAO/michelson/propose";
import { Schema } from "@taquito/michelson-encoder";
import { TransferParams } from "services/contracts/baseDAO/types";
import { xtzToMutez } from "services/contracts/utils";

const parser = new Parser();
const registryProposeSchema = new Schema(parser.parseData(proposeCode) as Expr);

export const extractRegistryTransfersData = (
  pm: PMTransferProposal
): { transfers: Transfer[]; agoraPostId: number } => {
  const agoraPostId = pm.transfer_proposal.agora_post_id;
  const transfers = pm.transfer_proposal.transfers.map((transfer) => {
    if (transfer.hasOwnProperty("xtz_transfer_type")) {
      const xtzTransfer = transfer as PMXTZTransferType;

      return {
        amount: xtzTransfer.xtz_transfer_type.amount,
        beneficiary: xtzTransfer.xtz_transfer_type.recipient,
        type: "XTZ" as const,
      };
    } else {
      const fa2Transfer = transfer as PMFA2TransferType;

      return {
        amount: fa2Transfer.transfer_list[0].txs[0].amount,
        beneficiary: fa2Transfer.transfer_list[0].txs[0].to_,
        contractAddress: fa2Transfer.contract_address,
        tokenId: fa2Transfer.transfer_list[0].txs[0].token_id,
        type: "FA2" as const,
      };
    }
  });

  return {
    transfers,
    agoraPostId: Number(agoraPostId),
  };
};

export const extractTransfersData = (
  pm: ProposalMetadata
): { transfers: Transfer[]; agoraPostId: number } => {
  const agoraPostId = (pm as any).agora_post_id;
  const transfers = (pm as any).transfers.map((transfer: any) => {
    if (transfer.hasOwnProperty("xtz_transfer")) {
      const xtzTransfer = transfer;

      return {
        amount: xtzTransfer.xtz_transfer.amount,
        beneficiary: xtzTransfer.xtz_transfer.recipient,
        type: "XTZ" as const,
      };
    } else {
      const fa2Transfer = transfer;

      return {
        amount: fa2Transfer.transfer_list[0].txs[0].amount,
        beneficiary: fa2Transfer.transfer_list[0].txs[0].to_,
        contractAddress: fa2Transfer.contract_address,
        tokenId: fa2Transfer.transfer_list[0].txs[0].token_id,
        type: "FA2" as const,
      };
    }
  });

  return {
    transfers,
    agoraPostId: Number(agoraPostId),
  };
};

export const dtoToVoters = (votersDTO: VotersDTO): Voter[] => {
  const voters = votersDTO.children;

  if (!voters) {
    return [];
  }

  return voters.map((voter) => ({
    address: voter.children[2].value,
    value: Number(voter.children[0].value),
    support: Boolean(voter.children[1].value),
  }));
};

export const mapProposalRegistryList = (
  pm: PMRegistryUpdateProposal
): { registryDiff: RegistryUpdateProposal["list"]; agoraPostId: string } => {
  console.log(pm[0]);

  const agoraPostId = pm[0].agora_post_id;
  const registryDiff = pm[0].registry_diff.map((item) => ({
    key: bytes2Char(item[0]),
    value: bytes2Char(item[1]),
  }));

  return {
    agoraPostId,
    registryDiff,
  };
};

export const mapTransferProposals = (dto: ProposalDTO[number]) => {
  const proposalMetadata = dto.data.value.children[1].value;

  const proposalMetadataNoBraces = proposalMetadata.substr(
    2,
    proposalMetadata.length - 4
  );
  const michelsonExpr = parser.parseData(proposalMetadataNoBraces);
  const proposalMetadataDTO: ProposalMetadata = registryProposeSchema.Execute(
    michelsonExpr
  );

  const { agoraPostId, transfers } = extractTransfersData(proposalMetadataDTO);

  return {
    id: dto.data.key.value,
    upVotes: Number(dto.data.value.children[7].value),
    downVotes: Number(dto.data.value.children[0].value),
    startDate: dto.data.value.children[6].value,
    agoraPostId: agoraPostId.toString(),
    proposer: dto.data.value.children[3].value,
    proposerFrozenTokens: dto.data.value.children[5].value,
    transfers,
    cycle: Number(dto.data.value.children[2].value),
    voters: dtoToVoters(dto.data.value.children[8]),
    type: "transfer" as const,
  };
};

//TODO: move these mappers elsewhere

export const mapXTZTransfersArgs = (transfer: TransferParams) => {
  return {
    xtz_transfer_type: {
      amount: Number(xtzToMutez(transfer.amount.toString())),
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
              amount: transfer.amount * Math.pow(10, transfer.asset.decimals),
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
