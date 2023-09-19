import BigNumber from "bignumber.js"
import { useQuery } from "react-query"
import { getTokenVoteWeight } from "services/bakingBad/delegations"
import { useTezos } from "services/beacon/hooks/useTezos"
import { getCurrentBlock } from "services/utils/utils"

export const useTokenVoteWeight = (tokenAddress: string | undefined, level?: string) => {
  const { network, account } = useTezos()

  const { data, ...rest } = useQuery<BigNumber | undefined, Error>(
    ["userTokenVoteWeight", tokenAddress, level],
    async () => {
      const blockLevel = level ? level : await getCurrentBlock(network)
      if (tokenAddress && blockLevel) {
        return await getTokenVoteWeight(tokenAddress, account, network, blockLevel)
      }
    },
    {
      enabled: !!tokenAddress && !!account
    }
  )

  return {
    data,
    ...rest
  }
}
