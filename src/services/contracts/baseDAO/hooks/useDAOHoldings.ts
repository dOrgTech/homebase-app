import { BaseDAO } from "..";
import { useQuery } from "react-query";
import { getDAOHoldings } from "services/bakingBad/tokenBalances";
import { DAOHolding } from "services/bakingBad/tokenBalances/types";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import { useTezos } from "services/beacon/hooks/useTezos";
import { useTezosBalances } from "./useTezosBalance";

export const useDAOHoldings = (contractAddress: string | undefined) => {
  const { data: dao } = useDAO(contractAddress);
  const { network } = useTezos();
  const {
    data: tezosBalance,
    error: tezosBalanceError,
    isLoading: tezosBalanceIsLoading,
  } = useTezosBalances(contractAddress);

  const { error, isLoading, ...rest } = useQuery<DAOHolding[], Error>(
    ["balances", contractAddress],
    async () => {
      const daoHoldings = await getDAOHoldings(
        (dao as BaseDAO).address,
        network
      );

      return [...daoHoldings, tezosBalance as DAOHolding]
    },
    {
      enabled: !!dao && !!tezosBalance,
    }
  );

  return {
    error: error || tezosBalanceError,
    isLoading: isLoading || tezosBalanceIsLoading,
    ...rest,
  };
};
