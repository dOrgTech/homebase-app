import BigNumber from "bignumber.js";
import { NFT, Token } from "models/Token";
import { Network } from "services/beacon";
import { parseUnits } from "services/contracts/utils";
import { API_URL, networkNameMap } from "..";
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

const ELEMENTS_PER_REQUEST = 50;

interface DAOBalance {
  balance: BigNumber;
  token: Token;
}

export const getDAOBalances = async (
  daoId: string,
  network: Network,
  offset = 0,
  balances: DAOBalance[] = []
): Promise<DAOBalance[]> => {
  const url = `${API_URL}/account/${networkNameMap[network]}/${daoId}/token_balances?size=${ELEMENTS_PER_REQUEST}&offset=${offset}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch contract storage from BakingBad API");
  }

  const result: TokenBalancesDTO = await response.json();

  if (offset > result.total) {
    return balances;
  }

  const fetchedBalances = result.balances.map((daoTokenDTO) =>
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

  return getDAOBalances(
    daoId,
    network,
    offset + ELEMENTS_PER_REQUEST,
    balances.concat(fetchedBalances)
  );
};

export const getTokenMetadata = async (
  contractAddress: string,
  network: Network,
  tokenId: string
) => {
  console.log("API_URL: ", API_URL);
  const url = `${API_URL}/tokens/${networkNameMap[network]}/metadata?contract=${contractAddress}&token_id=${tokenId}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch proposals from BakingBad API");
  }

  const resultingTokens: DAOToken[] = await response.json();
  const result = resultingTokens[0];

  return isNFTDTO(result) ? new NFT(result) : new Token(result);
};
