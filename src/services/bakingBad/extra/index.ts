import { Network } from "services/beacon/context";
import { RegistryExtraDTOBCD } from "services/contracts/baseDAO/registryDAO/types";
import { API_URL } from "..";

export const getExtra = async <TDTO>(
  extraMapNumber: number,
  network: Network
): Promise<TDTO> => {
  const url = `https://api.${network}.tzkt.io/v1/bigmaps/${extraMapNumber}/keys?limit=10000`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch DAO's extra info from BakingBad API");
  }

  const result = await response.json();

  return result;
};

export const getExtraRegistryValues = async (
  extraMapNumber: number,
  network: Network
): Promise<{ registry: string; registryAffected: string }> => {
  const url = `${API_URL}/bigmap/${network}/${extraMapNumber}/keys`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch DAO's extra info from BakingBad API");
  }

  const result: RegistryExtraDTOBCD = await response.json();

  return {
    registry: result[0].data.value.value,
    registryAffected: result[3].data.value.value,
  };
};
