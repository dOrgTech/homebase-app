import { useBalance } from "modules/common/hooks/useBalance";
import { useQuery } from "react-query";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import { BaseDAO } from "..";

export const SUPPORTED_TOKENS = ["XTZ"];

interface BalanceInfo {
  name: string;
  balance?: number;
}

export const useTokenBalances = (contractAddress: string | undefined) => {
  const { data: dao } = useDAO(contractAddress);
  const getBalance = useBalance();

  const result = useQuery<BalanceInfo[], Error>(
    ["balances", contractAddress],
    async () => {
      const allBalances = SUPPORTED_TOKENS.map((token) =>
        getBalance((dao as BaseDAO).address, token)
      );
      const balances = await Promise.all(allBalances);
      return SUPPORTED_TOKENS.map((token, index) => {
        return {
          name: token,
          balance: balances[index],
        };
      });
    },
    {
      enabled: !!dao,
    }
  );

  return result;
};
