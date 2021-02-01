import { useEffect } from "react";
import { useQuery } from "react-query";
import { getDAOs } from "..";
import { useTezos } from "../../../beacon/hooks/useTezos";
import { getContractsAddresses } from "../../../pinata";
import { DAOItem } from "../types";

interface QueryResult {
  data?: DAOItem[];
  error: Error | null;
  isLoading: boolean;
}

export const useDAOs = (): QueryResult => {
  const { tezos, connect } = useTezos();

  const {
    data: addresses,
    isLoading: addressesLoading,
    error: addressesError,
  } = useQuery<string[], Error>("daosAddresses", getContractsAddresses);

  const daosAddresses = addresses || [];

  const result = useQuery<DAOItem[], Error>(
    ["daos", addresses],
    async () => getDAOs(daosAddresses, tezos),
    {
      enabled: !!daosAddresses.length && !!tezos,
    }
  );

  useEffect(() => {
    if (!tezos) {
      connect();
    }
  }, [connect, tezos]);

  return {
    ...result,
    isLoading: result.isLoading || addressesLoading,
    error: result.error || addressesError,
  };
};
