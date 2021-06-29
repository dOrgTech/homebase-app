import { Proposal, ProposalDTO, Transfer } from "./types";
import {
  PMFA2TransferType,
  PMXTZTransferType,
} from "services/contracts/baseDAO/registryDAO/types";
import { TransferParams } from "services/contracts/baseDAO/types";
import { formatUnits, parseUnits, xtzToMutez } from "services/contracts/utils";
import { DAOTemplate } from "modules/creator/state";
import { BigNumber } from "bignumber.js";

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
  tokenSupply: BigNumber,
  tokenDecimals: number
): Proposal => {
  return {
    id: dto.key,
    upVotes: parseUnits(new BigNumber(dto.value.upvotes), tokenDecimals),
    downVotes: parseUnits(new BigNumber(dto.value.downvotes), tokenDecimals),
    proposer: dto.value.proposer,
    startDate: dto.value.start_date,
    quorumThreshold: new BigNumber(dto.value.quorum_threshold)
      .div(1000000)
      .multipliedBy(parseUnits(tokenSupply, tokenDecimals)),
    period: Number(dto.value.voting_stage_num) - 1,
    proposerFrozenTokens: dto.value.proposer_frozen_token,
    type: template,
    voters: dto.value.voters.map((voter) => ({
      address: voter.voter_address,
      value: parseUnits(new BigNumber(voter.vote_amount), tokenDecimals),
      support: Boolean(voter.vote_type),
    })),
  };
};

//TODO: move these mappers elsewhere

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
