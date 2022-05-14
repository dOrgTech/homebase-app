import { BigNumber } from "bignumber.js"
import { useMemo } from "react"

interface Props {
  quorumThreshold: BigNumber
  upVotes: BigNumber
  downVotes: BigNumber
}

export const useVotesStats = ({ quorumThreshold, upVotes, downVotes }: Props) => {
  return useMemo(() => {
    const support = upVotes.isGreaterThanOrEqualTo(downVotes)

    const votesSum = upVotes.plus(downVotes)
    const votes = support ? upVotes : downVotes
    const downVotesQuorumPercentage = getRelativeVotePercentage(downVotes, quorumThreshold)
    const upVotesQuorumPercentage = getRelativeVotePercentage(upVotes, quorumThreshold)
    const votesQuorumPercentage = getRelativeVotePercentage(votes, quorumThreshold)
    const downVotesSumPercentage = getRelativeVotePercentage(downVotes, votesSum)
    const upVotesSumPercentage = getRelativeVotePercentage(upVotes, votesSum)
    const votesSumPercentage = getRelativeVotePercentage(votes, votesSum)

    return {
      support,
      votesSum,
      votes,
      downVotesQuorumPercentage,
      upVotesQuorumPercentage,
      votesQuorumPercentage,
      downVotesSumPercentage,
      upVotesSumPercentage,
      votesSumPercentage
    }
  }, [quorumThreshold, upVotes, downVotes])
}

const getRelativeVotePercentage = (votes: BigNumber, quorumOrSum: BigNumber) => {
  const result = quorumOrSum ? votes.multipliedBy(100).div(quorumOrSum) : new BigNumber(0)
  return result.isGreaterThan(100) ? new BigNumber(100) : result
}
