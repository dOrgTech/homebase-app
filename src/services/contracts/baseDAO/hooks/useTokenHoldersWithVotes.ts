import { BigNumber } from "bignumber.js";
import { useMemo } from "react";
import { useProposals } from "services/contracts/baseDAO/hooks/useProposals";
import { useDAO } from "services/indexer/dao";

export const useTokenHoldersWithVotes = (contractAddress: string) => {
  const {
    data: daoData,
    isLoading: daoIsLoading,
    error: daoError,
  } = useDAO(contractAddress);

  const {
    data: proposals,
    isLoading: proposalsIsLoading,
    error: proposalsError,
  } = useProposals(contractAddress);

  const tokenHoldersWithVotes = useMemo(() => {
    if (!proposals || !daoData) {
      return [];
    }

    return daoData.data.ledger.map((tokenHolder) => {
      let proposalsVoted = 0;
      let votes = new BigNumber(0);

      proposals.forEach((proposal) => {
        const voter = proposal.voters.find(
          (voter) =>
            voter.address.toLowerCase() === tokenHolder.holder.address.toLowerCase()
        );

        if (voter) {
          votes = votes.plus(voter.value);
          proposalsVoted += 1;
        }
      });

      return {
        ...tokenHolder,
        votes,
        proposalsVoted,
      };
    });
  }, [proposals, daoData]);

  return {
    data: tokenHoldersWithVotes,
    isLoading: proposalsIsLoading || daoIsLoading,
    error: proposalsError || daoError,
  };
};
