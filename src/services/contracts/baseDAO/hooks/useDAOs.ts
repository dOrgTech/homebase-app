import { useInfiniteQuery, useQuery } from "react-query";

import { useTezos } from "services/beacon/hooks/useTezos";
import { DAOListMetadata } from "services/contracts/metadataCarrier/types";
import { getContractsAddresses } from "services/pinata";
import { getMetadataFromAPI } from 'services/bakingBad/metadata';

const PAGE_SIZE = 10;

export const useDAOs = () => {
  const { tezos, network } = useTezos();

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

      return await Promise.all(
        addressesToFetch.map(async (address) => {
          try {
  
            const metadata = await getMetadataFromAPI(address, network)
  
            return metadata;
          } catch (e) {
            console.log(e);
            return false;
          }
        })
      );
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
