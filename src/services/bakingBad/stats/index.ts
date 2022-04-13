import { Network } from "services/beacon/context";
import { BlockchainStats } from "./types";

export const getNetworkStats = async (
  network: Network
): Promise<BlockchainStats> => {
  const url = `${process.env.REACT_APP_CORS_PROXY_URL}https://api.${
    network !== "mainnet" ? "hangzhou." : ""
  }tzstats.com/explorer/config/head`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch contract storage from BakingBad API");
  }

  const result: BlockchainStats = await response.json();

  return result;
};
