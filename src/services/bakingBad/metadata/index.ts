import { API_URL } from "services/bakingBad";
import { Network } from "services/beacon/context";
import { DAOListMetadata } from "services/contracts/metadataCarrier/types";
import { metadataFromAPIDTOtoDAOListMetadata } from "./mapper";
import { MetadataDTO } from "./types";

export const getMetadataFromAPI = async (
  contractAddress: string,
  network: Network
): Promise<DAOListMetadata> => {
  const url = `${API_URL}/account/${network}/${contractAddress}/metadata`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch metadata info from BakingBad API");
  }

  const result: MetadataDTO = await response.json();

  return metadataFromAPIDTOtoDAOListMetadata(result);
};
