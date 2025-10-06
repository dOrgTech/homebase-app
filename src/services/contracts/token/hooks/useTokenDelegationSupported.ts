import { useQuery } from "react-query"
import { isTokenDelegationSupported } from "services/bakingBad/tokenBalances"
import { useTezos } from "services/beacon/hooks/useTezos"

export const useTokenDelegationSupported = (tokenAddress: string | undefined) => {
  const { tezos, isEtherlink } = useTezos()

  const { data, ...rest } = useQuery<boolean, Error>(
    ["delegationSupported", tokenAddress],
    async () => {
      let tokenDelegationSupported = false
      if (tokenAddress) {
        tokenDelegationSupported = await isTokenDelegationSupported(tezos, tokenAddress)
      }
      return tokenDelegationSupported
    },
    {
      // Only run this Tezos-specific check on Tezos networks.
      enabled: !!tokenAddress && !isEtherlink
    }
  )

  return {
    data,
    ...rest
  }
}
