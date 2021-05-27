import { useQuery } from "react-query";

import { useTezos } from "services/beacon/hooks/useTezos";
import { BaseDAO } from "..";

export const useDAO = (address: string | undefined) => {
  const { tezos, network } = useTezos();

  const result = useQuery<BaseDAO, Error>(
    ["dao", address],
    () => BaseDAO.getDAO({ address: address as string, network, tezos }),
    {
      enabled: !!tezos && !!address,
    }
  );

  return result;
};
