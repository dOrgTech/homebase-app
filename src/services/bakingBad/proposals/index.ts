import { API_URL } from "services/bakingBad";
import { Network } from "services/beacon/context";
import { ProposalDTO } from "./types";

export const getProposalsDTO = async (
  proposalsMapNumber: number,
  network: Network
): Promise<ProposalDTO> => {
  const url = `${API_URL}/bigmap/${network}/${proposalsMapNumber}/keys`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch proposals from BakingBad API");
  }

  const result: ProposalDTO = await response.json();

  return result;
};
