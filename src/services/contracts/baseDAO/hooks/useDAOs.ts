import { useEffect } from "react";
import { useInfiniteQuery, useQuery } from "react-query";

import { useTezos } from "services/beacon/hooks/useTezos";
import { getContractsAddresses } from "services/pinata";
import { BaseDAO } from "..";

const PAGE_SIZE = 6;

export const useDAOs = () => {
  const { tezos, connect, network } = useTezos();

  const {
    data: addresses,
    isLoading: addressesLoading,
    error: addressesError,
  } = useQuery<string[], Error>("daosAddresses", getContractsAddresses);

  const daosAddresses = addresses || [];

  const result = useInfiniteQuery<BaseDAO[], Error>(
    ["daos", addresses],
    async ({ pageParam = 0 }) => {
      const addressesToFetch = daosAddresses.slice(
        pageParam,
        pageParam + PAGE_SIZE
      );
      return await BaseDAO.getDAOs(addressesToFetch, tezos, network);
    },
    {
      enabled: !!daosAddresses.length && !!tezos,
      getNextPageParam: (_, allPages) => {
        const pagesFetched = allPages.flat().length;
        const currentPage = Math.ceil(pagesFetched / PAGE_SIZE);
        const maxPages = Math.ceil(daosAddresses.length / PAGE_SIZE);
        return currentPage < maxPages ? currentPage + 1 : false;
      },
    }
  );

  useEffect(() => {
    if (!tezos) {
      connect();
    }
  }, [connect, tezos]);

  // console.log(result.error || addressesError);

  return {
    ...result,
    isLoading: result.isLoading || addressesLoading,
    error: result.error || addressesError,
  };
};
