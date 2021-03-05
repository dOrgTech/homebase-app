import { useMemo } from "react";

interface Props {
  quorumTreshold: number;
  upVotes: number;
  downVotes: number;
}

export const useVotesStats = ({
  quorumTreshold,
  upVotes,
  downVotes,
}: Props) => {
  return useMemo(() => {
    const support = upVotes >= downVotes;

    const votesSum = upVotes + downVotes;
    const votes = support ? upVotes : downVotes;
    const downVotesQuorumPercentage = getRelativeVotePercentage(
      downVotes,
      quorumTreshold
    );
    const upVotesQuorumPercentage = getRelativeVotePercentage(
      upVotes,
      quorumTreshold
    );
    const votesQuorumPercentage = getRelativeVotePercentage(
      votes,
      quorumTreshold
    );
    const downVotesSumPercentage = getRelativeVotePercentage(
      downVotes,
      votesSum
    );
    const upVotesSumPercentage = getRelativeVotePercentage(upVotes, votesSum);
    const votesSumPercentage = getRelativeVotePercentage(votes, votesSum);

    return {
      support,
      votesSum,
      votes,
      downVotesQuorumPercentage,
      upVotesQuorumPercentage,
      votesQuorumPercentage,
      downVotesSumPercentage,
      upVotesSumPercentage,
      votesSumPercentage,
    };
  }, [quorumTreshold, upVotes, downVotes]);
};

const getRelativeVotePercentage = (votes: number, quorumOrSum: number) =>
  quorumOrSum ? (votes * 100) / quorumOrSum : 0;
