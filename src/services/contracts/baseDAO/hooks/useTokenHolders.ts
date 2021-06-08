import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import { useQuery } from "react-query";
import { Ledger } from "services/bakingBad/ledger/types";
import { BaseDAO } from "..";
import { useTezos } from "services/beacon/hooks/useTezos";

export const useTokenHolders = (contractAddress: string) => {
  const { data: dao } = useDAO(contractAddress);
  const { network } = useTezos()

  const result = useQuery<Ledger, Error>(
    ["ledger", contractAddress],
    () => (dao as BaseDAO).tokenHolders(network),
    {
      enabled: !!dao,
    }
  );

  return result;
};
