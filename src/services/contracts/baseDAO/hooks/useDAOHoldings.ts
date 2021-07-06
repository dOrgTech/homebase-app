import { BaseDAO } from "..";
import { useQuery } from "react-query";
import { getDAOHoldings } from "services/bakingBad/tokenBalances";
import { DAOHolding, DAOHoldingNFT, DAOHoldingToken } from "services/bakingBad/tokenBalances/types";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import { useTezos } from "services/beacon/hooks/useTezos";
import { useTezosBalances } from "./useTezosBalance";
import { useMemo } from "react";

export const useDAOHoldings = (contractAddress: string | undefined) => {
  const { data: dao } = useDAO(contractAddress);
  const { network } = useTezos();
  const {
    data: tezosBalance,
    error: tezosBalanceError,
    isLoading: tezosBalanceIsLoading,
  } = useTezosBalances(contractAddress);

  const { error, isLoading, data, ...rest } = useQuery<DAOHolding[], Error>(
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

  const nftHoldings = useMemo(() => {
    if(!data) {
      return []
    }
    
    return data.filter(holding => holding.symbol === "OBJKT") as DAOHoldingNFT[]
  }, [data])

  const tokenHoldings = useMemo(() => {
    if(!data) {
      return []
    }
    
    return data.filter(holding => holding.symbol !== "OBJKT") as DAOHoldingToken[]
  }, [data])

  return {
    tokenHoldings,
    nftHoldings,
    data,
    error: error || tezosBalanceError,
    isLoading: isLoading || tezosBalanceIsLoading,
    ...rest,
  };

};
