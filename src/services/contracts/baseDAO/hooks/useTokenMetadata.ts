import { Token } from "models/Token"
import { useQuery } from "react-query"
import { getTokenMetadata } from "services/bakingBad/tokenBalances"

import { useTezos } from "services/beacon/hooks/useTezos"

export const useTokenMetadata = (address?: string, tokenId?: string) => {
  const { tezos, network } = useTezos()

  const result = useQuery<Token, Error>(
    ["tokenMetadata", address, tokenId],
    () => getTokenMetadata(address as string, network, tokenId as string),
    {
      enabled: !!tezos && !!address
    }
  )

  return result
}
