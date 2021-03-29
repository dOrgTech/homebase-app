import { BaseDAO } from "..";
import { useQuery } from "react-query";
import { getDAOTokenBalances } from "services/bakingBad/tokenBalances";
import { TokenBalance } from "services/bakingBad/tokenBalances/types";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import { useTezos } from "services/beacon/hooks/useTezos";
import { useTezosBalances } from "./useTezosBalance";

export const useTokenBalances = (contractAddress: string | undefined) => {
  const { data: dao } = useDAO(contractAddress);
  const { network } = useTezos();
  const {
    data: tezosBalance,
    error: tezosBalanceError,
    isLoading: tezosBalanceIsLoading,
  } = useTezosBalances(contractAddress);

  const { error, isLoading, ...rest } = useQuery<TokenBalance[], Error>(
    ["balances", contractAddress],
    async () => {
      const tokenBalances = await getDAOTokenBalances(
        (dao as BaseDAO).address,
        network
      );

      return [...tokenBalances, tezosBalance as TokenBalance]
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
