import BigNumber from "bignumber.js"
import { useQuery } from "react-query"
import { getTokenVoteWeight } from "services/bakingBad/delegations"
import { useTezos } from "services/beacon/hooks/useTezos"
import { getCurrentBlock } from "services/utils/utils"

interface Result {
  votingWeight: BigNumber
  votingXTZWeight: BigNumber
}

export const useTokenVoteWeight = (tokenAddress: string | undefined, level?: string) => {
  const { network, account, etherlink } = useTezos()
  const tezosOrEthAccount = account || etherlink?.account?.address

  const { data, ...rest } = useQuery<Result | undefined, Error>(
    ["userTokenVoteWeight", tokenAddress, level],
    async () => {
      const blockLevel = level ? level : await getCurrentBlock(network)
      if (tokenAddress && blockLevel) {
        return await getTokenVoteWeight(tokenAddress, tezosOrEthAccount, network, blockLevel)
      }
    },
    {
      enabled: !!tokenAddress && !!tezosOrEthAccount
    }
  )

  return {
    data,
    ...rest
  }
}
