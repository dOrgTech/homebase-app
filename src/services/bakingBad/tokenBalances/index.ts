import { BigNumber } from "bignumber.js";
import { Network } from "services/beacon/context";
import { parseUnits } from "services/contracts/utils";
import { API_URL } from "..";
import { DAOHolding, DAOHoldingNFT, DAOHoldingToken, TokenBalancesDTO } from "./types";

const extractQmHash = (ipfsUri: string) => {
  if(!ipfsUri) {
    return ipfsUri
  }

  return ipfsUri.startsWith("ipfs://")? ipfsUri.split("ipfs://")[1]: ipfsUri
}

export const getDAOHoldings = async (
  daoId: string,
  network: Network
): Promise<DAOHolding[]> => {
  const url = `${API_URL}/account/${network}/${daoId}/token_balances`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch contract storage from BakingBad API");
  }

  const result: TokenBalancesDTO = await response.json();

  return result.balances.map((balance) => balance.symbol === "OBJKT"? ({
    ...balance,
    thumbnail_hash: extractQmHash((balance as DAOHoldingNFT).thumbnail_uri),
    artifact_hash: extractQmHash((balance as DAOHoldingNFT).artifact_uri),
    type: "NFT"
  }) as DAOHoldingNFT : ({
    ...balance,
    id: balance.contract,
    balance: parseUnits(new BigNumber(balance.balance), balance.decimals),
    type: "TOKEN"
  }) as DAOHoldingToken);
};
