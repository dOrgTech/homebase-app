import { getDAOListMetadata } from './../../metadataCarrier/index';
import { useEffect } from "react";
import { useInfiniteQuery, useQuery } from "react-query";

import { useTezos } from "services/beacon/hooks/useTezos";
import { DAOListMetadata } from "services/contracts/metadataCarrier/types";
import { getContractsAddresses } from "services/pinata";
import { BaseDAO } from "..";

const PAGE_SIZE = 10;

export const useDAOs = () => {
  const { tezos, connect } = useTezos();

  const {
    data: addresses,
    isLoading: addressesLoading,
    error: addressesError,
  } = useQuery<string[], Error>("daosAddresses", getContractsAddresses);

  const daosAddresses = addresses || [];

  const result = useInfiniteQuery<(DAOListMetadata | false)[], Error>(
    ["daos", addresses],
    async ({ pageParam = 0 }) => {
      const addressesToFetch = daosAddresses.slice(
        pageParam * PAGE_SIZE,
        (pageParam + 1) * PAGE_SIZE
      );
      return await BaseDAO.getDAOs(addressesToFetch, tezos);
    },
    {
      enabled: !!daosAddresses.length && !!tezos,
      getNextPageParam: (_, allPages) => {
        const daosFetched = allPages.flat().length;
        const currentPage = Math.ceil(daosFetched / PAGE_SIZE) - 1;
        const maxPages = Math.ceil(daosAddresses.length / PAGE_SIZE) - 1;

        return currentPage < maxPages ? currentPage + 1 : false;
      },
    }
  );

  useEffect(() => {
    if (!tezos) {
      connect();
    } else {
      getDAOListMetadata("KT1WqtGuRQA1uuyjG8FKsoUpcBHoRBJaoEB9", tezos).then(data => console.log(data))
    }
  }, [connect, tezos]);

  return {
    ...result,
    data: result.data && {
      ...result.data,
      pages: result.data.pages.map(page => page.filter(result => typeof result !== "boolean") as DAOListMetadata[])
    },
    isLoading: result.isLoading || addressesLoading,
    error: result.error || addressesError,
  };
};
