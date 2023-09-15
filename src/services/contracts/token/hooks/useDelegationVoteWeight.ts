import BigNumber from "bignumber.js"
import { useQuery } from "react-query"
import { getTokenDelegationVoteWeight } from "services/bakingBad/delegations"
import { useTezos } from "services/beacon/hooks/useTezos"

export const useDelegationVoteWeight = (tokenAddress: string | undefined) => {
  const { network, account } = useTezos()

  const { data, ...rest } = useQuery<BigNumber | undefined, Error>(
    ["delegationVoteWeight", tokenAddress],
    async () => {
      if (tokenAddress) {
        return await getTokenDelegationVoteWeight(tokenAddress, account, network)
      }
    },
    {
      enabled: !!tokenAddress
    }
  )

  return {
    data,
    ...rest
  }
}
