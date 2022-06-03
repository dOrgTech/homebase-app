import { Network } from "services/beacon";
import {API_URL, networkNameMap} from "..";
import { TransferDTO, TransfersDTO } from "./types";

export const getDAOTransfers = async (
  daoId: string,
  network: Network
): Promise<TransferDTO[]> => {
  const url = `${API_URL}/tokens/${networkNameMap[network]}/transfers/${daoId}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch contract storage from BakingBad API");
  }

  const result: TransfersDTO = await response.json();

  return result.transfers;
};
