import { useQuery } from "react-query";
import { Network } from "services/beacon/context";
import { getDAOs } from "services/indexer/dao/services";

export const useAllDAOs = (network: Network) => {
  return useQuery(
    ["daos", network],
    async () => {
      return await getDAOs(network);
    },
    {
      enabled: !!network,
    }
  );
};
