import { Network } from "services/beacon/context";
import { API_URL } from "..";

export interface TokenMetadata {
  contract: string;
  network: string;
  level: number;
  token_id: number;
  symbol: string;
  name: string;
  decimals: number;
  token_info: {
    icon: string;
  };
  supply: number;
  transfered: number;
}

export const getTokenMetadata = async (
  contractAddress: string,
  network: Network,
  tokenId: string
) => {
  const url = `${API_URL}/tokens/${network}/metadata?contract=${contractAddress}&token_id=${tokenId}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch proposals from BakingBad API");
  }

  const result: TokenMetadata[] = await response.json();

  return result[0];
};
