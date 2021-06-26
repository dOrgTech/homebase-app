import { API_URL } from "services/bakingBad";
import { Network } from "services/beacon/context";
import { DropOperationDTO, FlushOperationDTO } from "./types";

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

export const getFlushOperations = async (
  contractAddress: string,
  network: Network,
  from: number,
  to: number
): Promise<{ id: string; timestamp: string }[]> => {
  const url = `${API_URL}/contract/${network}/${contractAddress}/operations?entrypoints=flush&status=applied&from=${from}&to=${to}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch contract info from BakingBad API");
  }

  const result: { operations: FlushOperationDTO[] } = await response.json();

  return result.operations.map((operation) => ({
    id: operation.id.toString(),
    timestamp: operation.timestamp,
  }));
};
