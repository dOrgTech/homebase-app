import { Network } from "services/beacon/context";
import { DropOperationDTO, OperationTimestampDTO } from "./types";

export const getOperationTimestampsByEntrypoint = async (
  contractAddress: string,
  entrypoint: string,
  network: Network
): Promise<OperationTimestampDTO[]> => {
  const url = `https://api.${network}.tzkt.io/v1/operations/transactions?target=${contractAddress}&entrypoint=${entrypoint}&status=applied&limit=10000&select=id,timestamp`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch contract info from BakingBad API");
  }

  const result: OperationTimestampDTO[] = await response.json();

  return result.map((operation) => ({
    id: operation.id,
    timestamp: operation.timestamp,
  }));
};

export interface DroppedProposalOp {
  proposalId: string;
  timestamp: string;
}

export const getDroppedProposals = async (
  contractAddress: string,
  network: Network
): Promise<DroppedProposalOp[]> => {
  const url = `https://api.${network}.tzkt.io/v1/operations/transactions?target=${contractAddress}&entrypoint=drop_proposal&status=applied&limit=10000&select=id,timestamp,parameter`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch contract info from BakingBad API");
  }

  const result: DropOperationDTO[] = await response.json();

  return result.map((operation) => ({
    proposalId: operation.parameter.value,
    timestamp: operation.timestamp,
  }));
};

