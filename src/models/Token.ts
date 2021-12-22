import BigNumber from "bignumber.js";
import { Network } from "services/beacon/context";

interface TokenParams {
  id: string;
  contract: string;
  level: number;
  token_id: number;
  symbol: string;
  name: string;
  decimals: number;
  network: Network;
  supply: string;
}

export type NFTFormat = "image/jpeg" | "video/mp4"

interface NFTParams extends TokenParams {
  description: string;
  artifact_uri: string;
  thumbnail_uri: string;
  is_transferable: boolean;
  creators: string[];
  tags: string[];
  formats?: {
    mimeType: string;
    uri: string;
  }[];
}

export class Token {
  id: string;
  contract: string;
  level: number;
  token_id: number;
  symbol: string;
  name: string;
  decimals: number;
  network: Network;
  supply: BigNumber;

  constructor(params: TokenParams) {
    this.id = params.id;
    this.contract = params.contract;
    this.level = params.level;
    this.token_id = params.token_id;
    this.symbol = params.symbol;
    this.name = params.name;
    this.decimals = params.decimals;
    this.network = params.network;
    this.supply = new BigNumber(params.supply);
  }
}

export const extractQmHash = (ipfsUri: string) => {
  if (!ipfsUri) {
    return ipfsUri;
  }

  return ipfsUri.startsWith("ipfs://") ? ipfsUri.split("ipfs://")[1] : ipfsUri;
};

export class NFT extends Token {
  description: string;
  artifact_uri: string;
  thumbnail_uri: string;
  artifact_hash: string;
  thumbnail_hash: string;
  is_transferable: boolean;
  creators: string[];
  tags: string[];
  preferredFormat: NFTFormat;
  formats: NFTFormat[];

  constructor(params: NFTParams) {
    super(params);

    this.thumbnail_hash = extractQmHash(params.thumbnail_uri);
    this.artifact_hash = extractQmHash(params.artifact_uri);

    this.description = params.description;
    this.artifact_uri = params.artifact_uri;
    this.thumbnail_uri = params.thumbnail_uri;
    this.is_transferable = params.is_transferable;
    this.creators = params.creators;
    this.tags = params.tags;
    this.formats = ["image/jpeg"]

    if(params.formats) {
      this.formats = params.formats.map(format => format.mimeType as NFTFormat);
    }

    //On BakingBad's APIs, it's simply the first one
    this.preferredFormat = this.formats[0]
  }
}
