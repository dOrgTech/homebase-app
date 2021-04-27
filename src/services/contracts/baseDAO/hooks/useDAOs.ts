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

  console.log(addresses)

  const daosAddresses = addresses || [];

  const result = useInfiniteQuery<(BaseDAO | false)[], Error>(
    ["daos", addresses],
    async ({ pageParam = 0 }) => {
      const addressesToFetch = daosAddresses.slice(
        pageParam * PAGE_SIZE,
        (pageParam + 1) * PAGE_SIZE
      );
      return await BaseDAO.getDAOs(addressesToFetch, tezos, network);
    },
    {
      enabled: !!daosAddresses.length && !!tezos,
      getNextPageParam: (_, allPages) => {
        console.log(allPages)
        const daosFetched = allPages.flat().length;
        const currentPage = Math.ceil(daosFetched / PAGE_SIZE) - 1;
        const maxPages = Math.ceil(daosAddresses.length / PAGE_SIZE) - 1;

        console.log(maxPages, currentPage, daosFetched)
        return currentPage < maxPages ? currentPage + 1 : false;
      },
    }
  );

  useEffect(() => {
    if (!tezos) {
      connect();
    }
  }, [connect, tezos]);

  return {
    ...result,
    data: result.data && {
      ...result.data,
      pages: result.data.pages.map(page => page.filter(result => typeof result !== "boolean") as BaseDAO[])
    },
    isLoading: result.isLoading || addressesLoading,
    error: result.error || addressesError,
  };
};
