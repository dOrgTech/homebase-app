import { useQuery } from "@tanstack/react-query"
import { getTokenDelegation } from "services/bakingBad/delegations"
import { getDAOBalances } from "services/bakingBad/tokenBalances"
import { useTezos } from "services/beacon/hooks/useTezos"

export const useDelegationStatus = (tokenAddress: string | undefined) => {
  const { network, tezos, account, connect } = useTezos()

  const { data, ...rest } = useQuery<string | null, Error>({
    queryKey: ["tokenDelegations", tokenAddress],
    queryFn: async () => {
      if (!tokenAddress) {
        return null
      } else {
        return await getTokenDelegation(tokenAddress, account, network)
      }
    },
    enabled: !!tokenAddress && !!account
  })

  return {
    data,
    ...rest
  }
}
