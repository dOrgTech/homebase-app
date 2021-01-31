import { BigMapAbstraction } from "@taquito/taquito"
import { LedgerDTO, Network } from "./types";

const API_URL = "https://api.better-call.dev/v1";

export const getLedgerAddresses = async (ledgerMap: BigMapAbstraction, network: Network) => {
  const mapId = ledgerMap.toString();
  const url = `${API_URL}/bigmap/${network}/${mapId}/keys`
  

  const { json, ok } = await fetch(url)
  if (!ok) {
    throw new Error('Failed to fetch ledger addresses from BakingBad API')
  }

  const response: LedgerDTO = await json()
}