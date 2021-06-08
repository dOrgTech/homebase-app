import { BaseDAO } from '..';
import { useQuery } from "react-query";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import { useTezos } from 'services/beacon/hooks/useTezos';
import { getDAOTransfers } from 'services/bakingBad/transfers';
import { TransferDTO } from 'services/bakingBad/transfers/types';

export const useTransfers = (contractAddress: string | undefined) => {
  const { data: dao } = useDAO(contractAddress);
  const { network } = useTezos()

  const result = useQuery<TransferDTO[], Error>(
    ["transfers", contractAddress],
    async () => {
      const transfers = await getDAOTransfers((dao as BaseDAO).address, network);
      return transfers.map(t => ({
        ...t,
        amount: (Number(t.amount) / (10 ** t.token.decimals)).toString()
      }))
    },
    {
      enabled: !!dao,
    }
  );

  return result;
};
