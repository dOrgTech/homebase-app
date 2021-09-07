import { BaseDAO } from "..";
import { useQuery } from "react-query";
import { DAOHolding } from "services/bakingBad/tokenBalances/types";
import { useDAO } from "services/indexer/dao/hooks/useDAO";
import { useTezos } from "services/beacon/hooks/useTezos";
import { mutezToXtz } from "services/contracts/utils";

export const XTZ_ASSET_ID = "tezos";

export const useTezosBalances = (contractAddress: string) => {
  const { data: dao } = useDAO(contractAddress);
  const { tezos } = useTezos();

  const result = useQuery<DAOHolding, Error>(
    ["tezosBalance", contractAddress],
    async () => {
      const balance = await tezos.tz.getBalance((dao as BaseDAO).data.address);

      return {
        id: XTZ_ASSET_ID,
        contract: "",
        level: 0,
        token_id: -1,
        symbol: "XTZ",
        name: "XTZ",
        decimals: 6,
        type: "TOKEN",
        balance: mutezToXtz(balance),
      };
    },
    {
      enabled: !!dao && !!tezos,
    }
  );

  return result;
};
