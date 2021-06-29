import { Network } from "services/beacon/context";
import { ProposalDTO } from "./types";

export const getProposalsDTO = async (
  proposalsMapNumber: number,
  network: Network
): Promise<ProposalDTO[]> => {
  const url = `https://api.${network}.tzkt.io/v1/bigmaps/${proposalsMapNumber}/keys`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch proposals from BakingBad API");
  }

  const result: ProposalDTO[] = await response.json();

  return result;
};

export const getProposalDTO = async (proposalsMapNumber: number, proposalId: string, network: Network): Promise<ProposalDTO> => {
  const url = `https://api.${network}.tzkt.io/v1/bigmaps/${proposalsMapNumber}/keys/${proposalId}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch proposals from BakingBad API");
  }

  const result: ProposalDTO = await response.json();

  return result;
}