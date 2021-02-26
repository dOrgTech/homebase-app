import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import { useQuery } from "react-query";
import { Ledger } from "services/bakingBad/ledger/types";
import { BaseDAO } from "..";

export const useTokenHolders = (contractAddress: string) => {
  const { data: dao } = useDAO(contractAddress);

  const result = useQuery<Ledger, Error>(
    ["ledger", contractAddress],
    () => (dao as BaseDAO).tokenHolders(),
    {
      enabled: !!dao,
    }
  );

  return result;
};
