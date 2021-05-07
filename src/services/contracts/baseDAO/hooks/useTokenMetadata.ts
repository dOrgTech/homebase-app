import { useEffect } from "react";
import { useQuery } from "react-query";
import { getTokenMetadata, TokenMetadata } from "services/bakingBad/tokens";

import { useTezos } from "services/beacon/hooks/useTezos";

export const useTokenMetadata = (address: string, tokenId: string) => {
  const { tezos, connect, network } = useTezos();

  const result = useQuery<TokenMetadata, Error>(
    ["tokenMetadata", address, tokenId],
    () => getTokenMetadata(address, network, tokenId),
    {
      enabled: !!tezos && !!address && !!tokenId,
    }
  );

  useEffect(() => {
    if (!tezos) {
      connect();
    }
  }, [connect, tezos]);

  return result;
};
