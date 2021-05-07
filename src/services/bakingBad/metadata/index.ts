import { API_URL } from "services/bakingBad";
import { Network } from "services/beacon/context";

export interface MetadataDTO {
  address: string;
  network: string;
  extras: {
    template: string;
  };
  name: string;
  description: string;
  version: string;
  license: {
    name: string;
  };
  homepage: string;
  authors: string[];
  interfaces: ["TZIP-12", "TZIP-17"];
}

export const getMetadataFromAPI = async (
  contractAddress: string,
  network: Network
): Promise<MetadataDTO> => {
  const url = `${API_URL}/account/${network}/${contractAddress}/metadata`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch metadata info from BakingBad API");
  }

  const result: MetadataDTO = await response.json();

  return result
};