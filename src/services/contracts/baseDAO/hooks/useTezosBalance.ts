import { BaseDAO } from '..';
import { useQuery } from "react-query";
import { DAOHolding } from "services/bakingBad/tokenBalances/types";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import { useTezos } from 'services/beacon/hooks/useTezos';
import { mutezToXtz } from 'services/contracts/utils';

export const XTZ_ASSET_ID = 'tezos'

export const useTezosBalances = (contractAddress: string | undefined) => {
  const { data: dao } = useDAO(contractAddress);
  const { tezos } = useTezos()

  const result = useQuery<DAOHolding, Error>(
    ["tezosBalance", contractAddress],
    async () => {
      const balance = await tezos.tz.getBalance((dao as BaseDAO).address)

      return {
        id: XTZ_ASSET_ID,
        contract: "",
        level: 0,
        token_id: -1,
        symbol: "XTZ",
        name: "XTZ",
        decimals: 6,
        balance: mutezToXtz(balance.toString()),
      }
    },
    {
      enabled: !!dao && !!tezos,
    }
  );

  return result;
};
