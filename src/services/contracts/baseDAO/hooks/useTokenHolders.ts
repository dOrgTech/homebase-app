import { useQuery } from "react-query";
import { useTezos } from "services/beacon/hooks/useTezos";
import { Ledger } from "services/bakingBad/ledger/types";
import { getDAOTokenHolders } from "services/contracts/baseDAO";

export const useTokenHolders = (contractAddress: string) => {
  const { network } = useTezos();

  const result = useQuery<Ledger, Error>(
    ["ledger", contractAddress],
    async () => await getDAOTokenHolders(contractAddress, network)
  );

  return result;
};
