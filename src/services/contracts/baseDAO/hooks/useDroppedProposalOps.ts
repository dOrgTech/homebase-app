import { BaseDAO } from '..';
import { useQuery } from "react-query";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import { useTezos } from 'services/beacon/hooks/useTezos';
import { DroppedProposal, getDroppedProposals } from 'services/bakingBad/operations';

export const useDroppedProposalOps = (contractAddress: string | undefined) => {
  const { data: dao } = useDAO(contractAddress);
  const { network } = useTezos()

  const result = useQuery<DroppedProposal[], Error>(
    ["operations", contractAddress],
    () => getDroppedProposals((dao as BaseDAO).address, network),
    {
      enabled: !!dao,
    }
  );

  return result;
};
