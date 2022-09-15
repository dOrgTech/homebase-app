import BigNumber from "bignumber.js";
import {NFT, Token} from "models/Token";
import { Network } from "services/beacon";
import { parseUnits } from "services/contracts/utils";
import { API_URL, networkNameMap } from "..";
import { Balance, DAOToken, FA2TokenDTO, NFTDTO, TokenBalancesDTO, TokenData } from "./types";

const isNFTDTO = (value: DAOToken): value is NFTDTO =>
  value.hasOwnProperty("artifact_uri");

export interface DAOHolding {
  balance: BigNumber;
  token: Token;
}

export interface NFTDAOHolding extends DAOHolding {
  token: NFT;
}

const ELEMENTS_PER_REQUEST = 50

interface DAOBalance {
  balance: BigNumber,
  token: Token
}

export const getDAOBalances = async (daoId: string, network: Network, offset = 0, balances: DAOBalance[] = []): Promise<DAOBalance[]> => {
  const url = `https://api.${networkNameMap[network]}.tzkt.io/v1/tokens/balances?account=${daoId}&limit=${ELEMENTS_PER_REQUEST}&offset=${offset}`
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch contract storage from BakingBad API");
  }

  // const result: TokenBalancesDTO = await response.json();
  const result: Balance[] = await response.json();

  if(offset > result.length) {
    return balances
  }

  const tokenBalances: DAOToken[] = result.map((balance: Balance) => {
    if (balance.token.metadata?.artifactUri){
      const tokenBalance: NFTDTO = {
        id: balance.id.toString(),
        supply: balance.balance,
        contract: balance.token.contract.address,
        token_id: balance.token.id,
        network: network,
        symbol: balance.token.metadata?.symbol || "",
        level: balance.firstLevel,
        name: balance.token.metadata?.name || "",
        decimals: parseInt(balance.token.metadata?.decimals) || 0,
        description: balance.token.metadata?.description || "",
        artifact_uri: balance.token.metadata?.artifactUri,
        thumbnail_uri: balance.token.metadata?.thumbnailUri,
        is_transferable: true,
        creators: balance.token.metadata?.creators,
        tags: balance.token.metadata?.tags,
        formats: balance.token.metadata?.formats,
        balance: balance.balance,
      }
      return tokenBalance
    } else {
      const tokenBalance: FA2TokenDTO = {
        id: balance.id.toString(),
        supply: balance.balance,
        contract: balance.token.contract.address,
        token_id: balance.token.id,
        network: network,
        symbol: balance.token.metadata?.symbol || "",
        level: balance.firstLevel,
        name: balance.token.metadata?.name || "",
        decimals: parseInt(balance.token.metadata?.decimals) || 0,
        balance: balance.balance,
      }
      return tokenBalance
    }
  })

  const tokenBalancesDTO: TokenBalancesDTO = {  
    balances: tokenBalances,
    total: tokenBalances.length
  }
  
  const fetchedBalances = tokenBalancesDTO.balances.map((daoTokenDTO) =>
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

  return getDAOBalances(daoId, network, offset + ELEMENTS_PER_REQUEST, balances.concat(fetchedBalances))
};

export const getTokenMetadata = async (
  contractAddress: string,
  network: Network,
  tokenId: string
) => {
  const url = `https://api.${networkNameMap[network]}.tzkt.io/v1/tokens?contract=${contractAddress}&tokenId=${tokenId}`
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch proposals from BakingBad API");
  }

  const resultingTokens: TokenData[] = await response.json();
  const resultTokenData = resultingTokens[0]

  let result: DAOToken;

  if(resultTokenData.metadata?.artifactUri){
    result = {
      id: resultTokenData.id.toString(),
      supply: resultTokenData.totalSupply,
      contract: resultTokenData.contract.address,
      token_id: parseInt(resultTokenData.tokenId),
      network: network,
      symbol: resultTokenData.metadata?.symbol || "",
      level: resultTokenData.firstLevel,
      name: resultTokenData.metadata?.name || "",
      decimals: parseInt(resultTokenData.metadata?.decimals) || 0,
      description: resultTokenData.metadata?.description || "",
      artifact_uri: resultTokenData.metadata?.artifactUri,
      thumbnail_uri: resultTokenData.metadata?.thumbnailUri,
      is_transferable: true,
      creators: resultTokenData.metadata?.creators,
      tags: resultTokenData.metadata?.tags,
      formats: resultTokenData.metadata?.formats,
      balance: "",
    }
  } else {
    result = {
      id: resultTokenData.id.toString(),
      supply: resultTokenData.totalSupply,
      contract: resultTokenData.contract.address,
      token_id: parseInt(resultTokenData.tokenId),
      network: network,
      symbol: resultTokenData.metadata?.symbol || "",
      level: resultTokenData.firstLevel,
      name: resultTokenData.metadata?.name || "",
      decimals: parseInt(resultTokenData.metadata?.decimals) || 0,
      balance: "",
    }
  }

  return isNFTDTO(result)
    ? new NFT(result)
    :
    new Token(result)
};

export const getUserTokenBalance = async (
  accountAddress: string,
  network: Network = "mainnet",
  tokenAddress = ""
) => {
  const url = `https://api.${networkNameMap[network]}.tzkt.io/v1/tokens/balances/?account=${accountAddress}`;

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error("Failed to fetch user balances");
  }
  
  const userTokens =  await response.json();

  const userTokenBalance = userTokens.filter((token: any) => token.token.contract.address === tokenAddress);

  if (userTokenBalance && userTokenBalance[0]) {
    return userTokenBalance[0].balance;
  }

}
