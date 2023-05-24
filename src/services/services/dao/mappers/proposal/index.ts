import { Transfer } from "./types"
import { formatUnits, xtzToMutez } from "services/contracts/utils"
import BigNumber from "bignumber.js"
import { FA12TransferParams, FA2TransferParams, TransferParams, XTZTransferParams } from "services/contracts/baseDAO"
import { PMFA12TransferType, PMFA2TransferType, PMXTZTransferType } from "services/contracts/baseDAO/lambdaDAO/types"

export const extractTransfersData = (
  transfersDTO: (PMXTZTransferType | PMFA2TransferType | PMFA12TransferType)[]
): Transfer[] => {
  const transfers = transfersDTO.map((transfer: any) => {
    if (transfer.hasOwnProperty("xtz_transfer_type")) {
      const xtzTransfer = transfer

      return {
        amount: xtzTransfer.xtz_transfer_type.amount,
        beneficiary: xtzTransfer.xtz_transfer_type.recipient,
        type: "XTZ" as const
      }
    } else if (transfer.hasOwnProperty("token_transfer_type")) {
      const fa2Transfer = transfer

      return {
        amount: fa2Transfer.token_transfer_type.transfer_list[0].txs[0].amount,
        beneficiary: fa2Transfer.token_transfer_type.transfer_list[0].txs[0].to_,
        contractAddress: fa2Transfer.token_transfer_type.contract_address,
        tokenId: fa2Transfer.token_transfer_type.transfer_list[0].txs[0].token_id,
        type: "FA2" as const
      }
    } else {
      const fa12Transfer = transfer

      return {
        amount: fa12Transfer.legacy_token_transfer_type.transfer.target.value,
        beneficiary: fa12Transfer.legacy_token_transfer_type.transfer.target.to,
        contractAddress: fa12Transfer.legacy_token_transfer_type.contract_address,
        type: "FA1.2" as const,
        tokenId: "0"
      }
    }
  })

  return transfers
}

const mapXTZTransfersArgs = (transfer: XTZTransferParams) => {
  return {
    xtz_transfer_type: {
      amount: xtzToMutez(new BigNumber(transfer.amount)).toNumber(),
      recipient: transfer.recipient
    }
  }
}

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
              amount: formatUnits(new BigNumber(transfer.amount), transfer.asset.decimals).toNumber()
            }
          ]
        }
      ]
    }
  }
}

const mapFA12TransfersArgs = (transfer: FA12TransferParams, daoAddress: string) => {
  return {
    legacy_token_transfer_type: {
      contract_address: transfer.asset.contract,
      transfer: {
        from: daoAddress,
        target: {
          to: transfer.recipient,
          value: formatUnits(new BigNumber(transfer.amount), transfer.asset.decimals).toNumber()
        }
      }
    }
  }
}

export const mapTransfersArgs = (transfers: TransferParams[], daoAddress: string) => {
  return transfers.map(transfer => {
    if (transfer.type === "FA2") {
      return mapFA2TransfersArgs(transfer, daoAddress)
    }

    if (transfer.type === "FA1.2") {
      return mapFA12TransfersArgs(transfer as FA12TransferParams, daoAddress)
    }

    return mapXTZTransfersArgs(transfer as XTZTransferParams)
  })
}
