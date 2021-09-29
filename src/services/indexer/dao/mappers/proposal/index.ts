import { Transfer } from "./types";
import {
  PMFA2TransferType,
  PMXTZTransferType,
} from "services/contracts/baseDAO/registryDAO/types";
import { formatUnits, xtzToMutez } from "services/contracts/utils";
import BigNumber from "bignumber.js";
import { FA2TransferParams, TransferParams, XTZTransferParams } from "services/contracts/baseDAO";

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

const mapXTZTransfersArgs = (transfer: XTZTransferParams) => {
  return {
    xtz_transfer_type: {
      amount: xtzToMutez(new BigNumber(transfer.amount)).toNumber(),
      recipient: transfer.recipient,
    },
  };
};

const mapFA2TransfersArgs = (transfer: FA2TransferParams, daoAddress: string) => {
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
