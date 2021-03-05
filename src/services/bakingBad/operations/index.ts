import { API_URL } from "services/bakingBad";
import { Network } from "services/beacon/context";
import { dtoToVotes } from "./mappers";
import { OperationsDTO, Vote } from "./types";

export const getOriginationTime = async (
  contractAddress: string,
  network: Network
): Promise<string> => {
  const url = `${API_URL}/contract/${network}/${contractAddress}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch contract info from BakingBad API");
  }

  const result: any = await response.json();

  console.log(result);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return result.timestamp;
};

export const getProposalVotes = async (
  contractAddress: string,
  network: Network,
  proposalKey: string
): Promise<Vote[]> => {
  //TODO: improve this, as it has a scaling limit
  const url = `${API_URL}/contract/${network}/${contractAddress}/operations?size=10000&entrypoints=vote`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch contract operations from BakingBad API");
  }

  const result: OperationsDTO = await response.json();

  return dtoToVotes(result, proposalKey);
};
