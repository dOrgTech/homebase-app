import { Network } from "services/beacon";
import { BlockchainStats } from "./types";

const networkToUrlMap: Record<Network, string> = {
  mainnet: "",
  jakartanet: "jakarta.",
};

export const getNetworkStats = async (
  network: Network
): Promise<BlockchainStats> => {
  const url = `${process.env.REACT_APP_CORS_PROXY_URL}/https://api.${networkToUrlMap[network]}tzstats.com/explorer/config/head`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch contract storage from BakingBad API");
  }

  const result: BlockchainStats = await response.json();

  return result;
};
