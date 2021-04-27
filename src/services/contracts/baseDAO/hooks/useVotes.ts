import { useMemo } from 'react';
import { useProposal } from "./useProposal";

export const useVotes = (
  proposalKey: string,
  contractAddress: string | undefined
) => {
  const { data: proposal, ...rest } = useProposal(contractAddress, proposalKey)

  const votes = useMemo(() => {
    if(!proposal) {
      return []
    }

    return proposal.voters

  }, [proposal])
  

  return { data: votes, ...rest };
};
