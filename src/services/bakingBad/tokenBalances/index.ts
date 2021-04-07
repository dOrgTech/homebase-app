import { Network } from "services/beacon/context";
import { API_URL } from "..";
import { TokenBalance, TokenBalancesDTO } from "./types";
import fetch from "node-fetch";

export const getDAOTokenBalances = async (
  daoId: string,
  network: Network
): Promise<TokenBalance[]> => {
  const url = `${API_URL}/account/${network}/${daoId}/token_balances`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch contract storage from BakingBad API");
  }

  const result: TokenBalancesDTO = await response.json();

  return result.balances;
};
