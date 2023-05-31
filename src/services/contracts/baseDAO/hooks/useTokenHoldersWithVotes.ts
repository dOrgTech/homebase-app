import { BigNumber } from "bignumber.js"
import { useMemo } from "react"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { useProposals } from "services/services/dao/hooks/useProposals"

export const useTokenHoldersWithVotes = (contractAddress: string) => {
  const { isLoading: daoIsLoading, error: daoError, ledger } = useDAO(contractAddress)

  const { data: proposals, isLoading: proposalsIsLoading, error: proposalsError } = useProposals(contractAddress)

  const tokenHoldersWithVotes = useMemo(() => {
    if (!proposals || !ledger) {
      return []
    }

    return ledger.map(tokenHolder => {
      let proposalsVoted = 0
      let votes = new BigNumber(0)

      proposals.forEach(proposal => {
        const voter = proposal.voters.find(
          voter => voter.address.toLowerCase() === tokenHolder.holder.address.toLowerCase()
        )

        if (voter) {
          votes = votes.plus(voter.value)
          proposalsVoted += 1
        }
      })

      return {
        ...tokenHolder,
        votes,
        proposalsVoted
      }
    })
  }, [proposals, ledger])

  return {
    data: tokenHoldersWithVotes,
    isLoading: proposalsIsLoading || daoIsLoading,
    error: proposalsError || daoError
  }
}
