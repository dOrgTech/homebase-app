import { API_URL } from "services/bakingBad";
import { Network } from "services/beacon/context";

export const getExtra = async <TDTO>(
  extraMapNumber: number,
  network: Network
): Promise<TDTO> => {
  const url = `${API_URL}/bigmap/${network}/${extraMapNumber}/keys`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch DAO's extra info from BakingBad API");
  }

  const result = await response.json();

  return result
};
