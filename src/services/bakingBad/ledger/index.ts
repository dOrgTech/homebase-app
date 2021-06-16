import { Network } from "services/beacon/context";
import { dtoToLedger } from "services/bakingBad/ledger/mappers";
import { Ledger, LedgerDTO } from "services/bakingBad/ledger/types";

export const getLedgerAddresses = async (
  ledgerMapNumber: number,
  network: Network
): Promise<Ledger> => {
  const url = `https://api.${network}.tzkt.io/v1/bigmaps/${ledgerMapNumber}/keys?limit=10000`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch ledger addresses from BakingBad API");
  }

  const result: LedgerDTO = await response.json();

  return dtoToLedger(result);
};
