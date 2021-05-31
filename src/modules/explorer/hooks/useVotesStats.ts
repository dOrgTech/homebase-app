import { useMemo } from "react";

interface Props {
  quorumThreshold: number;
  upVotes: number;
  downVotes: number;
}

export const useVotesStats = ({
  quorumThreshold,
  upVotes,
  downVotes,
}: Props) => {
  return useMemo(() => {
    const support = upVotes >= downVotes;

    const votesSum = upVotes + downVotes;
    const votes = support ? upVotes : downVotes;
    const downVotesQuorumPercentage = getRelativeVotePercentage(
      downVotes,
      quorumThreshold
    );
    const upVotesQuorumPercentage = getRelativeVotePercentage(
      upVotes,
      quorumThreshold
    );
    const votesQuorumPercentage = getRelativeVotePercentage(
      votes,
      quorumThreshold
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
  }, [quorumThreshold, upVotes, downVotes]);
};

const getRelativeVotePercentage = (votes: number, quorumOrSum: number) => {
  const result = quorumOrSum ? (votes * 100) / quorumOrSum : 0;
  return result > 100? 100: result
}
