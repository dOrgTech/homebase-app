import { useQuery } from "react-query"
import { getTokenDelegationVoteWeight } from "services/bakingBad/delegations"
import { UserDelegateBalance } from "services/bakingBad/delegations/types"
import { useTezos } from "services/beacon/hooks/useTezos"

export const useDelegationVoteWeight = (tokenAddress: string | undefined, contractAddress: string | undefined) => {
  const { network, account } = useTezos()

  const { data, ...rest } = useQuery<UserDelegateBalance[] | undefined, Error>(
    ["delegationVoteWeight", tokenAddress, account, contractAddress],
    async () => {
      if (tokenAddress && account && network && contractAddress) {
        return await getTokenDelegationVoteWeight(tokenAddress, contractAddress, account, network)
      }
    },
    {
      enabled: !!tokenAddress && !!account && !!contractAddress
    }
  )

  return {
    data,
    ...rest
  }
}
