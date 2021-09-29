import { BaseDAO } from "..";
import { useQuery } from "react-query";
import { useDAO } from "services/indexer/dao/hooks/useDAO";
import { useTezos } from "services/beacon/hooks/useTezos";
import BigNumber from "bignumber.js";

export const useTezosBalance = (contractAddress: string) => {
  const { data: dao } = useDAO(contractAddress);
  const { tezos } = useTezos();

  const result = useQuery<BigNumber, Error>(
    ["tezosBalance", contractAddress],
    async () => {
      return await tezos.tz.getBalance((dao as BaseDAO).data.address);
    },
    {
      enabled: !!dao && !!tezos,
    }
  );

  return result;
};
