import { BaseDAO } from '..';
import { useQuery } from "react-query";
import { TokenBalance } from "services/bakingBad/tokenBalances/types";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import { useTezos } from 'services/beacon/hooks/useTezos';

export const useTezosBalances = (contractAddress: string | undefined) => {
  const { data: dao } = useDAO(contractAddress);
  const { network, tezos } = useTezos()

  const result = useQuery<TokenBalance, Error>(
    ["tezosBalance", contractAddress],
    async () => {
      const balance = await tezos.tz.getBalance((dao as BaseDAO).address)

      return {
        contract: "",
        network: network,
        level: 0,
        token_id: -1,
        symbol: "XTZ",
        name: "XTZ",
        decimals: 6,
        balance: balance.toString(),
      }
    },
    {
      enabled: !!dao && !!tezos,
    }
  );

  return result;
};
