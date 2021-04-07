import { Network } from "services/beacon/context";
import { API_URL } from "..";
import { TransferDTO, TransfersDTO } from "./types";
import fetch from "node-fetch";

export const getDAOTransfers = async (
  daoId: string,
  network: Network
): Promise<TransferDTO[]> => {
  const url = `${API_URL}/tokens/${network}/transfers/${daoId}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch contract storage from BakingBad API");
  }

  const result: TransfersDTO = await response.json();

  return result.transfers;
};
