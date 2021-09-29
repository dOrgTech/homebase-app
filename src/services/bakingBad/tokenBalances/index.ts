import BigNumber from "bignumber.js";
import { NFT, Token } from "models/Token";
import { Network } from "services/beacon/context";
import { parseUnits } from "services/contracts/utils";
import { API_URL } from "..";
import { DAOToken, NFTDTO, TokenBalancesDTO } from "./types";

const isNFTDTO = (value: DAOToken): value is NFTDTO =>
  value.hasOwnProperty("artifact_uri");

export interface DAOHolding {
  balance: BigNumber;
  token: Token;
}

export interface NFTDAOHolding extends DAOHolding {
  token: NFT;
}

export const getDAOBalances = async (daoId: string, network: Network) => {
  const url = `${API_URL}/account/${network}/${daoId}/token_balances`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch contract storage from BakingBad API");
  }

  const result: TokenBalancesDTO = await response.json();

  return result.balances.map((daoTokenDTO) =>
    isNFTDTO(daoTokenDTO)
      ? {
          balance: parseUnits(
            new BigNumber(daoTokenDTO.balance),
            daoTokenDTO.decimals
          ),
          token: new NFT(daoTokenDTO),
        }
      : {
          balance: parseUnits(
            new BigNumber(daoTokenDTO.balance),
            daoTokenDTO.decimals
          ),
          token: new Token(daoTokenDTO),
        }
  );
};

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

  const resultingTokens: DAOToken[] = await response.json();
  const result = resultingTokens[0]

  return isNFTDTO(result)
  ? new NFT(result)
  : 
  new Token(result)
};
