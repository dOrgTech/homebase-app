import { API_URL } from "services/bakingBad";
import { Network } from "services/beacon/context";
import { dtoToVotes } from "./mappers";
import { OperationDTO, OperationsDTO, Vote } from "./types";

export const getOriginationTime = async (
  contractAddress: string,
  network: Network
): Promise<string> => {
  const url = `${API_URL}/contract/${network}/${contractAddress}/operations`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch contract operations from BakingBad API");
  }

  const result: OperationsDTO = await response.json();

  console.log(result);

  return result.operations.find(
    (operation: OperationDTO) => operation.kind === "origination"
  )!.timestamp;
};

export const getProposalVotes = async (
  contractAddress: string,
  network: Network,
  proposalKey: string
): Promise<Vote[]> => {
  const url = `${API_URL}/contract/${network}/${contractAddress}/operations`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch contract operations from BakingBad API");
  }

  const result: OperationsDTO = await response.json();

  return dtoToVotes(result, proposalKey);
};
