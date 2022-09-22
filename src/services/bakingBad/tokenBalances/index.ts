import BigNumber from "bignumber.js";
import { NFT, Token } from "models/Token";
import { Network } from "services/beacon";
import { parseUnits } from "services/contracts/utils";
import { networkNameMap } from "..";
import { BalanceTZKT, DAOToken, FA2TokenDTO, NFTDTO, TokenDataTZKT } from "./types";

const isNFTDTO = (value: DAOToken): value is NFTDTO =>
  value.hasOwnProperty("artifact_uri");

const isBalanceTzktNFT = (value: BalanceTZKT): boolean => Boolean(value.token.metadata?.artifactUri)

const isTokenTzktNFT = (value: TokenDataTZKT): boolean => Boolean(value.metadata?.artifactUri)

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

export const getDAOBalances = async (daoId: string, network: Network, offset = 0, balances: DAOBalance[] = []): Promise<DAOBalance[]> => {
  const url = `https://api.${networkNameMap[network]}.tzkt.io/v1/tokens/balances?account=${daoId}&limit=${ELEMENTS_PER_REQUEST}&offset=${offset}`
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch contract storage from BakingBad API");
  }

  const result: BalanceTZKT[] = await response.json();

  if(result.length === 0) {  
    return balances
  }
  
  const tokenBalances: DAOToken[] = await Promise.all(result.map(async (balance: BalanceTZKT) => {
    const urlTokenData = `https://api.${networkNameMap[network]}.tzkt.io/v1/tokens?contract=${balance.token.contract.address}&tokenId=${balance.token.tokenId}`
    const responseTokenData = await fetch(urlTokenData);
    const resultTokenDataTzkt: TokenDataTZKT[] = await responseTokenData.json();
    const tokenData = resultTokenDataTzkt[0]

    if (isBalanceTzktNFT(balance)){
      const tokenBalance: NFTDTO = {
        id: balance.token.id.toString(),
        supply: tokenData.totalSupply,
        contract: balance.token.contract.address,
        token_id: parseInt(balance.token.tokenId),
        network: network,
        symbol: tokenData.metadata?.symbol || "",
        level: balance.firstLevel,
        name: tokenData.metadata?.name || "",
        decimals: parseInt(tokenData.metadata?.decimals) || 0,
        description: tokenData.metadata?.description || "",
        artifact_uri: tokenData.metadata?.artifactUri || "",
        thumbnail_uri: tokenData.metadata?.thumbnailUri || "",
        is_transferable: tokenData.metadata?.isTransferable,
        creators: tokenData.metadata?.creators || [],
        tags: tokenData.metadata?.tags || [],
        formats: tokenData.metadata.formats || [{
          mimeType: "",
          uri: "",
        }],
        balance: balance.balance,
      }
      return tokenBalance
    } else {
      const tokenBalance: FA2TokenDTO = {
        id: balance.token.id.toString(),
        supply: tokenData.totalSupply,
        contract: balance.token.contract.address,
        token_id: parseInt(balance.token.tokenId),
        network: network,
        symbol: tokenData.metadata?.symbol || "",
        level: balance.firstLevel,
        name: tokenData.metadata?.name || "",
        decimals: parseInt(tokenData.metadata?.decimals) || 0,
        balance: balance.balance,
      }
      return tokenBalance
    }
  }))

  const fetchedBalances = tokenBalances.map((daoTokenDTO) =>
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
  const url = `https://api.${networkNameMap[network]}.tzkt.io/v1/tokens?contract=${contractAddress}&tokenId=${tokenId}`
  
  const response = await fetch(url);
  console.log("response: ", response);
  if (!response.ok) {
    throw new Error("Failed to fetch proposals from BakingBad API");
  }

  const resultTokenDataTzkt: TokenDataTZKT[] = await response.json();
  const tokenData = resultTokenDataTzkt[0]

  let result: DAOToken;

  if(isTokenTzktNFT(tokenData)){
    result = {
      id: tokenData.id.toString(),
      supply: tokenData.totalSupply,
      contract: tokenData.contract.address,
      token_id: parseInt(tokenData.tokenId),
      network: network,
      symbol: tokenData.metadata?.symbol || "",
      level: tokenData.firstLevel,
      name: tokenData.metadata?.name || "",
      decimals: parseInt(tokenData.metadata?.decimals) || 0,
      description: tokenData.metadata?.description || "",
      artifact_uri: tokenData.metadata?.artifactUri || "",
      thumbnail_uri: tokenData.metadata?.thumbnailUri || "",
      is_transferable: tokenData.metadata.isTransferable,
      creators: tokenData.metadata?.creators,
      tags: tokenData.metadata?.tags,
      formats: tokenData.metadata?.formats,
      balance: "",
    }
  } else {
    result = {
      id: tokenData.id.toString(),
      supply: tokenData.totalSupply,
      contract: tokenData.contract.address,
      token_id: parseInt(tokenData.tokenId),
      network: network,
      symbol: tokenData.metadata?.symbol || "",
      level: tokenData.firstLevel,
      name: tokenData.metadata?.name || "",
      decimals: parseInt(tokenData.metadata?.decimals) || 0,
      balance: "",
    }
  }

  return isNFTDTO(result) ? new NFT(result) : new Token(result);
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
