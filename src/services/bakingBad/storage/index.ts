import { API_URL } from "..";
import { Network } from "../../beacon/context";
import { dtoToStorage } from "./mapper";
import { StorageDTO, Storage } from "./types";

export const getStorage = async (
  contractAddress: string,
  network: Network
): Promise<Storage> => {
  const url = `${API_URL}/contract/${network}/${contractAddress}/storage`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch contract storage from BakingBad API");
  }

  const result: StorageDTO = await response.json();

  return dtoToStorage(result);
};
