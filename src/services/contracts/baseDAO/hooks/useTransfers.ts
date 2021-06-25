import { BaseDAO } from '..';
import { useQuery } from "react-query";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import { useTezos } from 'services/beacon/hooks/useTezos';
import { getDAOTransfers } from 'services/bakingBad/transfers';
import { TransferDTO } from 'services/bakingBad/transfers/types';
import { parseUnits } from 'services/contracts/utils';

export const useTransfers = (contractAddress: string | undefined) => {
  const { data: dao } = useDAO(contractAddress);
  const { network } = useTezos()

  const result = useQuery<TransferDTO[], Error>(
    ["transfers", contractAddress],
    async () => {
      const transfers = await getDAOTransfers((dao as BaseDAO).address, network);
      return transfers.map(t => ({
        ...t,
        amount:  parseUnits(t.amount, t.token.decimals)
      }))
    },
    {
      enabled: !!dao,
    }
  );

  return result;
};
