import { useQuery } from "react-query"
import { getTokenDelegationVoteWeight } from "services/bakingBad/delegations"
import { UserDelegateBalance } from "services/bakingBad/delegations/types"
import { useTezos } from "services/beacon/hooks/useTezos"

export const useDelegationVoteWeight = (tokenAddress: string | undefined) => {
  const { network, account } = useTezos()

  const { data, ...rest } = useQuery<UserDelegateBalance[] | undefined, Error>(
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
