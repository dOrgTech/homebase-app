import { API_URL } from "services/bakingBad";
import { Network } from "services/beacon/context";
import { StorageDTO, Storage } from "services/bakingBad/storage/types";
import { storageDTOToStorage } from "./mapper";
import { getTokenMetadata } from "../tokens";

export const getStorage = async (
  contractAddress: string,
  network: Network
): Promise<Storage> => {
  const url = `${API_URL}/contract/${network}/${contractAddress}/storage`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch contract storage from BakingBad API");
  }

  const result = await response.json();
  const storage = storageDTOToStorage(result[0] as StorageDTO);
  const govToken = await getTokenMetadata(storage.governanceToken.address, network, storage.governanceToken.tokenId.toString())

  console.log(govToken, storage.quorumTreshold)
  storage.quorumTreshold = storage.quorumTreshold * (Number(govToken.supply) / Number(10 ** govToken.decimals))

  return storage;
};
