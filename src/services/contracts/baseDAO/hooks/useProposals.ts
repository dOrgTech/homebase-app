import { useQuery } from "react-query";
import { useTezos } from "../../../beacon/hooks/useTezos";
import { getDAOProposals } from "..";
import { Proposal } from "../../../bakingBad/proposals/types";

export const useProposals = (contractAddress: string) => {
  const { network } = useTezos();

  const result = useQuery<Proposal[], Error>(
    ["proposals", contractAddress],
    async () => await getDAOProposals(contractAddress, network)
  );

  return result;
};
