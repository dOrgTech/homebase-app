import { BaseDAO } from "..";
import { useQuery } from "react-query";
import { useDAO } from "services/indexer/dao/hooks/useDAO";
import { useTezos } from "services/beacon/hooks/useTezos";
import { getDAOTransfers } from "services/bakingBad/transfers";
import { TransferWithBN } from "services/bakingBad/transfers/types";
import { parseUnits } from "services/contracts/utils";
import { BigNumber } from "bignumber.js";

export const useTransfers = (contractAddress: string) => {
  const { data: dao } = useDAO(contractAddress);
  const { network } = useTezos();

  const result = useQuery<TransferWithBN[], Error>(
    ["transfers", contractAddress],
    async () => {
      const transfers = await getDAOTransfers(
        (dao as BaseDAO).data.address,
        network
      );
      return transfers.map((t) => ({
        ...t,
        amount: parseUnits(new BigNumber(t.amount), t.token.decimals),
      }));
    },
    {
      enabled: !!dao,
    }
  );

  return result;
};
