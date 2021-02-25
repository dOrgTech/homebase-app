import { API_URL } from "services/bakingBad";
import { Network } from "services/beacon/context";
import { StorageDTO } from "services/bakingBad/storage/types";

export const getStorage = async (
  contractAddress: string,
  network: Network
): Promise<StorageDTO> => {
  const url = `${API_URL}/contract/${network}/${contractAddress}/storage`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch contract storage from BakingBad API");
  }

  const result: StorageDTO = await response.json();

  return result;
};
