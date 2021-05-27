import { useQuery } from "react-query";
import { getTokenMetadata, TokenMetadata } from "services/bakingBad/tokens";

import { useTezos } from "services/beacon/hooks/useTezos";

export const useTokenMetadata = (address?: string, tokenId?: string) => {
  const { tezos, network } = useTezos();

  const result = useQuery<TokenMetadata, Error>(
    ["tokenMetadata", address, tokenId],
    () => getTokenMetadata(address as string, network, tokenId as string),
    {
      enabled: !!tezos && !!address && !!tokenId,
    }
  );

  return result;
};
