import { Token } from "models/Token"
import { useQuery } from "@tanstack/react-query"
import { getTokenMetadata } from "services/bakingBad/tokenBalances"

import { useTezos } from "services/beacon/hooks/useTezos"

export const useTokenMetadata = (address?: string, tokenId?: string) => {
  const { tezos, network } = useTezos()

  const result = useQuery<Token, Error>({
    queryKey: ["tokenMetadata", address, tokenId],
    queryFn: () => getTokenMetadata(address as string, network, tokenId as string),
    enabled: !!tezos && !!address
  })

  return result
}
