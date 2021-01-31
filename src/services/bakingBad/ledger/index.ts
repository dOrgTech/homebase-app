import { BigMapAbstraction } from "@taquito/taquito";
import { API_URL } from "..";
import { Network } from "../types";
import { dtoToLedger } from "./mappers";
import { Ledger, LedgerDTO } from "./types";

export const getLedgerAddresses = async (
  ledgerMap: BigMapAbstraction,
  network: Network
): Promise<Ledger> => {
  const mapId = ledgerMap.toString();
  const url = `${API_URL}/bigmap/${network}/${mapId}/keys`;

  const { json, ok } = await fetch(url);
  if (!ok) {
    throw new Error("Failed to fetch ledger addresses from BakingBad API");
  }

  const response: LedgerDTO = await json();

  return dtoToLedger(response);
};