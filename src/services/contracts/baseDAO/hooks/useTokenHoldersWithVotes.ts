import { useProposals } from "./useProposals";
import { useMemo } from "react";
import { useTokenHolders } from "./useTokenHolders";

export const useTokenHoldersWithVotes = (contractAddress: string) => {
  const {
    data: ledger,
    isLoading: ledgerIsLoading,
    error: ledgerError,
  } = useTokenHolders(contractAddress);

  const {
    data: proposals,
    isLoading: proposalsIsLoading,
    error: proposalsError,
  } = useProposals(contractAddress);

  const tokenHoldersWithVotes = useMemo(() => {
    if (!proposals || !ledger) {
      return [];
    }

    return ledger.map((tokenHolder) => {
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
  }, [proposals, ledger]);

  return {
    data: tokenHoldersWithVotes,
    isLoading: proposalsIsLoading || ledgerIsLoading,
    error: proposalsError || ledgerError,
  };
};
