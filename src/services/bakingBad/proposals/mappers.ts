import {
  Proposal,
  ProposalDTO,
  Transfer,
  Voter,
  VotersDTO,
} from "./types";
import {
  PMFA2TransferType,
  PMXTZTransferType,
} from "services/contracts/baseDAO/registryDAO/types";
import { TransferParams } from "services/contracts/baseDAO/types";
import { xtzToMutez } from "services/contracts/utils";
import { DAOTemplate } from "modules/creator/state";

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
        amount: fa2Transfer.transfer_list[0].txs[0].amount,
        beneficiary: fa2Transfer.transfer_list[0].txs[0].to_,
        contractAddress: fa2Transfer.contract_address,
        tokenId: fa2Transfer.transfer_list[0].txs[0].token_id,
        type: "FA2" as const,
      };
    }
  });

  return transfers
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

export const mapProposalBase = (
  dto: ProposalDTO[number],
  template: DAOTemplate
): Proposal => {
  return {
    id: dto.data.key.value,
    upVotes: Number(dto.data.value.children[6].value),
    downVotes: Number(dto.data.value.children[0].value),
    proposer: dto.data.value.children[2].value,
    startDate: dto.data.value.children[5].value,
    quorumThreshold: dto.data.value.children[4].value,
    period: Number(dto.data.value.children[8].value) - 1,
    proposerFrozenTokens: dto.data.value.children[3].value,
    type: template,
    voters: dtoToVoters(dto.data.value.children[7]),
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
