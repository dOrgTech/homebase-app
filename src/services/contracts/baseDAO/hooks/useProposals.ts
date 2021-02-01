import { useQuery } from "react-query";
import { useTezos } from "../../../beacon/hooks/useTezos";
import { getDAOProposals } from "..";

export const useProposals = (contractAddress: string) => {
  const { network } = useTezos();

  const result = useQuery(["proposals", contractAddress], async () =>
    getDAOProposals(contractAddress, network)
  );

  return result;
};
