import { BaseDAO } from "..";
import { useQuery } from "react-query";
import { DAOHolding, getDAOBalances, NFTDAOHolding } from "services/bakingBad/tokenBalances";
import { useDAO } from "services/indexer/dao/hooks/useDAO";
import { useTezos } from "services/beacon/hooks/useTezos";
import { useMemo } from "react";
import { NFT } from "models/Token";

export const useDAOHoldings = (contractAddress: string) => {
  const { data: dao } = useDAO(contractAddress);
  const { network } = useTezos();

  const { data, ...rest } = useQuery<DAOHolding[], Error>(
    ["balances", contractAddress],
    async () => {
      return await getDAOBalances((dao as BaseDAO).data.address, network);
    },
    {
      enabled: !!dao,
    }
  );

  const nfts = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.filter((holding) => holding.token instanceof NFT) as NFTDAOHolding[];
  }, [data]);

  const tokens = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.filter((holding) => !(holding.token instanceof NFT));
  }, [data]);

  return {
    tokenHoldings: tokens,
    nftHoldings: nfts,
    data,
    ...rest,
  };
};
