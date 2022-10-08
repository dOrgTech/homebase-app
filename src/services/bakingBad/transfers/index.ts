import { Network } from "services/beacon"
import { networkNameMap } from ".."
import { TransactionTzkt, TransferDTO, TransfersDTO, TransferTZKT } from "./types"

const ELEMENTS_PER_REQUEST = 20

export const getDAOTransfers = async (daoId: string, network: Network): Promise<TransferDTO[]> => {
  const urlTo = `https://api.${networkNameMap[network]}.tzkt.io/v1/tokens/transfers?to=${daoId}&limit=${ELEMENTS_PER_REQUEST}`
  const responseTo = await fetch(urlTo)
  if (!responseTo.ok) {
    throw new Error("Failed to fetch contract storage from BakingBad API")
  }
  const resultsTzktTo: TransferTZKT[] = await responseTo.json()

  const urlFrom = `https://api.${networkNameMap[network]}.tzkt.io/v1/tokens/transfers?from=${daoId}&limit=${ELEMENTS_PER_REQUEST}`
  const responseFrom = await fetch(urlFrom)
  if (!responseFrom.ok) {
    throw new Error("Failed to fetch contract storage from BakingBad API")
  }
  const resultsTzktFrom: TransferTZKT[] = await responseFrom.json()

  const resultsTzktAggregated = resultsTzktTo.concat(resultsTzktFrom)

  const transfers: TransferDTO[] = await Promise.all(
    resultsTzktAggregated.map(async (result: TransferTZKT) => {
      const urlId = `https://api.${networkNameMap[network]}.tzkt.io/v1/operations/transactions?id=${result.transactionId}`
      const responseId = await fetch(urlId)
      const resultTzktTxResult: TransactionTzkt[] = await responseId.json()
      const resultTzktTx: TransactionTzkt = resultTzktTxResult[0]

      const transferDTO: TransferDTO = {
        indexed_time: resultTzktTx.id,
        network: network,
        contract: result.token.contract.address,
        initiator: "",
        hash: resultTzktTx.hash,
        status: resultTzktTx.status,
        timestamp: result.timestamp,
        level: result.level,
        from: result.from.address,
        to: result.to.address,
        token_id: parseInt(result.token.tokenId),
        amount: result.amount,
        counter: resultTzktTx.counter,
        token: {
          contract: result.token.contract.address,
          network: network,
          token_id: parseInt(result.token.tokenId),
          symbol: result.token.metadata?.symbol || "",
          name: result.token.metadata?.name || "",
          decimals: parseInt(result.token.metadata?.decimals || "0")
        },
        alias: result.token.metadata?.name || "",
        to_alias: ""
      }

      return transferDTO
    })
  )

  const result: TransfersDTO = {
    transfers: transfers,
    total: transfers.length
  }

  return result.transfers
}
