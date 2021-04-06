import { API_URL } from "services/bakingBad";
import { Network } from "services/beacon/context";
import { ProposalsDTO } from "services/bakingBad/proposals/types";
import fetch from "node-fetch";

export const getProposalsDTO = async (
  proposalsMapNumber: number,
  network: Network
): Promise<ProposalsDTO> => {
  const url = `${API_URL}/bigmap/${network}/${proposalsMapNumber}/keys`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch proposals from BakingBad API");
  }

  const result: ProposalsDTO = await response.json();

  return result;
};
