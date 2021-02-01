import { API_URL } from "..";
import { Network } from "../../beacon/context";
import { dtoToProposals } from "./mappers";
import { Proposal, ProposalsDTO } from "./types";

export const getProposals = async (
  proposalsMapNumber: number,
  network: Network
): Promise<Proposal[]> => {
  const url = `${API_URL}/bigmap/${network}/${proposalsMapNumber}/keys`;

  const { json, ok } = await fetch(url);
  if (!ok) {
    throw new Error("Failed to fetch proposals from BakingBad API");
  }

  const response: ProposalsDTO = await json();

  return dtoToProposals(response);
};
