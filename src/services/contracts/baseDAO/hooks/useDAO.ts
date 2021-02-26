import { useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";

import { useTezos } from "services/beacon/hooks/useTezos";
import { BaseDAO } from "../classes";

export const useDAO = (address: string | undefined) => {
  const { tezos, connect, network } = useTezos();
  const queryClient = useQueryClient();

  const result = useQuery<BaseDAO, Error>(
    ["dao", address],
    () => BaseDAO.getDAO({ address: address as string, network, tezos }),
    {
      enabled: !!tezos && !!address && !!queryClient,
      initialData: () => {
        return queryClient
          ?.getQueryData<BaseDAO[]>("daos")
          ?.find((d) => d.address === address);
      },
    }
  );

  useEffect(() => {
    if (!tezos) {
      connect();
    }
  }, [connect, tezos]);

  return result;
};
