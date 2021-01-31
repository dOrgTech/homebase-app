import { Network } from "@airgap/beacon-sdk";
import { BigMapAbstraction } from "@taquito/taquito";
import { API_URL } from "..";
import { dtoToProposals } from "./mappers";
import { Proposal, ProposalsDTO } from "./types";

export const getProposals = async (
  proposalsMap: BigMapAbstraction,
  network: Network
): Promise<Proposal[]> => {
  const mapId = proposalsMap.toString();
  const url = `${API_URL}/bigmap/${network}/${mapId}/keys`;

  const { json, ok } = await fetch(url);
  if (!ok) {
    throw new Error("Failed to fetch proposals from BakingBad API");
  }

  const response: ProposalsDTO = await json();

  return dtoToProposals(response);
};