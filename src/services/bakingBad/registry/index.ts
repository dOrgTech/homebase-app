import { API_URL } from "services/bakingBad";
import { Network } from "services/beacon/context";
import { RegistryDTO, RegistryStorageItem } from "./types";
import { dtoToRegistry } from "./mappers";

export const getRegistry = async (
  registryMapNumber: number,
  network: Network
): Promise<RegistryStorageItem[]> => {
  const url = `${API_URL}/bigmap/${network}/${registryMapNumber}/keys`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch contract storage from BakingBad API");
  }

  const result: RegistryDTO = await response.json();

  return dtoToRegistry(result);
};
