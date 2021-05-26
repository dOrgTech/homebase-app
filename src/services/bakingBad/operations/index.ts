import { API_URL } from "services/bakingBad";
import { Network } from "services/beacon/context";
import { DropOperationDTO } from "./types";

export interface DroppedProposal {
  timestamp: string;
  id: string;
}

export const getDroppedProposals = async (
  contractAddress: string,
  network: Network
): Promise<DroppedProposal[]> => {
  const url = `${API_URL}/contract/${network}/${contractAddress}/operations?entrypoints=drop_proposal`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch contract info from BakingBad API");
  }

  const result: DropOperationDTO = await response.json();

  return result.operations.map((operation) => ({
    id: operation.parameters[0].value,
    timestamp: operation.timestamp,
  }));
};
