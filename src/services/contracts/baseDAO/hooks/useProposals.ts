import { useQuery } from "react-query";
import { useTezos } from "../../../beacon/hooks/useTezos";
import { getDAOProposals } from "..";
import { Proposal } from "../../../bakingBad/proposals/types";

export const useProposals = (contractAddress: string | undefined) => {
  const { network } = useTezos();
  console.log(contractAddress)

  const result = useQuery<Proposal[], Error>(
    ["proposals", contractAddress],
    async () => await getDAOProposals(contractAddress as string, network),
    {
      enabled: !!contractAddress,
    }
  );

  return result;
};
