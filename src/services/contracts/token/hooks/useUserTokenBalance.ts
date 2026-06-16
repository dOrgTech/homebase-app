import { useQuery } from "@tanstack/react-query"
import { getUserTokenBalance } from "services/bakingBad/tokenBalances"
import { useTezos } from "services/beacon/hooks/useTezos"

export const useUserTokenBalance = (tokenAddress: string | undefined) => {
  const { network, account } = useTezos()

  const { data, ...rest } = useQuery<string, Error>({
    queryKey: ["userTokenBalance", tokenAddress],
    queryFn: async () => {
      return await getUserTokenBalance(account, network, tokenAddress)
    },
    enabled: !!tokenAddress
  })

  return {
    data,
    ...rest
  }
}
