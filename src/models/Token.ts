import BigNumber from "bignumber.js"
import { Network } from "services/beacon"

interface TokenParams {
  id: string
  contract: string
  token_id: number
  symbol: string
  name: string
  decimals: number
  network: Network
  supply: string
  standard: string
}

export const SUPPORTED_MIME_TYPES = [
  "image/jpeg",
  "image/gif",
  "image/png",
  "video/mp4",
  "audio/mpeg",
  "audio/x-wav"
] as const
export const SUPPORTED_MEDIA_TYPES = ["image", "audio", "video"] as const

export type NFTMimeType = (typeof SUPPORTED_MIME_TYPES)[number] | "unknown"
export type NFTMediaType = (typeof SUPPORTED_MEDIA_TYPES)[number] | "unknown"

interface NFTParams extends TokenParams {
  description: string
  artifact_uri: string
  thumbnail_uri: string
  is_transferable: boolean
  creators?: string[]
  tags?: string[]
  formats?: {
    mimeType: string
    uri: string
  }[]
}

export class Token {
  id: string
  contract: string
  token_id: number
  symbol: string
  name: string
  decimals: number
  network: Network
  supply: BigNumber
  standard: string

  constructor(params: TokenParams) {
    this.id = params.id
    this.contract = params.contract
    this.token_id = params.token_id
    this.symbol = params.symbol
    this.name = params.name
    this.decimals = params.decimals
    this.network = params.network
    this.supply = new BigNumber(params.supply)
    this.standard = params.standard ? params.standard : ""
  }
}

export const extractQmHash = (ipfsUri: string) => {
  if (!ipfsUri) {
    return ipfsUri
  }

  return ipfsUri.startsWith("ipfs://") ? ipfsUri.split("ipfs://")[1] : ipfsUri
}

const getFormatTag = (mimeType: NFTMimeType) => {
  if (mimeType.includes("video")) {
    return "video"
  }

  if (mimeType.includes("audio")) {
    return "audio"
  }

  if (mimeType.includes("image")) {
    return "image"
  }

  return "unknown"
}

export class NFT extends Token {
  description: string
  artifact_uri: string
  thumbnail_uri: string
  artifact_hash: string
  thumbnail_hash: string
  is_transferable: boolean
  creators: string[]
  firstCreator?: string
  tags: string[]
  preferredFormat: NFTMimeType
  mediaType: NFTMediaType
  formats: NFTMimeType[]

  constructor(params: NFTParams) {
    super(params)

    this.thumbnail_hash = extractQmHash(params.thumbnail_uri)
    this.artifact_hash = extractQmHash(params.artifact_uri)

    this.description = params.description
    this.artifact_uri = params.artifact_uri
    this.thumbnail_uri = params.thumbnail_uri
    this.is_transferable = params.is_transferable
    this.tags = params.tags || []
    this.formats = ["image/jpeg"]
    this.creators = []

    if (params.creators && params.creators.length) {
      this.firstCreator = params.creators[0]
      this.creators = params.creators
    }

    if (params.formats) {
      this.formats = params.formats.map(format =>
        SUPPORTED_MIME_TYPES.includes(format.mimeType as any) ? (format.mimeType as NFTMimeType) : "unknown"
      )
    }

    //On BakingBad's APIs, it's simply the first one
    this.preferredFormat = this.formats[0]

    this.mediaType = getFormatTag(this.preferredFormat)
  }
}
