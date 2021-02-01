import { useQuery } from "react-query";
import { useTezos } from "../../../beacon/hooks/useTezos";
import { getDAOTokenHolders } from "..";
import { Ledger } from "../../../bakingBad/ledger/types";

export const useTokenHolders = (contractAddress: string) => {
  const { network } = useTezos();

  const result = useQuery<Ledger, Error>(
    ["ledger", contractAddress],
    async () => await getDAOTokenHolders(contractAddress, network)
  );

  return result;
};
