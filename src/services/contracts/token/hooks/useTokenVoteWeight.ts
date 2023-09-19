import BigNumber from "bignumber.js"
import { useQuery } from "react-query"
import { getTokenVoteWeight } from "services/bakingBad/delegations"
import { useTezos } from "services/beacon/hooks/useTezos"

export const useTokenVoteWeight = (tokenAddress: string | undefined) => {
  const { network, account } = useTezos()

  const { data, ...rest } = useQuery<BigNumber | undefined, Error>(
    ["userTokenVoteWeight", tokenAddress],
    async () => {
      if (tokenAddress) {
        return await getTokenVoteWeight(tokenAddress, account, network)
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
