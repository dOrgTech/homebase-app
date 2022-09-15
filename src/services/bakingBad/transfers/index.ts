import { Network } from "services/beacon";
import {API_URL, networkNameMap} from "..";
import { TransactionTzkt, TransferDTO, TransfersDTO, TransferTZKT } from "./types";

export const getDAOTransfers = async (
  daoId: string,
  network: Network
): Promise<TransferDTO[]> => {
  const urlTo = `https://api.${networkNameMap[network]}.tzkt.io/v1/tokens/transfers?to=${daoId}`
  const responseTo = await fetch(urlTo);
  if (!responseTo.ok) {
    throw new Error("Failed to fetch contract storage from BakingBad API");
  }
  // const result: TransfersDTO = await response.json();
  const resultsTzktTo: TransferTZKT[] = await responseTo.json();

  const urlFrom = `https://api.${networkNameMap[network]}.tzkt.io/v1/tokens/transfers?from=${daoId}`
  const responseFrom = await fetch(urlFrom);
  if (!responseFrom.ok) {
    throw new Error("Failed to fetch contract storage from BakingBad API");
  }
  // const result: TransfersDTO = await response.json();
  const resultsTzktFrom: TransferTZKT[] = await responseFrom.json();

  const resultsTzktTxId: TransactionTzkt[] = [];

  const resultsTzktAggregated = resultsTzktTo.concat(resultsTzktFrom)

  for (const result of resultsTzktAggregated) {
    const urlId = `https://api.${networkNameMap[network]}.tzkt.io/v1/operations/transactions?id=${result.transactionId}`
    const responseId = await fetch(urlId);
    // const result: TransfersDTO = await response.json();
    const resultTzktTxId: TransactionTzkt[] = await responseId.json();
    resultsTzktTxId.push(resultTzktTxId[0])
  }
  
  const transfers: TransferDTO[] = [];

  resultsTzktAggregated.forEach((result: TransferTZKT) => {
    const resultTzktTx = resultsTzktTxId.find((resultTzktTxId: TransactionTzkt) => {
      return resultTzktTxId.id === result.transactionId
    })

    if(!resultTzktTx){
      return
    }

    const transferDTO: TransferDTO = {
      indexed_time: resultTzktTx.id,
      network: network,
      contract: result.token.contract.address,
      initiator: result.from.address,
      hash: resultTzktTx.hash,
      status: resultTzktTx.hash,
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
        decimals: parseInt(result.token.metadata?.decimals || "")
      },
      alias: result.token.metadata?.name || "",
      to_alias: "",
    }

    transfers.push(transferDTO)
  })

  const result: TransfersDTO = {
    transfers: transfers,
    total: transfers.length,
    last_id: ""
  }

  return result.transfers;
};
