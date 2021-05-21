import { useMemo } from "react";
import { useProposals } from "services/contracts/baseDAO/hooks/useProposals";
import { useTokenHolders } from "services/contracts/baseDAO/hooks/useTokenHolders";

export const useTokenHoldersWithVotes = (contractAddress: string) => {
  const {
    data: ledgerData,
    isLoading: ledgerIsLoading,
    error: ledgerError,
  } = useTokenHolders(contractAddress);

  const {
    data: proposals,
    isLoading: proposalsIsLoading,
    error: proposalsError,
  } = useProposals(contractAddress);

  const tokenHoldersWithVotes = useMemo(() => {
    if (!proposals || !ledgerData) {
      return [];
    }

    return ledgerData.map((tokenHolder) => {
      let proposalsVoted = 0;
      let votes = 0;

      proposals.forEach((proposal) => {
        const voter = proposal.voters.find(
          (voter) =>
            voter.address.toLowerCase() === tokenHolder.address.toLowerCase()
        );

        if (voter) {
          votes += voter.value;
          proposalsVoted += 1;
        }
      });

      return {
        ...tokenHolder,
        votes,
        proposalsVoted,
      };
    });
  }, [proposals, ledgerData]);

  return {
    data: tokenHoldersWithVotes,
    isLoading: proposalsIsLoading || ledgerIsLoading,
    error: proposalsError || ledgerError,
  };
};
