import { API_URL } from "services/bakingBad";
import { Network } from "services/beacon/context";
import { dtoToProposals } from "services/bakingBad/proposals/mappers";
import { Proposal, ProposalsDTO } from "services/bakingBad/proposals/types";

export const getProposals = async (
  proposalsMapNumber: number,
  network: Network
): Promise<Proposal[]> => {
  const url = `${API_URL}/bigmap/${network}/${proposalsMapNumber}/keys`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch proposals from BakingBad API");
  }

  const result: ProposalsDTO = await response.json();

  return dtoToProposals(result);
};
