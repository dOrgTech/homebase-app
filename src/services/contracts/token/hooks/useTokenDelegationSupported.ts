import { useQuery } from "react-query"
import { isTokenDelegationSupported } from "services/bakingBad/tokenBalances"
import { useTezos } from "services/beacon/hooks/useTezos"

export const useTokenDelegationSupported = (tokenAddress: string | undefined) => {
  const { tezos } = useTezos()

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
      enabled: !!tokenAddress
    }
  )

  return {
    data,
    ...rest
  }
}
